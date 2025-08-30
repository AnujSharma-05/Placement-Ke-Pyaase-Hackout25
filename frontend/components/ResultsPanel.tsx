import React from 'react';
import L from 'leaflet';
import { AnalysisResult } from '../types';

interface ResultsPanelProps {
  results: AnalysisResult[];
  onResultClick: (coords: L.LatLngTuple) => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, onResultClick }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-200 mb-3 border-b border-gray-700 pb-2">
        Top Sites
      </h2>
      <ul className="space-y-3">
        {results.map((result, index) => (
          <li
            key={result.id}
            className="bg-gray-900/50 p-3 rounded-md hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
            onClick={() => onResultClick(result.coords)}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-100">
                  <span className="text-gray-500 mr-2">{index + 1}.</span>
                  {result.name}
                </p>
                <div className="flex space-x-3 mt-1 text-xs">
                    <span className="text-blue-400">P: {result.details.power}</span>
                    <span className="text-orange-400">M: {result.details.market}</span>
                    <span className="text-cyan-400">L: {result.details.logistics}</span>
                </div>
              </div>
              <div className="flex items-center justify-center h-10 w-10 bg-green-500/10 border-2 border-green-500 rounded-full">
                <span className="font-bold text-green-400">{result.score}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsPanel;
