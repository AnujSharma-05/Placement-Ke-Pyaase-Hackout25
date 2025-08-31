import React, { useState } from 'react';

interface PowerSupplyResult {
  analysis: {
    nearest_plants: Array<{
      State: string;
      capacity_mw: number;
      distance_km: number;
      type: string;
    }>;
    required_capacity_mw: number;
    supply_score: number;
    total_available_capacity_mw: number;
  };
  reasoning: string;
}

interface PowerSupplyPanelProps {
  pinpoint: { lat: number; lng: number } | null;
  result?: PowerSupplyResult;
  isLoading?: boolean;
  onAnalyzePowerSupply: (requiredCapacity: number) => void;
}

const PowerSupplyPanel: React.FC<PowerSupplyPanelProps> = ({
  pinpoint,
  result,
  isLoading,
  onAnalyzePowerSupply
}) => {
  const [requiredCapacity, setRequiredCapacity] = useState<number>(500);

  const handleAnalyze = () => {
    if (pinpoint) {
      onAnalyzePowerSupply(requiredCapacity);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-100 mb-3 flex items-center">
        ⚡ Power Supply Analysis
      </h3>
      
      {/* Capacity Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Required Capacity (MW)
        </label>
        <input
          type="number"
          value={requiredCapacity}
          onChange={(e) => setRequiredCapacity(Number(e.target.value))}
          min="1"
          max="10000"
          step="50"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter required capacity"
        />
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!pinpoint || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center mb-4"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Analyzing Power Supply...
          </>
        ) : (
          "🔍 Analyze Power Supply"
        )}
      </button>

      {/* Status */}
      {!pinpoint && (
        <div className="p-3 bg-yellow-900/30 rounded border border-yellow-800 mb-4">
          <p className="text-sm text-yellow-200">
            📍 Click on the map to select a location for analysis
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="p-3 bg-green-900/30 rounded border border-green-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-green-200">Supply Score</span>
              <span className="text-lg font-bold text-green-100">
                {result.analysis.supply_score.toFixed(1)}/10
              </span>
            </div>
            <div className="text-xs text-green-300 space-y-1">
              <div>Required: {result.analysis.required_capacity_mw} MW</div>
              <div>Available: {result.analysis.total_available_capacity_mw} MW</div>
              <div>Nearby Plants: {result.analysis.nearest_plants.length}</div>
            </div>
          </div>

          {/* Nearest Plants */}
          <div>
            <h4 className="text-md font-semibold text-gray-200 mb-2">
              🏭 Nearest Power Plants
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {result.analysis.nearest_plants.map((plant, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-700 rounded border border-gray-600"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-gray-100">
                        {plant.State}
                      </div>
                      <div className="text-xs text-gray-300">
                        {plant.type.charAt(0).toUpperCase() + plant.type.slice(1)} Plant
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-200">
                        {plant.capacity_mw} MW
                      </div>
                      <div className="text-xs text-gray-400">
                        {plant.distance_km.toFixed(1)} km
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Reasoning */}
          <div>
            <h4 className="text-md font-semibold text-gray-200 mb-2">
              🤖 AI Analysis
            </h4>
            <div className="p-3 bg-purple-900/30 rounded border border-purple-800">
              <div className="text-sm text-purple-100 whitespace-pre-wrap">
                {result.reasoning}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerSupplyPanel;
