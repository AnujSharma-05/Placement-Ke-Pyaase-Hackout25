# In app/utils/data_loader.py

import pandas as pd
import os

# _BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# DATA_DIR = os.path.join(_BASE_DIR, '..', 'data')
DATA_DIR = 'B:\STUDY_VEDESH_laptop\coding_new\Placement-Ke-Pyaase-Hackout25\\backend\\app\data\\app\data'

def load_all_data():
    """
    Loads, cleans, and combines all necessary CSV files into pandas DataFrames.
    """
    try:
        # Load the cleaned data files
        solar_path = os.path.join(DATA_DIR, 'cleaned_solar_plants.csv')
        wind_path = os.path.join(DATA_DIR, 'cleaned_wind_plants.csv')
        demand_path = os.path.join(DATA_DIR, 'cleaned_demand_centers.csv')
        ports_path = os.path.join(DATA_DIR, 'ports.csv')

        solar_df = pd.read_csv(solar_path)
        wind_df = pd.read_csv(wind_path)
        demand_df = pd.read_csv(demand_path)
        logistics_df = pd.read_csv(ports_path)

        # --- Data Cleaning & Combining ---

        # Add a 'type' column to distinguish between solar and wind
        solar_df['type'] = 'solar'
        wind_df['type'] = 'wind'
        
        # Rename columns to be consistent for merging
        solar_df.rename(columns={'Capacity Sanctioned (MW)': 'capacity_mw'}, inplace=True)
        wind_df.rename(columns={'Installable Potential (MW) (assuming 5 MW / sq.km)': 'capacity_mw'}, inplace=True)

        # Combine into a single renewable plants DataFrame
        renewable_plants_df = pd.concat([
            solar_df[['State', 'type', 'capacity_mw', 'latitude', 'longitude']],
            wind_df[['State', 'type', 'capacity_mw', 'latitude', 'longitude']]
        ], ignore_index=True)

        # Drop any rows that failed to geocode
        renewable_plants_df.dropna(subset=['latitude', 'longitude'], inplace=True)
        demand_df.dropna(subset=['latitude', 'longitude'], inplace=True)
        logistics_df.dropna(subset=['latitude', 'longitude'], inplace=True)

        # Convert capacity to numeric, coercing errors
        renewable_plants_df['capacity_mw'] = pd.to_numeric(renewable_plants_df['capacity_mw'], errors='coerce')
        
        print(f"Data Loaded: {len(renewable_plants_df)} renewable plants and {len(demand_df)} demand centers.")

        return renewable_plants_df, demand_df, logistics_df

    except FileNotFoundError as e:
        raise FileNotFoundError(f"Cleaned data file not found. Make sure you have run the preprocessing script. Error: {e}")