import React, { useState, useEffect } from 'react';
import { getInitialMapData, optimizePoint, getReasoning } from './services/api';

// Placeholder components - you will build these next
// const MapComponent = ({ mapData, onMapClick }) => <div>Map Placeholder</div>;
// const InfoPanel = ({ result, reasoning, isLoading }) => <div>Info Panel Placeholder</div>;

function App() {
  // State to hold all data
  const [initialData, setInitialData] = useState(null); // For renewables, hubs etc.
  const [optimizationResult, setOptimizationResult] = useState(null); // For the score
  const [reasoning, setReasoning] = useState(''); // For the AI text
  const [isLoading, setIsLoading] = useState(false); // To show a loading spinner for the AI
  const [error, setError] = useState(''); // To show any errors

  // --- 1. Fetch initial data when the component mounts ---
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
  }, []); // The empty array [] means this runs only once on mount

  // --- 2. Handle a user clicking on the map ---
  const handleMapClick = async (latitude, longitude) => {
    setError(''); // Clear previous errors
    setReasoning(''); // Clear previous reasoning
    setIsLoading(true); // Start loading indicator

    const coordinate = { latitude, longitude };
    const weights = { power: 0.4, market: 0.4, logistics: 0.2 }; // Example weights

    try {
      // First, get the score
      const scoreResult = await optimizePoint(coordinate, weights);
      setOptimizationResult(scoreResult);
      
      // Immediately after, get the reasoning for that score
      const reasoningResult = await getReasoning(scoreResult, weights);
      setReasoning(reasoningResult.reasoning);

    } catch (err) {
      setError('Failed to get analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 text-white">
      <header className="p-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-green-400">Green Hydrogen Feasibility Tool</h1>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* You will pass the data down to your actual components as props */}
        
        {/* <MapComponent 
          initialData={initialData} 
          optimizationResult={optimizationResult}
          onMapClick={handleMapClick} 
        /> */}

        {/* <InfoPanel 
          result={optimizationResult}
          reasoning={reasoning}
          isLoading={isLoading}
          error={error}
        /> */}
        
        {/* For now, you can display the raw data to see if it's working */}
        <div className="w-1/3 p-4 bg-gray-800 overflow-y-auto">
          <h2 className="text-xl mb-4">Debug Panel</h2>
          <p>Click on the (imaginary) map to start analysis.</p>
          {isLoading && <p className="text-yellow-400">AI is analyzing...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {optimizationResult && (
            <pre className="mt-4 bg-gray-700 p-2 rounded text-sm">
              {JSON.stringify(optimizationResult, null, 2)}
            </pre>
          )}
          {reasoning && (
            <div className="mt-4 p-2 bg-blue-900/50 rounded">
              <h3 className="font-bold">AI Analyst Says:</h3>
              <p>{reasoning}</p>
            </div>
          )}
        </div>
        <div className="w-2/3 bg-gray-700 flex items-center justify-center">
            <p className="text-2xl">MAP AREA</p>
            {/* Example of how you would trigger the click handler */}
            <button 
              onClick={() => handleMapClick(23.0225, 72.5714)} 
              className="ml-4 p-2 bg-green-600 rounded hover:bg-green-500"
            >
              Test Click on Ahmedabad
            </button>
        </div>

      </main>
    </div>
  );
}

export default App;