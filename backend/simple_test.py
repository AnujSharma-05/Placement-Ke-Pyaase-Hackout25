#!/usr/bin/env python3

import pandas as pd
import os

# Simple test to load data step by step
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(_BASE_DIR, 'app', 'data', 'app', 'data')

print(f"DATA_DIR: {DATA_DIR}")
print(f"DATA_DIR exists: {os.path.exists(DATA_DIR)}")

try:
    # Load files
    solar_path = os.path.join(DATA_DIR, 'cleaned_solar_plants.csv')
    wind_path = os.path.join(DATA_DIR, 'cleaned_wind_plants.csv')
    demand_path = os.path.join(DATA_DIR, 'cleaned_demand_centers.csv')
    ports_path = os.path.join(DATA_DIR, 'ports.csv')
    
    print("Loading solar...")
    solar_df = pd.read_csv(solar_path)
    print(f"Solar loaded: {solar_df.shape}")
    
    print("Loading wind...")
    wind_df = pd.read_csv(wind_path)
    print(f"Wind loaded: {wind_df.shape}")
    
    print("Loading demand...")
    demand_df = pd.read_csv(demand_path)
    print(f"Demand loaded: {demand_df.shape}")
    
    print("Loading ports...")
    logistics_df = pd.read_csv(ports_path)
    print(f"Ports loaded: {logistics_df.shape}")
    
    print("All files loaded successfully!")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
