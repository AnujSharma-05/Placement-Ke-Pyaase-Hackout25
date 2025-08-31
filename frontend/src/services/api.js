/**
 * Sends weights and numResults to get top N optimized grid locations.
 */
export const optimizeGrid = async (weights, numResults = 5) => {
    const response = await fetch(`${BASE_URL}/optimize-grid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weights, numResults }),
    });
    if (!response.ok) {
        throw new Error('Failed to get grid optimization results');
    }
    return response.json();
};
// The base URL of your Flask backend
const BASE_URL = 'http://127.0.0.1:5000/api';
// const BASE_URL = ''

/**
 * Fetches the initial data needed to populate the map.
 */
export const getInitialMapData = async () => {
    const response = await fetch(`${BASE_URL}/initial-map-data`);
    if (!response.ok) {
        throw new Error('Failed to fetch initial map data');
    }
    return response.json();
};

/**
 * Sends a coordinate and weights to get a feasibility score.
 */
export const optimizePoint = async (coordinate, weights) => {
    const response = await fetch(`${BASE_URL}/optimize-point`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coordinate, weights }),
    });
    if (!response.ok) {
        throw new Error('Failed to get optimization score');
    }
    return response.json();
};

/**
 * Sends the score and weights to the AI agent for analysis.
 */
export const getReasoning = async (scores, weights) => {
    const response = await fetch(`${BASE_URL}/analyze-reasoning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores, weights }),
    });
    if (!response.ok) {
        throw new Error('Failed to get AI reasoning');
    }
    return response.json();
};

/**
 * Finds the best locations within a specified radius around a center point.
 * Always returns the top N results within the radius, even if scores are low.
 */
export const optimizeRadius = async (centerPoint, radius, weights, numResults = 3) => {
    const response = await fetch(`${BASE_URL}/optimize-radius`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            centerPoint, 
            radius, 
            weights, 
            numResults 
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to get radius optimization results');
    }
    return response.json();
};