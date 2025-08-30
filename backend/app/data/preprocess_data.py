import pandas as pd
import io
import time
import os
from geopy.geocoders import Nominatim

# Initialize the geolocator
geolocator = Nominatim(user_agent="hydrogen_hackathon_app")

def geocode_location(location_str):
    """
    Geocodes a location string and returns (latitude, longitude).
    Includes a delay to respect the API's usage policy.
    """
    try:
        location = geolocator.geocode(location_str)
        time.sleep(1) # IMPORTANT: Add a 1-second delay between requests
        if location:
            return location.latitude, location.longitude
        else:
            return None, None
    except Exception as e:
        print(f"Error geocoding {location_str}: {e}")
        return None, None
    

"""All data i am manually adding here"""


_BASE_DIR = os.getcwd()
print(_BASE_DIR)
solar_plants_csv = ""


solar_plants = 'solar_plants.csv'

print(os.path.join(_BASE_DIR, solar_plants))
with open(os.path.join(_BASE_DIR, solar_plants), 'r') as solar_file:
    solar_plants_csv = solar_file.read()


wind_plants_csv = ""
wind_plants = 'wind_plants.csv'

with open(os.path.join(_BASE_DIR, wind_plants), 'r') as wind_file:
    wind_plants_csv = wind_file.read()



sez_data_csv = ""
sez_data = 'sez_data.csv'
with open(os.path.join(_BASE_DIR, sez_data), 'r') as sez_file:
    sez_data_csv = sez_file.read()



def process_solar_data(output_path):
    print("--- Processing Solar Plant Data ---")
    df = pd.read_csv(io.StringIO(solar_plants_csv))
    df = df[~df['Sl. No.'].str.contains("Total", na=False)] # Remove total row

    latitudes, longitudes = [], []
    total = len(df)
    for i, row in df.iterrows():
        # Create a detailed location string for better accuracy
        location_query = f"{row['Name of Park and Location']}, {row['State']}, India"
        print(f"Geocoding solar plant {i+1}/{total}: {location_query}...")
        lat, lon = geocode_location(location_query)
        latitudes.append(lat)
        longitudes.append(lon)
    
    df['latitude'] = latitudes
    df['longitude'] = longitudes
    df.to_csv(output_path, index=False)
    print(f"Clean solar data saved to {output_path}")


def process_wind_data(output_path):
    print("\n--- Processing Wind Plant Data ---")
    df = pd.read_csv(io.StringIO(wind_plants_csv))
    df = df[~df['Sl. No.'].str.contains("Total", na=False)] # Remove total row

    latitudes, longitudes = [], []
    total = len(df)
    for i, row in df.iterrows():
        location_query = f"{row['District']} district, {row['State']}, India"
        print(f"Geocoding wind location {i+1}/{total}: {location_query}...")
        lat, lon = geocode_location(location_query)
        latitudes.append(lat)
        longitudes.append(lon)

    df['latitude'] = latitudes
    df['longitude'] = longitudes
    df.to_csv(output_path, index=False)
    print(f"Clean wind data saved to {output_path}")


def process_sez_data(output_path):
    print("\n--- Processing SEZ Data (Demand Centers) ---")
    df = pd.read_csv(io.StringIO(sez_data_csv))
    df = df[~df['Sl. No.'].str.contains("Total", na=False)] # Remove total row

    latitudes, longitudes = [], []
    total = len(df)
    for i, row in df.iterrows():
        location_query = f"{row['Name of the Zone']}, India"
        print(f"Geocoding SEZ {i+1}/{total}: {location_query}...")
        lat, lon = geocode_location(location_query)
        latitudes.append(lat)
        longitudes.append(lon)

    df['latitude'] = latitudes
    df['longitude'] = longitudes
    df.to_csv(output_path, index=False)
    print(f"Clean SEZ data saved to {output_path}")


if __name__ == '__main__':
    # Define the output directory based on your Flask app structure
    OUTPUT_DIR = os.path.join('app', 'data')
    
    # Create the directory if it doesn't exist
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    # NOTE: The sez_state_wise.csv is not processed here as it contains aggregate data
    # not suitable for direct mapping. We are using sez_data.csv for specific demand centers.
    # and i know that - good thank you

    process_solar_data(os.path.join(OUTPUT_DIR, 'cleaned_solar_plants.csv'))
    process_wind_data(os.path.join(OUTPUT_DIR, 'cleaned_wind_plants.csv'))
    process_sez_data(os.path.join(OUTPUT_DIR, 'cleaned_demand_centers.csv'))
    
    print("\n All data has been processed and saved!")