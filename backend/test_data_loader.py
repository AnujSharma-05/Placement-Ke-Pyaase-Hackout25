#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(__file__))

try:
    from app.utils.data_loader import load_all_data
    print("Imported successfully")
    
    print("Calling load_all_data()...")
    renewable_df, demand_df, logistics_df = load_all_data()
    
    print(f"SUCCESS! Loaded:")
    print(f"  - {len(renewable_df)} renewable plants")
    print(f"  - {len(demand_df)} demand centers") 
    print(f"  - {len(logistics_df)} logistics hubs")
    
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
