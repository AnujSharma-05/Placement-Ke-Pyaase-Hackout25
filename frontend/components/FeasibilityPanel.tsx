import React from 'react';

interface FeasibilityResult {
  overallScore: number;
  subScores: {
    power: number;
    market: number;
    logistics: number;
  };
  latitude: number;
  longitude: number;
  message?: string;
}

interface FeasibilityPanelProps {
  result: FeasibilityResult | null;
  isLoading: boolean;
  pinpoint: { lat: number; lng: number } | null;
}

const FeasibilityPanel: React.FC<FeasibilityPanelProps> = ({ 
  result, 
  isLoading, 
  pinpoint 
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-200 mb-3 border-b border-gray-700 pb-2">
        Site Feasibility Analysis
      </h2>
      
      {!pinpoint && (
        <div className="text-center text-gray-400 py-8">
          <div className="mb-3">
            <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-sm">Click on the map to analyze a location</p>
        </div>
      )}

      {pinpoint && isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-3"></div>
          <p className="text-sm text-gray-400">Analyzing location...</p>
        </div>
      )}

      {result && !isLoading && (
        <div className="space-y-4">
          {/* Location Info */}
          <div className="bg-gray-900/50 p-3 rounded-md">
            <p className="text-xs text-gray-400 mb-1">Selected Location</p>
            <p className="text-sm font-mono text-green-400">
              {result.latitude?.toFixed(4) || '0.0000'}, {result.longitude?.toFixed(4) || '0.0000'}
            </p>
          </div>

          {/* Overall Score */}
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-4 rounded-lg border border-green-500/20">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-200">Overall Feasibility</span>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-green-400 mr-2">
                  {result.overallScore || 0}
                </span>
                <div className="text-xs text-gray-400">/ 10</div>
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(result.overallScore || 0) * 10}%` }}
              ></div>
            </div>
          </div>

          {/* Sub Scores */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Score Breakdown</h3>
            
            {/* Power Score */}
            <div className="flex justify-between items-center p-3 bg-gray-900/30 rounded-md">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-300">Power Infrastructure</span>
              </div>
              <span className="text-sm font-medium text-blue-400">{result.subScores?.power || 0}</span>
            </div>

            {/* Market Score */}
            <div className="flex justify-between items-center p-3 bg-gray-900/30 rounded-md">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-300">Market Access</span>
              </div>
              <span className="text-sm font-medium text-orange-400">{result.subScores?.market || 0}</span>
            </div>

            {/* Logistics Score */}
            <div className="flex justify-between items-center p-3 bg-gray-900/30 rounded-md">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-300">Logistics</span>
              </div>
              <span className="text-sm font-medium text-cyan-400">{result.subScores?.logistics || 0}</span>
            </div>
          </div>

          {/* Recommendation */}
          <div className={`p-3 rounded-md ${
            result.overallScore >= 7.5 ? 'bg-green-500/10 border border-green-500/30' :
            result.overallScore >= 5.0 ? 'bg-yellow-500/10 border border-yellow-500/30' :
            'bg-red-500/10 border border-red-500/30'
          }`}>
            <p className={`text-xs font-medium mb-1 ${
              result.overallScore >= 7.5 ? 'text-green-400' :
              result.overallScore >= 5.0 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {result.overallScore >= 7.5 ? 'Highly Recommended' :
               result.overallScore >= 5.0 ? 'Moderately Suitable' :
               'Not Recommended'}
            </p>
            <p className="text-xs text-gray-400">
              {result.overallScore >= 7.5 ? 'Excellent location for hydrogen infrastructure development' :
               result.overallScore >= 5.0 ? 'Decent potential with some considerations needed' :
               'Location may face significant challenges for development'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeasibilityPanel;
