import React from "react";
import { ArrowDown, Atom } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroProps {
  onExploreMap: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExploreMap }) => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-blue-900/20"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        ></div>
      </div>

      {/* Floating Molecules */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 animate-float">
          <Atom className="w-12 h-12 text-emerald-400 opacity-60" />
        </div>
        <div
          className="absolute top-40 right-32 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <Atom className="w-8 h-8 text-blue-400 opacity-40" />
        </div>
        <div
          className="absolute bottom-32 left-1/3 animate-float"
          style={{ animationDelay: "2s" }}
        >
          <Atom className="w-10 h-10 text-cyan-400 opacity-50" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <nav className="p-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">H₂</span>
            </div>
            <span className="text-xl font-bold">OS</span>
          </div>
          <button className="px-6 py-2 border border-emerald-400 text-emerald-400 rounded-full hover:bg-emerald-400 hover:text-black transition-all duration-300">
            Early Access
          </button>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-emerald-400/10 border border-emerald-400/30 rounded-full text-emerald-400 text-sm font-medium">
                  HYDROGEN OPERATING SYSTEM
                </div>
                <h1 className="text-6xl lg:text-8xl font-black leading-none">
                  <span className="block">MAPPING</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-cyan-400">
                    THE FUTURE
                  </span>
                  <span className="block">OF H₂</span>
                </h1>
              </div>

              <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
                Infrastructure intelligence for the hydrogen economy. Visualize.
                Optimize. Accelerate.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (onExploreMap) {
                      onExploreMap();
                    } else {
                      navigate("/dashboard");
                    }
                  }}
                  className="group px-8 py-4 bg-emerald-400 text-black font-bold rounded-none hover:bg-emerald-300 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>EXPLORE MAP</span>
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                    <ArrowDown className="w-3 h-3 rotate-45" />
                  </div>
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="px-8 py-4 border-2 border-white text-white font-bold rounded-none hover:bg-white hover:text-black transition-all duration-300"
                >
                  MEET HYDRO AI
                </button>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative">
              <div className="relative w-full h-96 bg-gradient-to-br from-emerald-400/20 to-blue-500/20 rounded-3xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Hydrogen infrastructure"
                  className="w-full h-full object-cover mix-blend-overlay"
                />

                {/* Overlay Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-8">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Data Overlay */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-emerald-400 text-xs font-mono">
                    LIVE DATA STREAM
                  </div>
                  <div className="text-white text-sm font-bold">
                    127 SITES MAPPED
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-8 -left-8 bg-emerald-400 text-black p-6 rounded-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-2xl font-black">50GW+</div>
                <div className="text-sm font-medium">RENEWABLE CAPACITY</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="pb-8 flex justify-center">
          <div className="animate-bounce">
            <ArrowDown className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
