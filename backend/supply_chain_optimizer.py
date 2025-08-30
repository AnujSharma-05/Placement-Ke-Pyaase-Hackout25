import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum
import heapq
from scipy.optimize import linprog

class FacilityType(Enum):
    PRODUCTION = "production"
    STORAGE = "storage"
    DEMAND = "demand"

@dataclass
class Location:
    """Represents a geographic location with cost index"""
    id: str
    name: str
    lat: float
    lon: float
    cost_index: float  # Total cost index for this location
    
@dataclass
class Facility:
    """Represents a supply chain facility"""
    id: str
    location: Location
    type: FacilityType
    capacity: float
    current_utilization: float = 0.0
    operating_cost: float = 0.0
    
    @property
    def available_capacity(self):
        return max(0, self.capacity - self.current_utilization)
    
    @property
    def utilization_rate(self):
        return self.current_utilization / self.capacity if self.capacity > 0 else 0

@dataclass
class DemandPoint:
    """Represents a demand location"""
    id: str
    location: Location
    demand_volume: float
    priority: int = 1  # Higher priority = more important
    fulfilled_volume: float = 0.0
    
    @property
    def unfulfilled_demand(self):
        return max(0, self.demand_volume - self.fulfilled_volume)

class SupplyChainOptimizer:
    """Main optimization engine for supply chain management"""
    
    def __init__(self):
        self.locations: Dict[str, Location] = {}
        self.facilities: Dict[str, Facility] = {}
        self.demand_points: Dict[str, DemandPoint] = {}
        self.supply_routes: Dict[Tuple[str, str], float] = {}  # (from_id, to_id): flow
        self.transportation_cost_per_km = 0.1  # Cost per unit per km
        
    def add_location(self, location: Location):
        """Add a new location to the network"""
        self.locations[location.id] = location
        
    def add_facility(self, facility: Facility):
        """Add an existing facility to the network"""
        self.facilities[facility.id] = facility
        
    def add_demand_point(self, demand: DemandPoint):
        """Add a demand point to the network"""
        self.demand_points[demand.id] = demand
        
    def calculate_distance(self, loc1: Location, loc2: Location) -> float:
        """Calculate Euclidean distance between two locations"""
        return np.sqrt((loc1.lat - loc2.lat)**2 + (loc1.lon - loc2.lon)**2)
    
    def calculate_transportation_cost(self, from_facility: Facility, to_location: Location, 
                                     volume: float) -> float:
        """Calculate transportation cost including location cost indices"""
        distance = self.calculate_distance(from_facility.location, to_location)
        base_cost = distance * volume * self.transportation_cost_per_km
        # Apply cost indices for both origin and destination
        adjusted_cost = base_cost * (from_facility.location.cost_index + to_location.cost_index) / 2
        return adjusted_cost
    
    def evaluate_new_demand(self, new_demand: DemandPoint) -> Dict:
        """
        Evaluate if new demand can be met with existing infrastructure
        Returns analysis results and recommendations
        """
        result = {
            'can_fulfill': False,
            'fulfillment_plan': [],
            'total_cost': 0,
            'unfulfilled_volume': new_demand.demand_volume,
            'recommendations': [],
            'optimization_suggestions': []
        }
        
        # Find available supply from existing facilities
        available_supplies = []
        for fac_id, facility in self.facilities.items():
            if facility.type in [FacilityType.PRODUCTION, FacilityType.STORAGE]:
                if facility.available_capacity > 0:
                    cost = self.calculate_transportation_cost(
                        facility, new_demand.location, 
                        min(facility.available_capacity, new_demand.demand_volume)
                    )
                    cost_per_unit = cost / min(facility.available_capacity, new_demand.demand_volume)
                    available_supplies.append({
                        'facility_id': fac_id,
                        'available': facility.available_capacity,
                        'cost_per_unit': cost_per_unit,
                        'total_cost': cost
                    })
        
        # Sort by cost efficiency
        available_supplies.sort(key=lambda x: x['cost_per_unit'])
        
        # Try to fulfill demand with existing infrastructure
        remaining_demand = new_demand.demand_volume
        for supply in available_supplies:
            if remaining_demand <= 0:
                break
                
            allocation = min(supply['available'], remaining_demand)
            result['fulfillment_plan'].append({
                'from_facility': supply['facility_id'],
                'to_demand': new_demand.id,
                'volume': allocation,
                'cost': supply['cost_per_unit'] * allocation
            })
            result['total_cost'] += supply['cost_per_unit'] * allocation
            remaining_demand -= allocation
        
        result['unfulfilled_volume'] = remaining_demand
        result['can_fulfill'] = remaining_demand <= 0
        
        # Generate recommendations if demand cannot be fully met
        if not result['can_fulfill']:
            recommendations = self.suggest_new_facilities(
                new_demand, remaining_demand
            )
            result['recommendations'] = recommendations
        
        # Suggest optimizations for existing infrastructure
        result['optimization_suggestions'] = self.optimize_existing_assets()
        
        return result
    
    def suggest_new_facilities(self, demand: DemandPoint, required_volume: float) -> List[Dict]:
        """
        Suggest new production or storage facilities based on cost indices
        """
        suggestions = []
        
        # Evaluate each potential location
        for loc_id, location in self.locations.items():
            # Skip if location already has a facility
            if any(f.location.id == loc_id for f in self.facilities.values()):
                continue
            
            # Calculate costs for production facility
            prod_setup_cost = 10000 * location.cost_index  # Base setup cost * index
            prod_operating_cost = 50 * required_volume * location.cost_index
            prod_transport_cost = self.calculate_transportation_cost(
                Facility('temp', location, FacilityType.PRODUCTION, required_volume),
                demand.location, required_volume
            )
            prod_total_cost = prod_setup_cost + prod_operating_cost + prod_transport_cost
            
            # Calculate costs for storage facility
            storage_setup_cost = 5000 * location.cost_index  # Lower setup cost for storage
            storage_operating_cost = 20 * required_volume * location.cost_index
            storage_transport_cost = prod_transport_cost  # Same transport cost
            
            # Need to account for supply to storage from production
            nearest_production = self.find_nearest_production(location)
            storage_supply_cost = 0
            if nearest_production:
                storage_supply_cost = self.calculate_transportation_cost(
                    nearest_production, location, required_volume
                )
            
            storage_total_cost = storage_setup_cost + storage_operating_cost + \
                                storage_transport_cost + storage_supply_cost
            
            suggestions.append({
                'location_id': loc_id,
                'location_name': location.name,
                'cost_index': location.cost_index,
                'production_facility_cost': prod_total_cost,
                'storage_facility_cost': storage_total_cost,
                'recommended_type': 'production' if prod_total_cost < storage_total_cost else 'storage',
                'cost_breakdown': {
                    'production': {
                        'setup': prod_setup_cost,
                        'operating': prod_operating_cost,
                        'transport': prod_transport_cost,
                        'total': prod_total_cost
                    },
                    'storage': {
                        'setup': storage_setup_cost,
                        'operating': storage_operating_cost,
                        'transport': storage_transport_cost,
                        'supply': storage_supply_cost,
                        'total': storage_total_cost
                    }
                }
            })
        
        # Sort by total cost of recommended facility type
        suggestions.sort(key=lambda x: min(x['production_facility_cost'], 
                                          x['storage_facility_cost']))
        
        return suggestions[:5]  # Return top 5 suggestions
    
    def find_nearest_production(self, location: Location) -> Optional[Facility]:
        """Find the nearest production facility to a location"""
        min_distance = float('inf')
        nearest = None
        
        for facility in self.facilities.values():
            if facility.type == FacilityType.PRODUCTION:
                distance = self.calculate_distance(facility.location, location)
                if distance < min_distance:
                    min_distance = distance
                    nearest = facility
        
        return nearest
    
    def optimize_existing_assets(self) -> List[Dict]:
        """
        Reoptimize existing supply routes and facility utilization
        Uses linear programming to minimize total cost
        """
        optimizations = []
        
        # Analyze current utilization
        for fac_id, facility in self.facilities.items():
            if facility.type in [FacilityType.PRODUCTION, FacilityType.STORAGE]:
                if facility.utilization_rate < 0.5:
                    optimizations.append({
                        'type': 'underutilized',
                        'facility_id': fac_id,
                        'current_utilization': f"{facility.utilization_rate:.1%}",
                        'recommendation': f"Consider consolidating operations or finding new demand sources"
                    })
                elif facility.utilization_rate > 0.9:
                    optimizations.append({
                        'type': 'near_capacity',
                        'facility_id': fac_id,
                        'current_utilization': f"{facility.utilization_rate:.1%}",
                        'recommendation': f"Consider expanding capacity or adding new facility nearby"
                    })
        
        # Optimize supply routes using linear programming
        route_optimization = self.optimize_supply_routes()
        if route_optimization:
            optimizations.extend(route_optimization)
        
        return optimizations
    
    def optimize_supply_routes(self) -> List[Dict]:
        """
        Use linear programming to optimize supply routes
        Minimizes total transportation cost while meeting demand
        """
        supply_facilities = [f for f in self.facilities.values() 
                           if f.type in [FacilityType.PRODUCTION, FacilityType.STORAGE]]
        demand_points_list = list(self.demand_points.values())
        
        if not supply_facilities or not demand_points_list:
            return []
        
        n_supply = len(supply_facilities)
        n_demand = len(demand_points_list)
        
        # Create cost matrix
        costs = []
        for supply in supply_facilities:
            for demand in demand_points_list:
                cost = self.calculate_transportation_cost(
                    supply, demand.location, 1.0  # Cost per unit
                )
                costs.append(cost)
        
        # Create constraint matrices
        # Supply constraints (cannot exceed available capacity)
        A_supply = np.zeros((n_supply, n_supply * n_demand))
        for i in range(n_supply):
            for j in range(n_demand):
                A_supply[i, i * n_demand + j] = 1
        
        b_supply = [f.available_capacity for f in supply_facilities]
        
        # Demand constraints (must meet demand)
        A_demand = np.zeros((n_demand, n_supply * n_demand))
        for j in range(n_demand):
            for i in range(n_supply):
                A_demand[j, i * n_demand + j] = 1
        
        b_demand = [d.unfulfilled_demand for d in demand_points_list]
        
        # Combine constraints
        A_ub = np.vstack([A_supply])
        b_ub = b_supply
        A_eq = A_demand
        b_eq = b_demand
        
        # Bounds (non-negative flows)
        bounds = [(0, None) for _ in range(n_supply * n_demand)]
        
        # Solve
        try:
            result = linprog(costs, A_ub=A_ub, b_ub=b_ub, A_eq=A_eq, b_eq=b_eq, 
                           bounds=bounds, method='highs')
            
            if result.success:
                optimizations = []
                current_routes = []
                
                # Parse optimized routes
                for i, supply in enumerate(supply_facilities):
                    for j, demand in enumerate(demand_points_list):
                        flow = result.x[i * n_demand + j]
                        if flow > 0.01:  # Significant flow
                            current_routes.append({
                                'from': supply.id,
                                'to': demand.id,
                                'volume': flow,
                                'cost': flow * costs[i * n_demand + j]
                            })
                
                if current_routes:
                    optimizations.append({
                        'type': 'route_optimization',
                        'total_cost': result.fun,
                        'optimized_routes': current_routes,
                        'recommendation': 'Implement optimized routing to reduce transportation costs'
                    })
                
                return optimizations
        except:
            return []
        
        return []
    
    def add_new_facility(self, facility_type: str, location_id: str, capacity: float) -> str:
        """Add a new facility based on recommendation"""
        if location_id not in self.locations:
            return "Error: Location not found"
        
        location = self.locations[location_id]
        new_id = f"{facility_type}_{location_id}_{len(self.facilities)}"
        
        fac_type = FacilityType.PRODUCTION if facility_type == 'production' else FacilityType.STORAGE
        new_facility = Facility(
            id=new_id,
            location=location,
            type=fac_type,
            capacity=capacity,
            operating_cost=capacity * 50 * location.cost_index if fac_type == FacilityType.PRODUCTION 
                          else capacity * 20 * location.cost_index
        )
        
        self.facilities[new_id] = new_facility
        return f"Successfully added {facility_type} facility at {location.name} with capacity {capacity}"
    
    def execute_fulfillment_plan(self, plan: List[Dict]) -> str:
        """Execute a fulfillment plan by updating facility utilizations"""
        for allocation in plan:
            if allocation['from_facility'] in self.facilities:
                self.facilities[allocation['from_facility']].current_utilization += allocation['volume']
                
        return "Fulfillment plan executed successfully"


