import React, { useState, useCallback } from 'react';
import L from 'leaflet';
import Map from './Map';
import { InfrastructureType, AnalysisResult } from '../types';
import Navbar from './Navbar';
import AnalysisSidebar from './AnalysisSidebar';
import { mockAnalysisResults } from '../data/mockData';

interface DashboardProps {
  onLogout: () => void;
  onNavigate: (page: 'landing' | 'dashboard' | 'about') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, onNavigate }) => {
  const [visibleLayers, setVisibleLayers] = useState<{ [key in InfrastructureType]?: boolean }>({
    demand: true,
    hub: true,
    solar: false,
    wind: false,
  });
  const [pinpoint, setPinpoint] = useState<L.LatLng | null>(null);
  const [sliderValues, setSliderValues] = useState({ power: 50, market: 50, logistics: 50 });
  const [results] = useState<AnalysisResult[]>(mockAnalysisResults);

  const handleLayerToggle = useCallback((layer: InfrastructureType) => {
    setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  const handleMapClick = useCallback((latlng: L.LatLng) => {
    setPinpoint(latlng);
  }, []);

  const handleSliderChange = useCallback((sliderName: string, value: number) => {
    setSliderValues(prev => ({...prev, [sliderName]: value}));
  }, []);
  
  const handleResultClick = useCallback((coords: L.LatLngTuple) => {
    // Potentially pan the map to the result location
    console.log('Result clicked:', coords);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-800">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="dashboard" />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <AnalysisSidebar
          visibleLayers={visibleLayers}
          onLayerToggle={handleLayerToggle}
          pinpoint={pinpoint}
          sliderValues={sliderValues}
          onSliderChange={handleSliderChange}
          results={results}
          onResultClick={handleResultClick}
        />

        {/* Center Map */}
        <main className="flex-1 relative">
          <Map 
            visibleLayers={visibleLayers} 
            pinpoint={pinpoint}
            onMapClick={handleMapClick}
          />
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 bg-gray-900 p-6 flex flex-col z-10 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">Hydrogen Assistant</h2>
            <div className="flex-1 flex flex-col justify-between bg-gray-800 rounded-lg p-4">
                <div className="space-y-4 overflow-y-auto">
                    <div className="p-3 bg-gray-700 rounded-lg self-start max-w-xs">
                        <p className="text-sm text-gray-200">AI Assistant will soon help you analyze sites and policies.</p>
                    </div>
                </div>
                <div className="mt-4">
                    <textarea 
                        className="w-full h-16 p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Ask a question..."
                        disabled
                    />
                </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">Chatbot Coming Soon</p>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
