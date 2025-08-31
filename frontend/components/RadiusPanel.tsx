import React from 'react';

interface RadiusPanelProps {
  radiusMode: boolean;
  selectedRadius: number;
  centerPoint: { lat: number; lng: number } | null;
  onRadiusModeToggle: () => void;
  onRadiusChange: (radius: number) => void;
  onRadiusOptimize: () => void;
  radiusResults: any[];
  radiusLoading: boolean;
}

const RadiusPanel: React.FC<RadiusPanelProps> = ({
  radiusMode,
  selectedRadius,
  centerPoint,
  onRadiusModeToggle,
  onRadiusChange,
  onRadiusOptimize,
  radiusResults,
  radiusLoading
}) => {
  const radiusOptions = [25, 50, 100, 150, 200, 300, 500];

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-200">
          Radius Search
        </h3>
        <button
          onClick={onRadiusModeToggle}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            radiusMode 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          {radiusMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {radiusMode && (
        <div className="space-y-4">
          {/* Instructions */}
          <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-800">
            <p className="text-xs text-blue-200">
              {centerPoint 
                ? `📍 Center: ${centerPoint.lat.toFixed(3)}, ${centerPoint.lng.toFixed(3)}` 
                : '👆 Click on the map to set center point'
              }
            </p>
          </div>

          {/* Radius Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Radius: {selectedRadius}km
            </label>
            <div className="grid grid-cols-3 gap-2">
              {radiusOptions.map(radius => (
                <button
                  key={radius}
                  onClick={() => onRadiusChange(radius)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    selectedRadius === radius
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {radius}km
                </button>
              ))}
            </div>
          </div>

          {/* Optimize Button */}
          <button
            onClick={onRadiusOptimize}
            disabled={!centerPoint || radiusLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {radiusLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing {selectedRadius}km Area...
              </>
            ) : (
              `🔍 Find Top 3 Spots in ${selectedRadius}km`
            )}
          </button>

          {/* Results Info */}
          {radiusResults.length > 0 && (
            <div className="p-3 bg-green-900/30 rounded border border-green-800">
              <p className="text-sm text-green-200 font-medium">
                🎯 Top {radiusResults.length} locations found within {selectedRadius}km
              </p>
              <p className="text-xs text-green-300 mt-1">
                Based on your priority weights and ML optimization
              </p>
            </div>
          )}
          
          {/* No results warning */}
          {!radiusLoading && radiusResults.length === 0 && centerPoint && (
            <div className="p-3 bg-yellow-900/30 rounded border border-yellow-800">
              <p className="text-sm text-yellow-200">
                Click "Find Top 3 Spots" to analyze this area
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RadiusPanel;
