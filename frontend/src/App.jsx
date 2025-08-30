import React, { useState, useEffect } from 'react';
import { getInitialMapData, optimizePoint, getReasoning, optimizeGrid } from './services/api';
import AnalysisSidebar from '../components/AnalysisSidebar';
import Map from '../components/Map';

// Placeholder components - you will build these next
// const MapComponent = ({ mapData, onMapClick }) => <div>Map Placeholder</div>;
// const InfoPanel = ({ result, reasoning, isLoading }) => <div>Info Panel Placeholder</div>;

function App() {
  // ...existing code...
  const [initialData, setInitialData] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [reasoning, setReasoning] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // For optimize-grid
  const [sliderValues, setSliderValues] = useState({ power: 33, market: 33, logistics: 34 });
  const [numResults, setNumResults] = useState(5);
  const [gridResults, setGridResults] = useState([]);
  const [gridLoading, setGridLoading] = useState(false);

  // Add visible layers state for map
  const [visibleLayers, setVisibleLayers] = useState({
    demand: true,
    hub: true,
    renewable: true
  });

  // Add pinpoint state for map clicks
  const [pinpoint, setPinpoint] = useState(null);

  // Add optimized locations state
  const [optimizedLocations, setOptimizedLocations] = useState([]);

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

  // Map click handler (updated to set pinpoint)
  const handleMapClick = async (latitude, longitude) => {
    setError('');
    setReasoning('');
    setIsLoading(true);
    setPinpoint({ lat: latitude, lng: longitude });
    const coordinate = { latitude, longitude };
    const weights = { power: 0.4, market: 0.4, logistics: 0.2 };
    try {
      const scoreResult = await optimizePoint(coordinate, weights);
      setOptimizationResult(scoreResult);
      const reasoningResult = await getReasoning(scoreResult, weights);
      setReasoning(reasoningResult.reasoning);
    } catch (err) {
      setError('Failed to get analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Slider change handler
  const handleSliderChange = (sliderName, value) => {
    setSliderValues(prev => ({ ...prev, [sliderName]: value }));
  };
  const handleNumResultsChange = (value) => {
    setNumResults(value);
  };

  // Optimize grid handler (updated to format results and add to map)
  const handleOptimizeGrid = async () => {
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
      
      // Format results for the ResultsPanel
      const formattedResults = response.results.map((result, index) => ({
        id: index,
        name: `Station ${index + 1}`,
        coords: [result.latitude, result.longitude],
        score: result.overallScore,
        details: {
          power: result.subScores.power,
          market: result.subScores.market,
          logistics: result.subScores.logistics
        }
      }));
      
      setGridResults(formattedResults);
      setOptimizedLocations(response.results); // For map display
    } catch (err) {
      setError('Failed to optimize grid');
    } finally {
      setGridLoading(false);
    }
  };

  // Handle layer visibility toggle
  const handleLayerToggle = (layer) => {
    setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Handle result click (focus map on selected location)
  const handleResultClick = (coords) => {
    setPinpoint({ lat: coords[0], lng: coords[1] });
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 text-white">
      <header className="p-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-green-400">Green Hydrogen Feasibility Tool</h1>
      </header>
      <main className="flex flex-1 overflow-hidden">
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
        />
        <div className="flex-1 relative">
          {initialData ? (
            <Map
              dataLayers={initialData}
              visibleLayers={visibleLayers}
              onMapClick={handleMapClick}
              optimizedLocations={optimizedLocations}
              pinpoint={pinpoint}
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <p className="text-2xl">Loading map data...</p>
            </div>
          )}
        </div>
        {error && <div className="absolute top-4 right-4 text-red-500 bg-gray-900 p-2 rounded shadow-lg">{error}</div>}
      </main>
    </div>
  );
}

export default App;