# app/api/routes.py
from flask import request, jsonify
from . import api_bp
from ..services.optimization_service import calculate_opportunity_scores, calculate_score_for_coordinate
from ..utils.data_loader import load_all_data
import pandas as pd

from ..services.reasoning_agent import get_reasoning_for_data

@api_bp.route('/optimize', methods=['POST'])
def get_optimization_score():
    """
    Endpoint to calculate the opportunity score for new hydrogen projects.
    Expects a JSON body with user-defined weights.
    """
    # Get the user-defined weights from the React frontend
    data = request.get_json()
    weights = {
        'power': data.get('powerWeight', 0.25),
        'market': data.get('marketWeight', 0.25),
        'opportunity': data.get('opportunityWeight', 0.25),
        'logistics': data.get('logisticsWeight', 0.25)
    }

    # Call the service layer to perform the calculation
    try:
        results = calculate_opportunity_scores(weights)
        return jsonify(results)
    except Exception as e:
        # Basic error handling
        return jsonify({"error": str(e)}), 500
    

def dataframe_to_geojson(df, feature_type, lon_col='longitude', lat_col='latitude'):
    """
    Helper function to convert a Pandas DataFrame to a GeoJSON FeatureCollection.
    """
    features = []
    for _, row in df.iterrows():
        # Ensure coordinates are valid numbers
        if pd.notna(row[lon_col]) and pd.notna(row[lat_col]):
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    # GeoJSON format is [longitude, latitude]
                    "coordinates": [row[lon_col], row[lat_col]]
                },
                "properties": {
                    "type": feature_type,
                    # Dynamically add other columns to properties
                    **{k: v for k, v in row.items() if k not in [lon_col, lat_col]}
                }
            }
            features.append(feature)
    
    return {
        "type": "FeatureCollection",
        "features": features
    }


@api_bp.route('/initial-map-data', methods=['GET'])
def get_initial_map_data():
    """
    Endpoint to load and format all initial data points for map display.
    """
    try:
        renewable_df, demand_df, logistics_df = load_all_data()

        # Rename columns for clarity in the frontend properties
        demand_df.rename(columns={'Name of the Zone': 'name'}, inplace=True)
        logistics_df.rename(columns={'port_name': 'name'}, inplace=True)

        # Convert dataframes to GeoJSON
        renewables_geojson = dataframe_to_geojson(renewable_df, 'renewable')
        demand_geojson = dataframe_to_geojson(demand_df, 'demand')
        hubs_geojson = dataframe_to_geojson(logistics_df, 'hub') # Using 'hub' for ports

        return jsonify({
            "renewables": renewables_geojson,
            "demandCenters": demand_geojson,
            "hubs": hubs_geojson
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route('/optimize-grid', methods=['POST'])
def optimize_grid():
    """
    Endpoint for grid-based optimization. Takes user weights and returns the top N locations.
    """
    data = request.get_json()
    if not data or 'weights' not in data:
        return jsonify({"error": "Missing 'weights' in request body"}), 400

    try:
        weights = data['weights']
        num_results = data.get('numResults', 10) # Default to 10 results

        # Load data on-demand
        renewable_df, demand_df, logistics_df = load_all_data()

        # Call the service function
        top_locations = calculate_opportunity_scores(
            weights=weights,
            renewable_df=renewable_df,
            demand_df=demand_df,
            logistics_df=logistics_df,
            num_results=num_results
        )
        return jsonify(top_locations)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# --- NEW ENDPOINT 2: SINGLE POINT FEASIBILITY ---
@api_bp.route('/optimize-point', methods=['POST'])
def optimize_point():
    """
    Endpoint for calculating the feasibility score of a single user-defined coordinate.
    """
    data = request.get_json()
    if not data or 'weights' not in data or 'coordinate' not in data:
        return jsonify({"error": "Missing 'weights' or 'coordinate' in request body"}), 400

    try:
        weights = data['weights']
        coordinate = data['coordinate']
        user_lat = coordinate.get('latitude')
        user_lon = coordinate.get('longitude')
        
        if user_lat is None or user_lon is None:
            return jsonify({"error": "Missing 'latitude' or 'longitude' in coordinate object"}), 400

        # Load data on-demand
        renewable_df, demand_df, logistics_df = load_all_data()

        # Call the service function
        result = calculate_score_for_coordinate(
            user_lat=user_lat,
            user_lon=user_lon,
            weights=weights,
            renewable_df=renewable_df,
            demand_df=demand_df,
            logistics_df=logistics_df
        )
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- NEW ENDPOINT 3: AI-POWERED REASONING ---
@api_bp.route('/analyze-reasoning', methods=['POST'])
def analyze_reasoning():
    """
    Endpoint to generate a textual, AI-powered reasoning for a given score.
    """
    data = request.get_json()
    if not data or 'weights' not in data or 'scores' not in data:
        return jsonify({"error": "Missing 'weights' or 'scores' in request body"}), 400

    try:
        weights = data['weights']
        scores = data['scores'] # This is the direct JSON output from your other endpoints

        # Call the reasoning agent service
        reasoning_text = get_reasoning_for_data(weights, scores)

        return jsonify({"reasoning": reasoning_text})

    except Exception as e:
        # It's good practice to log the error, e.g., print(e) or use a logger
        return jsonify({"error": "Failed to generate reasoning.", "details": str(e)}), 500