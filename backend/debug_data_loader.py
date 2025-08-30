#!/usr/bin/env python3

import pandas as pd
import os
import sys

def test_load_all_data():
    """
    Test load_all_data function step by step
    """
    try:
        # Setup paths
        _BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        DATA_DIR = os.path.join(_BASE_DIR, 'app', 'data', 'app', 'data')
        
        print(f"DATA_DIR: {DATA_DIR}")
        
        # Load files
        solar_path = os.path.join(DATA_DIR, 'cleaned_solar_plants.csv')
        wind_path = os.path.join(DATA_DIR, 'cleaned_wind_plants.csv')
        demand_path = os.path.join(DATA_DIR, 'cleaned_demand_centers.csv')
        ports_path = os.path.join(DATA_DIR, 'ports.csv')

        print("Step 1: Loading CSV files...")
        solar_df = pd.read_csv(solar_path)
        wind_df = pd.read_csv(wind_path)
        demand_df = pd.read_csv(demand_path)
        logistics_df = pd.read_csv(ports_path)
        print("✓ CSV files loaded")

        print("Step 2: Adding type columns...")
        solar_df['type'] = 'solar'
        wind_df['type'] = 'wind'
        print("✓ Type columns added")

        print("Step 3: Renaming capacity columns...")
        solar_df.rename(columns={'Capacity Sanctioned (MW)': 'capacity_mw'}, inplace=True)
        wind_df.rename(columns={'Installable Potential (MW) (assuming 5 MW / sq.km)': 'capacity_mw'}, inplace=True)
        print("✓ Columns renamed")

        print("Step 4: Concatenating dataframes...")
        renewable_plants_df = pd.concat([
            solar_df[['State', 'type', 'capacity_mw', 'latitude', 'longitude']],
            wind_df[['State', 'type', 'capacity_mw', 'latitude', 'longitude']]
        ], ignore_index=True)
        print(f"✓ Concatenation done, shape: {renewable_plants_df.shape}")

        print("Step 5: Dropping NA values...")
        renewable_plants_df.dropna(subset=['latitude', 'longitude'], inplace=True)
        demand_df.dropna(subset=['latitude', 'longitude'], inplace=True)
        logistics_df.dropna(subset=['latitude', 'longitude'], inplace=True)
        print("✓ NA values dropped")

        print("Step 6: Converting capacity to numeric...")
        sys.stdout.flush()  # Flush output before potentially hanging operation
        renewable_plants_df['capacity_mw'] = pd.to_numeric(renewable_plants_df['capacity_mw'], errors='coerce')
        print("✓ Capacity converted to numeric")

        print(f"FINAL SUCCESS: {len(renewable_plants_df)} renewable, {len(demand_df)} demand, {len(logistics_df)} logistics")
        
        return renewable_plants_df, demand_df, logistics_df
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        return None, None, None

if __name__ == "__main__":
    test_load_all_data()
