import { PointFeature, AnalysisResult } from '../types';
import { indiaGeoData } from './indiaData';

const createFeatureCollection = (features: PointFeature[]): GeoJSON.FeatureCollection<GeoJSON.Point, PointFeature['properties']> => ({
    type: 'FeatureCollection',
    features,
});

const processData = () => {
    const solarFeatures = indiaGeoData.renewables.features.filter(f => f.properties.type === 'solar');
    const windFeatures = indiaGeoData.renewables.features.filter(f => f.properties.type === 'wind');

    return {
        demand: indiaGeoData.demandCenters,
        hub: indiaGeoData.hubs,
        solar: createFeatureCollection(solarFeatures as PointFeature[]),
        wind: createFeatureCollection(windFeatures as PointFeature[]),
    }
}

export const indiaMapData = processData();

export const mockAnalysisResults: AnalysisResult[] = [
    {
        id: 'site-1',
        name: 'Khavda Renewable Energy Park',
        score: 95,
        coords: [23.84, 69.69],
        details: { power: 'Excellent', market: 'Good', logistics: 'Fair' }
    },
    {
        id: 'site-2',
        name: 'Dholera SIR',
        score: 91,
        coords: [22.25, 72.2],
        details: { power: 'Good', market: 'Excellent', logistics: 'Excellent' }
    },
    {
        id: 'site-3',
        name: 'Dahej PCPIR',
        score: 88,
        coords: [21.7, 72.58],
        details: { power: 'Fair', market: 'Excellent', logistics: 'Good' }
    }
];
