import React from 'react';
import L from 'leaflet';

interface SlidersPanelProps {
    pinpoint: { lat: number; lng: number } | null;
    sliderValues: { power: number; market: number; logistics: number };
    numResults: number;
    onSliderChange: (sliderName: string, value: number) => void;
    onNumResultsChange: (value: number) => void;
    onOptimizeGrid: () => void;
    isLoading?: boolean;
}

const SlidersPanel: React.FC<SlidersPanelProps> = ({ pinpoint, sliderValues, numResults, onSliderChange, onNumResultsChange, onOptimizeGrid, isLoading }) => {
    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-200 mb-3 border-b border-gray-700 pb-2">
                Analysis Parameters
            </h2>
            <div className="bg-gray-900/50 p-3 rounded-md mb-4 text-center">
                <p className="text-sm font-medium text-gray-400">Selected Site Coordinates</p>
                {pinpoint ? (
                    <p className="text-md font-mono text-green-400 tracking-tight">
                        {pinpoint.lat.toFixed(4)}, {pinpoint.lng.toFixed(4)}
                    </p>
                ) : (
                    <p className="text-sm text-gray-500 italic">Click on the map to select a point</p>
                )}
            </div>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="power" className="text-sm font-medium text-gray-300">Power</label>
                        <span className="text-sm font-mono text-green-400">{sliderValues.power}%</span>
                    </div>
                    <input
                        id="power"
                        type="range"
                        min="0"
                        max="100"
                        value={sliderValues.power}
                        onChange={(e) => onSliderChange('power', parseInt(e.target.value, 10))}
                        className="w-full"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="market" className="text-sm font-medium text-gray-300">Market</label>
                        <span className="text-sm font-mono text-green-400">{sliderValues.market}%</span>
                    </div>
                    <input
                        id="market"
                        type="range"
                        min="0"
                        max="100"
                        value={sliderValues.market}
                        onChange={(e) => onSliderChange('market', parseInt(e.target.value, 10))}
                        className="w-full"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="logistics" className="text-sm font-medium text-gray-300">Logistics</label>
                        <span className="text-sm font-mono text-green-400">{sliderValues.logistics}%</span>
                    </div>
                    <input
                        id="logistics"
                        type="range"
                        min="0"
                        max="100"
                        value={sliderValues.logistics}
                        onChange={(e) => onSliderChange('logistics', parseInt(e.target.value, 10))}
                        className="w-full"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="numResults" className="text-sm font-medium text-gray-300">Number of Stations</label>
                        <span className="text-sm font-mono text-green-400">{numResults}</span>
                    </div>
                    <input
                        id="numResults"
                        type="number"
                        min="1"
                        max="20"
                        value={numResults}
                        onChange={(e) => onNumResultsChange(Number(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded focus:border-green-400 focus:outline-none"
                    />
                </div>
                <div className="pt-2">
                    <button
                        className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md disabled:opacity-50"
                        onClick={onOptimizeGrid}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Optimizing...' : 'Optimize Grid'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlidersPanel;
