import React from 'react';
import { Target, Globe, Rocket, Users, ArrowRight } from 'lucide-react';

const Mission = () => {
  return (
    <section className="py-32 bg-gradient-to-br from-gray-900 via-black to-emerald-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Mission Statement */}
        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="block">OUR</span>
            <span className="block text-emerald-400">MISSION</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl font-bold mb-6">
              Accelerate the global hydrogen transition through intelligent infrastructure mapping.
            </p>
            <p className="text-xl text-gray-300">
              Starting in Gujarat. Scaling to India. Expanding worldwide.
            </p>
          </div>
        </div>

        {/* Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Phase 1 */}
          <div className="relative group">
            <div className="bg-emerald-400 text-black p-8 h-64 flex flex-col justify-between">
              <div>
                <Target className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-black mb-2">PHASE 1</h3>
                <h4 className="text-xl font-bold mb-4">GUJARAT FOCUS</h4>
              </div>
              <div className="text-sm font-bold">
                Map every renewable site, transport hub, and demand center in Gujarat
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-black text-emerald-400 rounded-full flex items-center justify-center font-bold">
              1
            </div>
          </div>

          {/* Phase 2 */}
          <div className="relative group">
            <div className="bg-blue-400 text-black p-8 h-64 flex flex-col justify-between">
              <div>
                <Globe className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-black mb-2">PHASE 2</h3>
                <h4 className="text-xl font-bold mb-4">INDIA SCALE</h4>
              </div>
              <div className="text-sm font-bold">
                Expand across India's diverse energy landscape and policy frameworks
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-black text-blue-400 rounded-full flex items-center justify-center font-bold">
              2
            </div>
          </div>

          {/* Phase 3 */}
          <div className="relative group">
            <div className="bg-purple-400 text-black p-8 h-64 flex flex-col justify-between">
              <div>
                <Rocket className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-black mb-2">PHASE 3</h3>
                <h4 className="text-xl font-bold mb-4">GLOBAL REACH</h4>
              </div>
              <div className="text-sm font-bold">
                Build the worldwide hydrogen intelligence platform
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-black text-purple-400 rounded-full flex items-center justify-center font-bold">
              3
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white text-black p-16 relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400"></div>
          
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black mb-4">
              BUILT BY INNOVATORS
            </h3>
            <p className="text-xl text-gray-600">
              For a sustainable future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-none mx-auto mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <span className="text-black font-black text-2xl">AI</span>
              </div>
              <h4 className="text-xl font-bold mb-2">AI ENGINEERS</h4>
              <p className="text-gray-600">Machine learning specialists building intelligent optimization algorithms</p>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-none mx-auto mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <span className="text-black font-black text-2xl">GIS</span>
              </div>
              <h4 className="text-xl font-bold mb-2">GEOSPATIAL EXPERTS</h4>
              <p className="text-gray-600">Mapping and spatial analysis specialists with deep domain knowledge</p>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-none mx-auto mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <span className="text-black font-black text-xl">H₂</span>
              </div>
              <h4 className="text-xl font-bold mb-2">ENERGY ENGINEERS</h4>
              <p className="text-gray-600">Hydrogen and renewable energy domain experts driving innovation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;