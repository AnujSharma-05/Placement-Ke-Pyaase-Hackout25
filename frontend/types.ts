import L from 'leaflet';

export type InfrastructureType = 
  | 'demand'
  | 'hub'
  | 'solar'
  | 'wind'
  | 'recommendation' 
  | 'pinpoint';

export interface InfrastructureProperties {
  name: string;
  type: InfrastructureType;
  // Using a generic key-value pair for other properties
  // to accommodate varied data from the new JSON source.
  [key: string]: any;
}

export interface PointFeature extends GeoJSON.Feature<GeoJSON.Point, InfrastructureProperties> {}

export interface AnalysisResult {
  id: string;
  name: string;
  score: number;
  coords: L.LatLngTuple;
  details: {
    power: string;
    market: string;
    logistics: string;
  };
}
