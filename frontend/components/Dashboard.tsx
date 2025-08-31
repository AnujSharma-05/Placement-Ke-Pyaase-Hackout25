import React, { useState, useCallback, useEffect } from 'react';
import L from 'leaflet';
import Map from './Map';
import { InfrastructureType, AnalysisResult } from '../types';
import Navbar from './Navbar';
import AnalysisSidebar from './AnalysisSidebar';
import { getInitialMapData, optimizePoint, getReasoning, optimizeGrid, optimizeRadius, analyzePowerSupply } from '../src/services/api';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  // Backend data state
  const [initialData, setInitialData] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [reasoning, setReasoning] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // For feasibility analysis
  const [feasibilityResult, setFeasibilityResult] = useState(null);
  const [isFeasibilityLoading, setIsFeasibilityLoading] = useState(false);

  // For optimize-grid
  const [sliderValues, setSliderValues] = useState({ power: 33, market: 33, logistics: 34 });
  const [numResults, setNumResults] = useState(5);
  const [gridResults, setGridResults] = useState<AnalysisResult[]>([]);
  const [gridLoading, setGridLoading] = useState(false);

  // For radius-based analysis
  const [radiusMode, setRadiusMode] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState(100); // Default 100km
  const [centerPoint, setCenterPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusResults, setRadiusResults] = useState<AnalysisResult[]>([]);
  const [radiusLoading, setRadiusLoading] = useState(false);

  // For power supply analysis
  const [powerSupplyResult, setPowerSupplyResult] = useState(null);
  const [isPowerSupplyLoading, setIsPowerSupplyLoading] = useState(false);

  // Map state
  const [visibleLayers, setVisibleLayers] = useState<{ [key in InfrastructureType]?: boolean }>({
    demand: true,
    hub: true,
    solar: true,
    wind: true,
  });
  const [pinpoint, setPinpoint] = useState<{ lat: number; lng: number } | null>(null);
  const [optimizedLocations, setOptimizedLocations] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInitialMapData();
        setInitialData(data);
      } catch (err) {
        setError('Failed to load map data. Is the backend running?');
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Map click handler - Updated for both feasibility analysis and radius mode
  const handleMapClick = useCallback(async (latitude: number, longitude: number) => {
    setError('');
    setReasoning('');
    setPinpoint({ lat: latitude, lng: longitude });
    
    // If radius mode is enabled, set this as the center point
    if (radiusMode) {
      setCenterPoint({ lat: latitude, lng: longitude });
      // Don't run feasibility analysis in radius mode, just set the center
      return;
    }
    
    // Normal feasibility analysis
    setIsFeasibilityLoading(true);
    
    const coordinate = { latitude, longitude };
    // Use current slider values for weights
    const total = sliderValues.power + sliderValues.market + sliderValues.logistics;
    const weights = {
      power: sliderValues.power / total,
      market: sliderValues.market / total,
      logistics: sliderValues.logistics / total,
    };
    
    try {
      // Get feasibility score
      const scoreResult = await optimizePoint(coordinate, weights);
      setFeasibilityResult(scoreResult);
      setOptimizationResult(scoreResult);
      
      // Get AI reasoning
      const reasoningResult = await getReasoning(scoreResult, weights);
      setReasoning(reasoningResult.reasoning);
    } catch (err) {
      setError('Failed to get analysis. Please try again.');
      console.error(err);
    } finally {
      setIsFeasibilityLoading(false);
    }
  }, [sliderValues, radiusMode]);

  const handleLayerToggle = useCallback((layer: InfrastructureType) => {
    setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  const handleSliderChange = useCallback((sliderName: string, value: number) => {
    setSliderValues(prev => ({ ...prev, [sliderName]: value }));
  }, []);

  const handleNumResultsChange = useCallback((value: number) => {
    setNumResults(value);
  }, []);

  // Radius mode handlers
  const handleRadiusModeToggle = useCallback(() => {
    setRadiusMode(prev => !prev);
    // Clear previous results when toggling mode
    if (!radiusMode) {
      setRadiusResults([]);
      setCenterPoint(null);
    } else {
      setGridResults([]);
    }
  }, [radiusMode]);

  const handleRadiusChange = useCallback((radius: number) => {
    setSelectedRadius(radius);
  }, []);

  // Helper function to calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Helper function to get approximate location name from coordinates
  const getLocationName = async (latitude: number, longitude: number): Promise<string> => {
    try {
      // Using OpenStreetMap's Nominatim API for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Extract meaningful location components
        const address = data.address || {};
        const city = address.city || address.town || address.village || address.suburb;
        const state = address.state;
        const district = address.state_district;
        
        // Build a meaningful name
        if (city && state) {
          return `${city}, ${state}`;
        } else if (district && state) {
          return `${district}, ${state}`;
        } else if (state) {
          return `Near ${state}`;
        } else {
          return `Location ${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`;
        }
      }
    } catch (error) {
      console.warn('Failed to get location name:', error);
    }
    
    // Fallback to coordinates
    return `Location ${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`;
  };

  // Optimize grid handler
  const handleOptimizeGrid = useCallback(async () => {
    setGridLoading(true);
    setError('');
    try {
      const total = sliderValues.power + sliderValues.market + sliderValues.logistics;
      const weights = {
        power: sliderValues.power / total,
        market: sliderValues.market / total,
        logistics: sliderValues.logistics / total,
      };
      const response = await optimizeGrid(weights, numResults);
      
      // Format results with location names
      const formattedResults = await Promise.all(
        response.results.map(async (result: any, index: number) => {
          // Get the location name for each coordinate
          const locationName = await getLocationName(result.latitude, result.longitude);
          
          return {
            id: index,
            name: locationName, // Now using actual location name instead of "Station X"
            coords: [result.latitude, result.longitude] as L.LatLngTuple,
            score: result.overallScore,
            details: {
              power: result.subScores.power,
              market: result.subScores.market,
              logistics: result.subScores.logistics
            }
          };
        })
      );
      
      setGridResults(formattedResults);
      setOptimizedLocations(response.results); // For map display
    } catch (err) {
      setError('Failed to optimize grid');
      console.error('Grid optimization error:', err);
    } finally {
      setGridLoading(false);
    }
  }, [sliderValues, numResults]);

  // Radius-based optimization handler
  const handleRadiusOptimization = useCallback(async () => {
    if (!centerPoint) {
      setError('Please click on the map to select a center point first');
      return;
    }

    setRadiusLoading(true);
    setError('');
    
    try {
      const total = sliderValues.power + sliderValues.market + sliderValues.logistics;
      const weights = {
        power: sliderValues.power / total,
        market: sliderValues.market / total,
        logistics: sliderValues.logistics / total,
      };
      
      // Use the new radius optimization API
      const response = await optimizeRadius(
        { latitude: centerPoint.lat, longitude: centerPoint.lng }, 
        selectedRadius, 
        weights, 
        3 // Always get top 3 results
      );
      
      console.log('Radius optimization response:', response);
      
      // Format results with location names
      const formattedResults = await Promise.all(
        response.results.map(async (result: any, index: number) => {
          const locationName = await getLocationName(result.latitude, result.longitude);
          
          return {
            id: index,
            name: `${locationName} (${result.distanceFromCenter}km away)`,
            coords: [result.latitude, result.longitude] as L.LatLngTuple,
            score: result.overallScore,
            details: {
              power: result.subScores.power,
              market: result.subScores.market,
              logistics: result.subScores.logistics
            }
          };
        })
      );
      
      setRadiusResults(formattedResults);
      setOptimizedLocations(response.results); // For map display
      
      // Show success message with analysis info
      console.log(`✅ Found ${response.results.length} locations within ${selectedRadius}km radius (analyzed ${response.gridPointsAnalyzed} grid points)`);
      
    } catch (err) {
      setError('Failed to find locations within radius');
      console.error('Radius optimization error:', err);
    } finally {
      setRadiusLoading(false);
    }
  }, [centerPoint, selectedRadius, sliderValues, getLocationName]);
  
  const handleAnalyzePowerSupply = useCallback(async (requiredCapacity: number) => {
    if (!pinpoint) {
      console.error('No pinpoint selected for power supply analysis');
      return;
    }

    setIsPowerSupplyLoading(true);
    setError('');
    setPowerSupplyResult(null);

    try {
      const coordinate = {
        latitude: pinpoint.lat,
        longitude: pinpoint.lng
      };

      const response = await analyzePowerSupply(coordinate, requiredCapacity);
      
      console.log('Power supply analysis response:', response);
      setPowerSupplyResult(response);

    } catch (err) {
      setError('Failed to analyze power supply');
      console.error('Power supply analysis error:', err);
    } finally {
      setIsPowerSupplyLoading(false);
    }
  }, [pinpoint]);
  
  const handleResultClick = useCallback((coords: L.LatLngTuple) => {
    setPinpoint({ lat: coords[0], lng: coords[1] });
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-800">
      <Navbar onLogout={onLogout} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <AnalysisSidebar
          visibleLayers={visibleLayers}
          onLayerToggle={handleLayerToggle}
          pinpoint={pinpoint}
          sliderValues={sliderValues}
          numResults={numResults}
          onSliderChange={handleSliderChange}
          onNumResultsChange={handleNumResultsChange}
          onOptimizeGrid={handleOptimizeGrid}
          isLoading={gridLoading}
          results={gridResults}
          onResultClick={handleResultClick}
          feasibilityResult={feasibilityResult}
          isFeasibilityLoading={isFeasibilityLoading}
          radiusMode={radiusMode}
          selectedRadius={selectedRadius}
          centerPoint={centerPoint}
          onRadiusModeToggle={handleRadiusModeToggle}
          onRadiusChange={handleRadiusChange}
          onRadiusOptimize={handleRadiusOptimization}
          radiusResults={radiusResults}
          radiusLoading={radiusLoading}
          powerSupplyResult={powerSupplyResult}
          isPowerSupplyLoading={isPowerSupplyLoading}
          onAnalyzePowerSupply={handleAnalyzePowerSupply}
        />

        {/* Center Map */}
        <main className="flex-1 relative">
          {initialData ? (
            <Map 
              dataLayers={initialData}
              visibleLayers={visibleLayers} 
              onMapClick={handleMapClick}
              optimizedLocations={optimizedLocations}
              pinpoint={pinpoint}
              radiusMode={radiusMode}
              centerPoint={centerPoint}
              selectedRadius={selectedRadius}
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <p className="text-2xl">Loading map data...</p>
            </div>
          )}
        </main>

        {/* Right Sidebar - Hydrogen Assistant */}
        <aside className="w-80 bg-gray-900 p-6 flex flex-col z-10 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">
              Hydrogen Assistant
            </h2>
            <div className="flex-1 flex flex-col bg-gray-800 rounded-lg p-4 min-h-0">
                {/* Scrollable Messages Container */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-0" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                    {/* Initial greeting message */}
                    <div className="p-3 bg-gray-700 rounded-lg self-start">
                        <p className="text-sm text-gray-200">
                          👋 Hi! I'm your AI assistant for hydrogen infrastructure analysis. 
                          Click on the map to get detailed insights about any location!
                        </p>
                    </div>
                    
                    {/* Loading message */}
                    {isFeasibilityLoading && (
                      <div className="p-3 bg-blue-800/50 rounded-lg self-start">
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                          <p className="text-sm text-gray-200">Analyzing location...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* AI Reasoning Response */}
                    {reasoning && !isFeasibilityLoading && (
                        <div className="p-3 bg-green-800 rounded-lg self-start">
                            <div className="flex items-start">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              <div>
                                <p className="text-xs font-medium text-green-300 mb-1">AI Analysis</p>
                                <p className="text-sm text-gray-200 leading-relaxed">{reasoning}</p>
                              </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Summary */}
                    {feasibilityResult && !isFeasibilityLoading && (
                      <div className="p-3 bg-purple-800/50 rounded-lg self-start">
                        <p className="text-xs font-medium text-purple-300 mb-2">Quick Summary</p>
                        <p className="text-sm text-gray-200">
                          📍 Location: {feasibilityResult.coordinate?.latitude.toFixed(3)}, {feasibilityResult.coordinate?.longitude.toFixed(3)}
                        </p>
                        <p className="text-sm text-gray-200 mt-1">
                          🏆 Overall Score: <span className="font-bold text-green-400">{feasibilityResult.overallScore}/10</span>
                        </p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-300">Power:</span>
                            <span className="text-blue-400">{feasibilityResult.subScores?.power}/10</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-300">Market:</span>
                            <span className="text-yellow-400">{feasibilityResult.subScores?.market}/10</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-300">Logistics:</span>
                            <span className="text-purple-400">{feasibilityResult.subScores?.logistics}/10</span>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
                
                {/* Input Area - Fixed at bottom */}
                <div className="mt-4 border-t border-gray-700 pt-4">
                    <textarea 
                        className="w-full h-16 p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        placeholder="Ask a question about hydrogen infrastructure..."
                        disabled
                    />
                    <p className="text-xs text-gray-500 text-center mt-2">
                      🤖 AI-powered insights • Interactive chat coming soon
                    </p>
                </div>
            </div>
        </aside>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="absolute top-20 right-4 text-red-500 bg-gray-900 p-3 rounded shadow-lg z-50">
          {error}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
