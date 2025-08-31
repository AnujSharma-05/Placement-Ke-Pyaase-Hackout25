import React from 'react';
import L from 'leaflet';
import { InfrastructureType, AnalysisResult } from '../types';
import DataLayersPanel from './DataLayersPanel';
import SlidersPanel from './SlidersPanel';
import ResultsPanel from './ResultsPanel';
import FeasibilityPanel from './FeasibilityPanel';
import RadiusPanel from './RadiusPanel';
import PowerSupplyPanel from './PowerSupplyPanel';

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
  // New props for radius-based analysis
  radiusMode: boolean;
  selectedRadius: number;
  centerPoint: { lat: number; lng: number } | null;
  onRadiusModeToggle: () => void;
  onRadiusChange: (radius: number) => void;
  onRadiusOptimize: () => void;
  radiusResults: AnalysisResult[];
  radiusLoading: boolean;
  // New props for power supply analysis
  powerSupplyResult?: any;
  isPowerSupplyLoading?: boolean;
  onAnalyzePowerSupply: (requiredCapacity: number) => void;
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

        <RadiusPanel
            radiusMode={props.radiusMode}
            selectedRadius={props.selectedRadius}
            centerPoint={props.centerPoint}
            onRadiusModeToggle={props.onRadiusModeToggle}
            onRadiusChange={props.onRadiusChange}
            onRadiusOptimize={props.onRadiusOptimize}
            radiusResults={props.radiusResults}
            radiusLoading={props.radiusLoading}
        />

        <ResultsPanel
            results={props.radiusMode ? props.radiusResults : props.results}
            onResultClick={props.onResultClick}
        />

        <FeasibilityPanel
            result={props.feasibilityResult}
            isLoading={props.isFeasibilityLoading || false}
            pinpoint={props.pinpoint}
        />

        <PowerSupplyPanel
            pinpoint={props.pinpoint}
            result={props.powerSupplyResult}
            isLoading={props.isPowerSupplyLoading || false}
            onAnalyzePowerSupply={props.onAnalyzePowerSupply}
        />
      </div>
    </aside>
  );
};

export default AnalysisSidebar;
