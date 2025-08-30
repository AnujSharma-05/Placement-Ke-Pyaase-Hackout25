import React from 'react';
import { Map, Crosshair, Layers, Zap } from 'lucide-react';

const MapPreview = () => {
  return (
    <section className="py-32 bg-black text-white relative overflow-hidden">
      {/* Glitch Effect Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-blue-900/30"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 98px,
              rgba(34, 197, 94, 0.1) 100px
            )
          `
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-emerald-400 rounded-lg flex items-center justify-center">
              <Map className="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 className="text-5xl lg:text-6xl font-black">
                THE MAP
              </h2>
              <p className="text-emerald-400 text-xl font-bold">
                INFRASTRUCTURE INTELLIGENCE
              </p>
            </div>
          </div>
        </div>

        {/* Map Interface Mockup */}
        <div className="relative">
          {/* Main Map Container */}
          <div className="bg-gray-900 rounded-none border-4 border-emerald-400 overflow-hidden">
            {/* Map Header */}
            <div className="bg-emerald-400 text-black p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Crosshair className="w-6 h-6" />
                <span className="font-black text-lg">GUJARAT HYDROGEN CORRIDOR</span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-black text-emerald-400 font-bold text-sm">
                  LAYERS
                </button>
                <button className="px-4 py-2 bg-black text-emerald-400 font-bold text-sm">
                  FILTER
                </button>
              </div>
            </div>

            {/* Map Content */}
            <div className="h-96 relative bg-gradient-to-br from-gray-800 to-gray-900">
              <img 
                src="https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Infrastructure map view"
                className="w-full h-full object-cover opacity-40"
              />
              
              {/* Data Points */}
              <div className="absolute inset-0">
                {/* Power Generation Sites */}
                <div className="absolute top-1/4 left-1/4 group cursor-pointer">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full animate-pulse relative">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-yellow-400 px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      SOLAR FARM • 250MW
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/3 right-1/3 group cursor-pointer">
                  <div className="w-8 h-8 bg-blue-400 rounded-full animate-pulse relative">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-blue-400 px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      WIND FARM • 400MW
                    </div>
                  </div>
                </div>

                {/* Transport Hubs */}
                <div className="absolute bottom-1/3 left-1/2 group cursor-pointer">
                  <div className="w-5 h-5 bg-emerald-400 rounded-full animate-pulse relative">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-emerald-400 px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      KANDLA PORT
                    </div>
                  </div>
                </div>

                {/* Demand Centers */}
                <div className="absolute top-1/2 right-1/4 group cursor-pointer">
                  <div className="w-7 h-7 bg-purple-400 rounded-full animate-pulse relative">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-purple-400 px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      INDUSTRIAL ZONE
                    </div>
                  </div>
                </div>

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line x1="25%" y1="25%" x2="50%" y2="66%" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" opacity="0.6">
                    <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
                  </line>
                  <line x1="66%" y1="33%" x2="50%" y2="66%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" opacity="0.6">
                    <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
                  </line>
                </svg>
              </div>

              {/* Live Data Stream */}
              <div className="absolute top-4 left-4 bg-emerald-400 text-black p-3 rounded font-mono text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                  <span className="font-bold">LIVE STREAM</span>
                </div>
                <div>284 SITES ACTIVE</div>
              </div>
            </div>

            {/* Map Stats */}
            <div className="bg-black p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-400">127</div>
                <div className="text-gray-400 text-sm font-bold">SOLAR SITES</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-blue-400">89</div>
                <div className="text-gray-400 text-sm font-bold">WIND FARMS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-purple-400">45</div>
                <div className="text-gray-400 text-sm font-bold">TRANSPORT HUBS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-cyan-400">23</div>
                <div className="text-gray-400 text-sm font-bold">EXPORT TERMINALS</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center mt-16">
            <button className="group px-16 py-6 bg-white text-black font-black text-2xl hover:bg-emerald-100 transition-all duration-300 flex items-center gap-4 mx-auto">
              <Layers className="w-8 h-8" />
              <span>LAUNCH MAP</span>
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapPreview;