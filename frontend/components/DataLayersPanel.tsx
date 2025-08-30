import React from 'react';
import { InfrastructureType } from '../types';

interface DataLayersPanelProps {
    visibleLayers: { [key in InfrastructureType]?: boolean };
    onLayerToggle: (layer: InfrastructureType) => void;
}

const layerOptions: { id: InfrastructureType; label: string }[] = [
    { id: 'demand', label: 'Demand Centers' },
    { id: 'hub', label: 'Logistics Hubs' },
    { id: 'solar', label: 'Solar Plants' },
    { id: 'wind', label: 'Wind Farms' },
];

const DataLayersPanel: React.FC<DataLayersPanelProps> = ({ visibleLayers, onLayerToggle }) => {
    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-200 mb-3 border-b border-gray-700 pb-2">
                Data Layers
            </h2>
            <div className="space-y-2">
                {layerOptions.map(({ id, label }) => (
                    <label key={id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-green-500 focus:ring-green-500"
                            checked={!!visibleLayers[id]}
                            onChange={() => onLayerToggle(id)}
                        />
                        <span className="text-gray-300">{label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default DataLayersPanel;
