# In backend/test_script.py

# Add the app directory to the Python path to allow for relative imports
import sys
# sys.path.append('./app')

from app.utils.data_loader import load_all_data
from app.services.optimization_service import calculate_opportunity_scores, calculate_score_for_coordinate
import pandas as pd
import json

def run_test():
    print("--- Starting Optimization Test ---")
    
    # Step 1: Load the data
    try:
        renewable_df, demand_df, logistics_df = load_all_data()
    except FileNotFoundError as e:
        print(f"ERROR: {e}")
        print("Please run the `preprocess_data.py` script first.")
        return

    # Step 2: Define the Logistics Layer (Crucial Missing Data)
    # For now, we will create a DUMMY logistics layer of major ports and cities.
    # logistics_data = {
    #     'location': ['Mumbai Port', 'Kandla Port', 'Chennai Port', 'Vizag Port', 'Delhi', 'Bangalore', 'Kolkata'],
    #     'latitude': [18.96, 22.98, 13.08, 17.68, 28.61, 12.97, 22.57],
    #     'longitude': [72.82, 70.22, 80.27, 83.21, 77.21, 77.59, 88.36]
    # }
    # logistics_df = pd.DataFrame(logistics_data)
    # print(f"Created dummy logistics layer with {len(logistics_df)} points.")

    # now i have generated data for the ports
    # logistics_df is the name

    # Step 3: Define user weights for the test
    test_weights = {
        "power": 0.4,
        "market": 0.3,
        "logistics": 0.3
    }
    print(f"\nUsing test weights: {test_weights}")

    # Step 4: Run the optimization service
    top_locations = calculate_opportunity_scores(
        weights=test_weights,
        renewable_df=renewable_df,
        demand_df=demand_df,
        logistics_df=logistics_df,
        num_results=5
    )
    
    # Step 5: Print the results
    print("\n--- Top 5 Recommended Locations ---")
    print(json.dumps(top_locations, indent=2))
    print("\n--- Test Complete ---")



def run_single_point_test():
    """
    Tests the feasibility score calculation for a single, user-defined coordinate.
    """
    print("\n--- Starting Single Point Feasibility Test ---")
    
    # Step 1: Load all data layers, including the new logistics layer
    try:
        # The data loader now returns three DataFrames
        renewable_df, demand_df, logistics_df = load_all_data()
    except FileNotFoundError as e:
        print(f"ERROR: {e}")
        return

    # Step 2: Define user inputs for the test
    # Coordinates for Ahmedabad
    test_lat = 23.0225
    test_lon = 72.5714
    
    test_weights = {
        "power": 0.4,
        "market": 0.3,
        "logistics": 0.3
    }
    
    print(f"Testing coordinate: ({test_lat}, {test_lon})")
    print(f"Using test weights: {test_weights}")

    # Step 3: Run the single-point optimization service
    result = calculate_score_for_coordinate(
        user_lat=test_lat,
        user_lon=test_lon,
        weights=test_weights,
        renewable_df=renewable_df,
        demand_df=demand_df,
        logistics_df=logistics_df
    )
    
    # Step 4: Print the results
    print("\n--- Feasibility Score Result ---")
    print(json.dumps(result, indent=2))
    print("\n--- Single Point Test Complete ---")


if __name__ == '__main__':
    run_test()
    run_single_point_test()