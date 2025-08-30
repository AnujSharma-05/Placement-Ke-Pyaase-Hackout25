import React from 'react';
import L from 'leaflet';
import { InfrastructureType, AnalysisResult } from '../types';
import DataLayersPanel from './DataLayersPanel';
import SlidersPanel from './SlidersPanel';
import ResultsPanel from './ResultsPanel';
import FeasibilityPanel from './FeasibilityPanel';

interface AnalysisSidebarProps {
  visibleLayers: { [key in InfrastructureType]?: boolean };
  onLayerToggle: (layer: InfrastructureType) => void;
  pinpoint: { lat: number; lng: number } | null;
  sliderValues: { power: number; market: number; logistics: number };
  numResults: number;
  onSliderChange: (sliderName: string, value: number) => void;
  onNumResultsChange: (value: number) => void;
  onOptimizeGrid: () => void;
  isLoading: boolean;
  results: AnalysisResult[];
  onResultClick: (coords: L.LatLngTuple) => void;
  // New props for feasibility analysis
  feasibilityResult?: any;
  isFeasibilityLoading?: boolean;
}

const AnalysisSidebar: React.FC<AnalysisSidebarProps> = (props) => {
  return (
    <aside className="w-96 bg-gray-900 p-4 flex flex-col z-10 shadow-2xl overflow-y-auto">
      <div className="space-y-6">
        <DataLayersPanel 
            visibleLayers={props.visibleLayers}
            onLayerToggle={props.onLayerToggle}
        />

        <SlidersPanel
            pinpoint={props.pinpoint}
            sliderValues={props.sliderValues}
            numResults={props.numResults}
            onSliderChange={props.onSliderChange}
            onNumResultsChange={props.onNumResultsChange}
            onOptimizeGrid={props.onOptimizeGrid}
            isLoading={props.isLoading}
        />

        <ResultsPanel
            results={props.results}
            onResultClick={props.onResultClick}
        />

        <FeasibilityPanel
            result={props.feasibilityResult}
            isLoading={props.isFeasibilityLoading || false}
            pinpoint={props.pinpoint}
        />
      </div>
    </aside>
  );
};

export default AnalysisSidebar;
