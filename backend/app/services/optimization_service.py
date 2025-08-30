# In app/services/optimization_service.py

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import haversine_distances

def create_india_grid(step=0.5):
    """
    Creates a grid of lat/lon points covering India.
    Step size is in degrees. A smaller step creates a more detailed grid.
    """
    # Bounding box for India
    lat_min, lat_max = 8.0, 37.0
    lon_min, lon_max = 68.0, 98.0
    
    lat_grid = np.arange(lat_min, lat_max, step)
    lon_grid = np.arange(lon_min, lon_max, step)
    
    lons, lats = np.meshgrid(lon_grid, lat_grid)
    grid_points = np.vstack([lats.ravel(), lons.ravel()]).T
    # print(grid_points)
    return grid_points

def calculate_scores(grid_points_rad, data_points_rad):
    """
    Calculates the minimum distance from each grid point to any data point.
    Returns a normalized score where higher is better (closer).
    """
    # Calculate distances between all grid points and all data points
    distances = haversine_distances(grid_points_rad, data_points_rad) * 6371 # Radius of Earth in km
    
    # Find the minimum distance for each grid point
    min_distances = distances.min(axis=1)
    
    # Normalize the score (closer is better). We invert the distance.
    # Adding a small epsilon to avoid division by zero
    max_dist = min_distances.max()
    scores = 10 * (1 - (min_distances / max_dist)) # Scale from 0 to 10
    
    return scores

def calculate_opportunity_scores(weights, renewable_df, demand_df, logistics_df, num_results=10):
    """
    Main function to run the optimization analysis.
    """
    print("Creating analysis grid...")
    grid_points = create_india_grid(step=0.5)
    
    # Convert all coordinates to radians for haversine calculation
    grid_points_rad = np.radians(grid_points)
    renewable_rad = np.radians(renewable_df[['latitude', 'longitude']].values)
    demand_rad = np.radians(demand_df[['latitude', 'longitude']].values)
    logistics_rad = np.radians(logistics_df[['latitude', 'longitude']].values)

    print("Calculating scores...")
    power_scores = calculate_scores(grid_points_rad, renewable_rad)
    market_scores = calculate_scores(grid_points_rad, demand_rad)
    logistics_scores = calculate_scores(grid_points_rad, logistics_rad)

    # Calculate final weighted score
    overall_scores = (
        weights['power'] * power_scores +
        weights['market'] * market_scores +
        weights['logistics'] * logistics_scores
    )

    # Combine results into a DataFrame
    results_df = pd.DataFrame(grid_points, columns=['latitude', 'longitude'])
    results_df['overallScore'] = overall_scores
    results_df['subScores'] = list(zip(power_scores, market_scores, logistics_scores))

    # Sort and get top N results
    top_results = results_df.sort_values(by='overallScore', ascending=False).head(num_results)
    
    # Format for JSON output
    output = []
    for _, row in top_results.iterrows():
        output.append({
            'latitude': row['latitude'],
            'longitude': row['longitude'],
            'overallScore': round(row['overallScore'], 2),
            'subScores': {
                'power': round(row['subScores'][0], 2),
                'market': round(row['subScores'][1], 2),
                'logistics': round(row['subScores'][2], 2)
            }
        })
        
    return {"results": output}


def calculate_score_for_coordinate(user_lat, user_lon, weights, renewable_df, demand_df, logistics_df):
    """
    Calculates the feasibility score for a single user-provided coordinate.
    """
    # Define a maximum distance for influence (e.g., 500 km)
    # Anything further than this will have a score of 0
    MAX_INFLUENCE_KM = 500.0

    def get_single_score(user_point_rad, data_points_rad):
        """Helper to calculate one sub-score."""
        distances = haversine_distances(user_point_rad, data_points_rad) * 6371 # Earth radius in km
        min_distance = distances.min()
        
        if min_distance > MAX_INFLUENCE_KM:
            return 0.0
        
        # Linear decay score: 10 at 0km, 0 at MAX_INFLUENCE_KM
        score = 10 * (1 - (min_distance / MAX_INFLUENCE_KM))
        return score

    # Convert all coordinates to radians for haversine calculation
    user_point_rad = np.radians([[user_lat, user_lon]])
    renewable_rad = np.radians(renewable_df[['latitude', 'longitude']].values)
    demand_rad = np.radians(demand_df[['latitude', 'longitude']].values)
    logistics_rad = np.radians(logistics_df[['latitude', 'longitude']].values)

    # Calculate each sub-score
    power_score = get_single_score(user_point_rad, renewable_rad)
    market_score = get_single_score(user_point_rad, demand_rad)
    logistics_score = get_single_score(user_point_rad, logistics_rad)

    # Calculate final weighted overall score
    overall_score = (
        weights.get('power', 0.33) * power_score +
        weights.get('market', 0.33) * market_score +
        weights.get('logistics', 0.34) * logistics_score
    )

    # Format the result for a clear JSON response
    result = {
        "latitude": user_lat,
        "longitude": user_lon,
        "overallScore": round(overall_score, 2),
        "subScores": {
            "power": round(power_score, 2),
            "market": round(market_score, 2),
            "logistics": round(logistics_score, 2)
        },
        "message": "Feasibility score for the specified coordinate."
    }

    return result



def analyze_power_supply_for_coordinate(user_lat, user_lon, required_capacity_mw, renewable_df, num_nearest=5):
    """
    Analyzes the power supply from the N nearest renewable plants for a specific coordinate.
    """
    if renewable_df.empty:
        return {"error": "Renewable plants data is not available."}

    # Convert coordinates to radians for calculation
    user_point_rad = np.radians([[user_lat, user_lon]])
    renewable_rad = np.radians(renewable_df[['latitude', 'longitude']].values)

    # Calculate distances from the user's point to ALL renewable plants
    distances_km = (haversine_distances(user_point_rad, renewable_rad) * 6371).flatten()
    
    # Add distances to the DataFrame and find the N nearest plants
    analysis_df = renewable_df.copy()
    analysis_df['distance_km'] = distances_km
    nearest_plants_df = analysis_df.sort_values(by='distance_km').head(num_nearest)

    # Calculate the total available capacity from these nearby plants
    total_available_capacity = float(nearest_plants_df['capacity_mw'].sum())

    # Calculate a "Supply Score" (0-10). Capped at 10.
    # If available capacity exactly meets required, score is 10.
    # If it's double or more, it's still 10.
    supply_score = min(10.0, (total_available_capacity / required_capacity_mw) * 10)

    # Format the nearest plants data for a clean JSON response
    top_plants_raw = nearest_plants_df[[
        'State', 'type', 'capacity_mw', 'distance_km'
    ]].round(2).to_dict(orient='records')

    top_plants_clean = []
    for plant in top_plants_raw:
        top_plants_clean.append({
            "State": plant["State"],
            "type": plant["type"],
            "capacity_mw": float(plant["capacity_mw"]),
            "distance_km": float(plant["distance_km"])
        })

    return {
        "required_capacity_mw": required_capacity_mw,
        "total_available_capacity_mw": round(total_available_capacity, 2),
        "supply_score": round(supply_score, 2),
        "nearest_plants": top_plants_clean # Return the cleaned list
    }