# Example usage and demonstration
def demonstrate_system():
    # Initialize optimizer
    optimizer = SupplyChainOptimizer()
    
    # Add locations with cost indices
    locations_data = [
        ("loc1", "Mumbai", 19.076, 72.877, 1.2),  # Higher cost
        ("loc2", "Pune", 18.520, 73.856, 0.9),   # Lower cost
        ("loc3", "Nashik", 20.011, 73.790, 0.8),  # Lowest cost
        ("loc4", "Nagpur", 21.145, 79.088, 1.0),  # Average cost
        ("loc5", "Kolhapur", 16.705, 74.243, 0.85) # Low-medium cost
    ]
    
    for loc_id, name, lat, lon, cost_idx in locations_data:
        optimizer.add_location(Location(loc_id, name, lat, lon, cost_idx))
    
    # Add existing facilities
    optimizer.add_facility(Facility(
        "prod1", optimizer.locations["loc1"], FacilityType.PRODUCTION, 
        capacity=1000, current_utilization=600
    ))
    
    optimizer.add_facility(Facility(
        "storage1", optimizer.locations["loc2"], FacilityType.STORAGE,
        capacity=500, current_utilization=200
    ))
    
    # Add new demand
    new_demand = DemandPoint(
        "demand1", optimizer.locations["loc4"], 
        demand_volume=600, priority=1
    )
    
    print("=" * 80)
    print("SUPPLY CHAIN OPTIMIZATION SYSTEM")
    print("=" * 80)
    
    # Evaluate the new demand
    result = optimizer.evaluate_new_demand(new_demand)
    
    print(f"\nNew Demand Analysis for {new_demand.location.name}:")
    print(f"Demand Volume: {new_demand.demand_volume} units")
    print(f"Can fulfill with existing infrastructure: {result['can_fulfill']}")
    
    if result['fulfillment_plan']:
        print("\nFulfillment Plan:")
        for plan in result['fulfillment_plan']:
            print(f"  - From {plan['from_facility']} to {plan['to_demand']}: "
                  f"{plan['volume']} units (Cost: ${plan['cost']:.2f})")
    
    print(f"\nTotal Cost: ${result['total_cost']:.2f}")
    print(f"Unfulfilled Volume: {result['unfulfilled_volume']} units")
    
    if result['recommendations']:
        print("\nNew Facility Recommendations:")
        for i, rec in enumerate(result['recommendations'][:3], 1):
            print(f"\n  Option {i}: {rec['location_name']} (Cost Index: {rec['cost_index']})")
            print(f"    Recommended: {rec['recommended_type'].capitalize()} Facility")
            print(f"    Production Cost: ${rec['production_facility_cost']:.2f}")
            print(f"    Storage Cost: ${rec['storage_facility_cost']:.2f}")
    
    if result['optimization_suggestions']:
        print("\nOptimization Suggestions for Existing Assets:")
        for opt in result['optimization_suggestions']:
            if opt['type'] == 'route_optimization':
                print(f"  - Route Optimization: Total cost ${opt['total_cost']:.2f}")
                print(f"    {opt['recommendation']}")
            else:
                print(f"  - Facility {opt['facility_id']}: {opt['recommendation']}")
                print(f"    Current utilization: {opt['current_utilization']}")
    
    # Demonstrate adding a new facility based on recommendation
    if result['recommendations']:
        best_option = result['recommendations'][0]
        print(f"\n{'=' * 80}")
        print("Adding recommended facility...")
        message = optimizer.add_new_facility(
            best_option['recommended_type'],
            best_option['location_id'],
            result['unfulfilled_volume']
        )
        print(message)
        
        # Re-evaluate with new facility
        print("\nRe-evaluating with new facility...")
        new_result = optimizer.evaluate_new_demand(new_demand)
        print(f"Can now fulfill: {new_result['can_fulfill']}")
        print(f"New total cost: ${new_result['total_cost']:.2f}")


if __name__ == "__main__":
    demonstrate_system()
