import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const Problem = () => {
  return (
    <section className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-8">
        {/* Dramatic Header */}
        <div className="text-center mb-20">
          <div className="inline-block p-4 bg-red-500 rounded-full mb-8">
            <X className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-black mb-8 leading-tight">
            HYDROGEN IS
            <br />
            <span className="text-red-500">BROKEN</span>
          </h2>
        </div>

        {/* Problem Grid - Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Large Problem Statement */}
          <div className="lg:col-span-8 bg-black text-white p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-6 text-red-400">THE REALITY</h3>
              <p className="text-xl leading-relaxed mb-8">
                Critical infrastructure data scattered across silos. 
                Decision-makers flying blind. Projects delayed by months. 
                The hydrogen transition is happening at a snail's pace.
              </p>
              <div className="flex items-center gap-4 text-red-400">
                <AlertCircle className="w-6 h-6" />
                <span className="font-bold">FRAGMENTED • INACCESSIBLE • SLOW</span>
              </div>
            </div>
          </div>

          {/* Stats Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-8">
              <div className="text-4xl font-black text-red-500 mb-2">73%</div>
              <div className="text-gray-700 font-medium">of hydrogen projects face delays</div>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-8">
              <div className="text-4xl font-black text-red-500 mb-2">$2.1B</div>
              <div className="text-gray-700 font-medium">lost to poor site selection</div>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-8">
              <div className="text-4xl font-black text-red-500 mb-2">6MO</div>
              <div className="text-gray-700 font-medium">average planning delay</div>
            </div>
          </div>
        </div>

        {/* Visual Problem Illustration */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Scattered Data */}
            <div className="group relative bg-gray-100 p-8 hover:bg-red-50 transition-all duration-500">
              <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">SCATTERED DATA</h4>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-2 bg-gray-300 rounded" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
                ))}
              </div>
              <p className="text-gray-600 mt-4 text-sm">
                Information trapped in isolated systems
              </p>
            </div>

            {/* No Visibility */}
            <div className="group relative bg-gray-100 p-8 hover:bg-red-50 transition-all duration-500">
              <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">ZERO VISIBILITY</h4>
              <div className="w-full h-24 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-gray-500 text-4xl">?</span>
              </div>
              <p className="text-gray-600 mt-4 text-sm">
                Decision-makers operating in the dark
              </p>
            </div>

            {/* Slow Progress */}
            <div className="group relative bg-gray-100 p-8 hover:bg-red-50 transition-all duration-500">
              <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">GLACIAL PACE</h4>
              <div className="flex items-center gap-2">
                <div className="w-8 h-2 bg-red-500 rounded"></div>
                <div className="flex-1 h-2 bg-gray-300 rounded"></div>
              </div>
              <p className="text-gray-600 mt-4 text-sm">
                Projects crawling toward completion
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;