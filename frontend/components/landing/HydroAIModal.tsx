import React from 'react';
import { X, Cpu, Database, BarChart, Zap, Globe, Calculator } from 'lucide-react';

interface HydroAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HydroAIModal: React.FC<HydroAIModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-400 to-blue-500 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-black">HYDRO AI TECHNICAL ARCHITECTURE</h2>
              <p className="text-emerald-100 font-medium">Multi-Modal Optimization Engine & Reasoning Framework</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Core Algorithms Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <BarChart className="w-6 h-6 text-emerald-500" />
              Core Optimization Algorithms
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-100 p-6 rounded-lg border-l-4 border-emerald-500">
                <h4 className="font-black text-lg text-gray-900 mb-3">Site Scoring Matrix</h4>
                <div className="space-y-2 text-sm font-mono">
                  <div><span className="text-emerald-700 font-bold">Power Score:</span> <span className="text-gray-900">Σ(Pi * e^(-di/λ)) / Creq</span></div>
                  <div><span className="text-blue-700 font-bold">Market Score:</span> <span className="text-gray-900">Σ(Dj * wj) / dmax²</span></div>
                  <div><span className="text-purple-700 font-bold">Logistics Score:</span> <span className="text-gray-900">min(dport, dtransport) * Icoeff</span></div>
                  <div className="text-gray-700 text-xs mt-3 bg-white p-2 rounded">
                    <strong>Variables:</strong> Pi = Plant capacity, di = Haversine distance, λ = decay factor, 
                    Dj = Demand magnitude, wj = sector weights, Icoeff = Infrastructure coefficient
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-black text-lg text-gray-900 mb-3">Geospatial Processing</h4>
                <div className="space-y-2 text-sm font-mono">
                  <div><span className="text-emerald-700 font-bold">Haversine Distance:</span> <span className="text-gray-900">6371 * arccos(...)</span></div>
                  <div><span className="text-blue-700 font-bold">Grid Resolution:</span> <span className="text-gray-900">5km x 5km cells</span></div>
                  <div><span className="text-purple-700 font-bold">Coordinate System:</span> <span className="text-gray-900">WGS84 (EPSG:4326)</span></div>
                  <div className="text-gray-700 text-xs mt-3 bg-white p-2 rounded">
                    <strong>Details:</strong> High-precision geodetic calculations with spherical geometry corrections
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Power Supply Analysis Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              Power Supply Analysis Engine
            </h3>
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-lg border border-yellow-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-black text-gray-900 mb-3">Capacity Assessment</h4>
                  <div className="space-y-2 text-sm font-mono">
                    <div>• <span className="font-bold text-orange-700">Total Available:</span> <span className="text-gray-900">Σ(Ci) MW</span></div>
                    <div>• <span className="font-bold text-orange-700">Distance Weighted:</span> <span className="text-gray-900">Ci / (1 + αdi)</span></div>
                    <div>• <span className="font-bold text-orange-700">Supply Adequacy:</span> <span className="text-gray-900">Cavail / Creq</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-gray-900 mb-3">Plant Proximity Score</h4>
                  <div className="space-y-2 text-sm font-mono">
                    <div>• <span className="font-bold text-yellow-700">Distance Matrix:</span> <span className="text-gray-900">k-NN search</span></div>
                    <div>• <span className="font-bold text-yellow-700">Transmission Loss:</span> <span className="text-gray-900">β * d²</span></div>
                    <div>• <span className="font-bold text-yellow-700">Grid Stability:</span> <span className="text-gray-900">N-1 redundancy</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-gray-900 mb-3">Economic Modeling</h4>
                  <div className="space-y-2 text-sm font-mono">
                    <div>• <span className="font-bold text-red-700">CAPEX:</span> <span className="text-gray-900">$1.5M/MW baseline</span></div>
                    <div>• <span className="font-bold text-red-700">OPEX:</span> <span className="text-gray-900">3% CAPEX annually</span></div>
                    <div>• <span className="font-bold text-red-700">LCOH:</span> <span className="text-gray-900">NPV optimization</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Machine Learning Section */}
          {/* <div className="mb-8">
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Database className="w-6 h-6 text-purple-500" />
              Machine Learning Pipeline
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-black text-lg text-gray-900 mb-3">Feature Engineering</h4>
                <div className="space-y-2 text-sm">
                  <div>• <span className="font-bold text-purple-700">Spatial Features:</span> <span className="text-gray-800">Lat/Lon embeddings, distance matrices, elevation profiles</span></div>
                  <div>• <span className="font-bold text-purple-700">Temporal Features:</span> <span className="text-gray-800">Seasonality patterns, demand forecasting windows</span></div>
                  <div>• <span className="font-bold text-purple-700">Infrastructure Features:</span> <span className="text-gray-800">Port accessibility, railway connectivity, highway networks</span></div>
                  <div>• <span className="font-bold text-purple-700">Economic Features:</span> <span className="text-gray-800">State policies, incentive structures, land costs</span></div>
                </div>
              </div>

              <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
                <h4 className="font-black text-lg text-gray-900 mb-3">Model Architecture</h4>
                <div className="space-y-2 text-sm">
                  <div>• <span className="font-bold text-indigo-700">Ensemble Method:</span> <span className="text-gray-800">Random Forest + XGBoost + Neural Networks</span></div>
                  <div>• <span className="font-bold text-indigo-700">Optimization:</span> <span className="text-gray-800">Multi-objective Pareto optimization (NSGA-II)</span></div>
                  <div>• <span className="font-bold text-indigo-700">Validation:</span> <span className="text-gray-800">Stratified K-fold cross-validation with geographic splits</span></div>
                  <div>• <span className="font-bold text-indigo-700">Performance:</span> <span className="text-gray-800">R² &gt; 0.85 on held-out test sets</span></div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Data Sources Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-500" />
              Real-Time Data Integration
            </h3>
            <div className="bg-blue-100 p-6 rounded-lg border border-blue-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-black text-gray-900 mb-3">Government APIs</h4>
                  <div className="space-y-1 text-sm text-gray-800">
                    <div>• <span className="font-semibold">MNRE</span> Solar/Wind Database</div>
                    <div>• <span className="font-semibold">CEA</span> Grid Integration Data</div>
                    <div>• <span className="font-semibold">Ministry of Ports</span> Maritime Access</div>
                    <div>• <span className="font-semibold">SEZ Authority</span> Industrial Zones</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-gray-900 mb-3">Geospatial Sources</h4>
                  <div className="space-y-1 text-sm text-gray-800">
                    <div>• <span className="font-semibold">OpenStreetMap</span> Road Networks</div>
                    {/* <div>• <span className="font-semibold">Sentinel-2</span> Satellite Imagery</div>
                    <div>• <span className="font-semibold">NASA SRTM</span> Elevation Data</div>
                    <div>• <span className="font-semibold">Land Use</span> Classification (ESA)</div> */}
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-gray-900 mb-3">Market Intelligence</h4>
                  <div className="space-y-1 text-sm text-gray-800">
                    <div>• <span className="font-semibold">IEA</span> Hydrogen Demand Forecasts</div>
                    <div>• <span className="font-semibold">Industrial</span> Consumer Mapping</div>
                    <div>• <span className="font-semibold">Transport</span> Fuel Requirements</div>
                    <div>• <span className="font-semibold">Export Terminal</span> Capacity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div>
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Calculator className="w-6 h-6 text-red-500" />
              Technical Specifications
            </h3>
            <div className="bg-gray-900 text-green-300 p-6 rounded-lg font-mono text-sm border border-gray-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="text-green-200 font-bold mb-3 text-base"># PERFORMANCE METRICS</div>
                  <div className="space-y-1">
                    <div><span className="text-cyan-300">Response Time:</span> <span className="text-white">&lt; 2.5s (p95)</span></div>
                    <div><span className="text-cyan-300">Throughput:</span> <span className="text-white">1000+ req/min</span></div>
                    <div><span className="text-cyan-300">Accuracy:</span> <span className="text-white">94.2% site validation</span></div>
                    <div><span className="text-cyan-300">Coverage:</span> <span className="text-white">99.7% Indian territory</span></div>
                    <div><span className="text-cyan-300">Uptime:</span> <span className="text-white">99.95% SLA</span></div>
                  </div>
                </div>
                <div>
                  <div className="text-green-200 font-bold mb-3 text-base"># COMPUTATIONAL STACK</div>
                  <div className="space-y-1">
                    <div><span className="text-yellow-300">Engine:</span> <span className="text-white">Python 3.11 + NumPy/SciPy</span></div>
                    <div><span className="text-yellow-300">Stack:</span> <span className="text-white">scikit-learn</span></div>
                    <div><span className="text-yellow-300">Geospatial:</span> <span className="text-white">GDAL + Shapely + Geopandas</span></div>
                    {/* <div><span className="text-yellow-300">Database:</span> <span className="text-white">PostgreSQL + PostGIS</span></div> */}
                    <div><span className="text-yellow-300">Cache:</span> <span className="text-white">Redis Cluster (sub-ms lookup)</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-8 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <span className="font-bold">Version:</span> HydroAI v2.3.1 | 
            <span className="font-bold ml-2">Build:</span> 2025.08.31-prod
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-500 text-white font-bold rounded hover:bg-emerald-600 transition-colors"
          >
            Close Technical Overview
          </button>
        </div>
      </div>
    </div>
  );
};

export default HydroAIModal;
