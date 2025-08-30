
import React from 'react';
import Navbar from './Navbar';

interface AboutUsProps {
  onNavigate: (page: 'landing' | 'dashboard' | 'about') => void;
  onLogout: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onNavigate, onLogout }) => {
  return (
    <div className="relative w-full h-full bg-gray-950 text-gray-50 flex flex-col">
      <div 
        className="absolute top-0 left-0 w-full h-full z-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#10b981 0.5px, transparent 0.5px)',
          backgroundSize: '20px 20px',
        }}
      />
      
      <Navbar onNavigate={onNavigate} onLogout={onLogout} currentPage="about" />
      
      <main className="flex-1 flex items-center justify-center z-10">
        <div className="container mx-auto px-6 py-24 text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6" style={{ textShadow: '0 0 15px rgba(255,255,255,0.1)' }}>
                Our <span className="text-green-400">Mission</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Our mission at H₂OS is to accelerate the global transition to a sustainable energy future. We are building the foundational digital infrastructure to map, analyze, and optimize the green hydrogen ecosystem. By harnessing the power of data and artificial intelligence, we empower governments, developers, and investors to make strategic decisions, unlocking the full potential of hydrogen as a clean, abundant, and transformative element for a decarbonized world.
            </p>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;