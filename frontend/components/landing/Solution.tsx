import React from 'react';
import { Zap, Truck, TrendingUp, Eye, Brain, Rocket } from 'lucide-react';

const Solution = () => {
  return (
    <section className="py-32 bg-emerald-400 text-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Dramatic Intro */}
        <div className="text-center mb-20">
          <div className="inline-block p-4 bg-black rounded-full mb-8">
            <Eye className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
            WE SEE
            <br />
            <span className="text-black">EVERYTHING</span>
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-2xl font-bold mb-4">
              H₂OS brings order to chaos
            </p>
            <p className="text-lg opacity-80">
              One platform. All data. Infinite possibilities.
            </p>
          </div>
        </div>

        {/* Feature Showcase - Unconventional Layout */}
        <div className="space-y-16">
          {/* Power Feature */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 bg-black text-white p-12 relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
              <div className="flex items-center gap-4 mb-6">
                <Zap className="w-12 h-12 text-yellow-400" />
                <h3 className="text-4xl font-black">POWER</h3>
              </div>
              <p className="text-xl mb-6 text-gray-300">
                Every solar panel. Every wind turbine. Every renewable source mapped with precision.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">127</div>
                  <div className="text-sm text-gray-400">SOLAR SITES</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">89</div>
                  <div className="text-sm text-gray-400">WIND FARMS</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">50GW+</div>
                  <div className="text-sm text-gray-400">CAPACITY</div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-400 p-12 flex items-center justify-center">
              <div className="text-6xl font-black text-black">⚡</div>
            </div>
          </div>

          {/* Logistics Feature */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="bg-blue-500 p-12 flex items-center justify-center order-2 lg:order-1">
              <div className="text-6xl font-black text-white">🚚</div>
            </div>
            <div className="lg:col-span-2 bg-black text-white p-12 relative order-1 lg:order-2">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
              <div className="flex items-center gap-4 mb-6">
                <Truck className="w-12 h-12 text-blue-400" />
                <h3 className="text-4xl font-black">LOGISTICS</h3>
              </div>
              <p className="text-xl mb-6 text-gray-300">
                Pipelines. Storage. Transport hubs. The entire supply chain in your hands.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">45</div>
                  <div className="text-sm text-gray-400">TRANSPORT HUBS</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">23</div>
                  <div className="text-sm text-gray-400">EXPORT TERMINALS</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">1200KM</div>
                  <div className="text-sm text-gray-400">PIPELINE NETWORK</div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Feature */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 bg-black text-white p-12 relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500"></div>
              <div className="flex items-center gap-4 mb-6">
                <TrendingUp className="w-12 h-12 text-green-400" />
                <h3 className="text-4xl font-black">MARKET</h3>
              </div>
              <p className="text-xl mb-6 text-gray-300">
                Demand centers. Export opportunities. Market intelligence that drives decisions.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">$2.1T</div>
                  <div className="text-sm text-gray-400">MARKET SIZE</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">156</div>
                  <div className="text-sm text-gray-400">DEMAND CENTERS</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">34</div>
                  <div className="text-sm text-gray-400">EXPORT ROUTES</div>
                </div>
              </div>
            </div>
            <div className="bg-green-400 p-12 flex items-center justify-center">
              <div className="text-6xl font-black text-black">📈</div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <button className="group px-12 py-6 bg-black text-emerald-400 font-black text-xl rounded-none hover:bg-gray-900 transition-all duration-300 flex items-center gap-4 mx-auto">
            <Brain className="w-8 h-8" />
            <span>SEE THE FULL PICTURE</span>
            <Rocket className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Solution;