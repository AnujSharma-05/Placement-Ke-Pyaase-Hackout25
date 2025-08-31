import React, { useState } from 'react';
import { Bot, MessageSquare, Brain, Sparkles, ArrowRight } from 'lucide-react';
import HydroAIModal from './HydroAIModal';

const HydroAI = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMeetHydroAI = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <section className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-8">
        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - AI Interface */}
          <div className="relative">
            {/* Terminal-style Interface */}
            <div className="bg-black rounded-none border-4 border-black overflow-hidden">
              {/* Terminal Header */}
              <div className="bg-emerald-400 text-black p-4 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="font-black text-lg">HYDRO AI TERMINAL</span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold">ONLINE</span>
                </div>
              </div>

              {/* Chat Interface */}
              <div className="p-6 h-80 overflow-hidden font-mono text-sm">
                <div className="space-y-4">
                  <div className="text-emerald-400">
                    <span className="text-gray-500">user@h2os:~$</span> analyze best hydrogen sites in gujarat
                  </div>
                  
                  <div className="text-white">
                    <div className="text-emerald-400 mb-2">HYDRO AI PROCESSING...</div>
                    <div className="space-y-1">
                      <div>✓ Scanning renewable energy data</div>
                      <div>✓ Analyzing transport infrastructure</div>
                      <div>✓ Calculating demand proximity</div>
                      <div>✓ Running optimization algorithms</div>
                    </div>
                  </div>

                  <div className="text-emerald-400 border-l-4 border-emerald-400 pl-4">
                    <div className="font-bold mb-2">OPTIMAL SITES IDENTIFIED:</div>
                    <div className="space-y-1 text-white">
                      <div>1. KUTCH REGION - Score: 94/100</div>
                      <div>   └ High solar/wind + port access</div>
                      <div>2. MUNDRA ZONE - Score: 87/100</div>
                      <div>   └ Industrial demand + infrastructure</div>
                      <div>3. JAMNAGAR HUB - Score: 82/100</div>
                      <div>   └ Refinery integration potential</div>
                    </div>
                  </div>

                  <div className="text-emerald-400">
                    <span className="text-gray-500">user@h2os:~$</span> 
                    <span className="animate-pulse">_</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-emerald-400 rounded-full flex items-center justify-center animate-bounce">
              <Brain className="w-8 h-8 text-black" />
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-block p-3 bg-emerald-400 rounded-full mb-6">
                <Bot className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-black mb-6 leading-tight">
                MEET
                <br />
                <span className="text-emerald-400">HYDRO</span>
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-2xl text-gray-700 font-bold">
                Your AI co-pilot for hydrogen infrastructure decisions.
              </p>
              <p className="text-lg text-gray-600">
                Ask complex questions in plain English. Get actionable insights in seconds. 
                From site optimization to policy analysis, Hydro cuts through complexity.
              </p>
            </div>

            {/* Capabilities */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 border-l-4 border-emerald-400">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                <div>
                  <div className="font-bold text-gray-900">Site Scoring Algorithm</div>
                  <div className="text-gray-600 text-sm">AI-powered location optimization</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 border-l-4 border-blue-400">
                <MessageSquare className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="font-bold text-gray-900">Natural Language Queries</div>
                  <div className="text-gray-600 text-sm">Ask questions like you would a human expert</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 border-l-4 border-purple-400">
                <Brain className="w-6 h-6 text-purple-400" />
                <div>
                  <div className="font-bold text-gray-900">Policy Intelligence</div>
                  <div className="text-gray-600 text-sm">Navigate regulations and incentives</div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleMeetHydroAI}
              className="group px-8 py-4 bg-black text-emerald-400 font-black text-lg hover:bg-gray-900 transition-all duration-300 flex items-center gap-3"
            >
              <span>MEET HYDRO AI</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Technical Modal */}
      <HydroAIModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
};

export default HydroAI;