
import React from 'react';

interface NavbarProps {
  onNavigate: (page: 'landing' | 'dashboard' | 'about') => void;
  onLogout: () => void;
  currentPage?: 'dashboard' | 'about';
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onLogout, currentPage }) => {
  return (
    <nav className="bg-gray-900 shadow-lg z-20">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div
          className="text-2xl font-bold text-white tracking-widest cursor-pointer"
          onClick={() => onNavigate('landing')}
        >
          H<span className="text-green-400">₂</span>OS
        </div>
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onNavigate('landing')}
            className="text-gray-300 hover:text-green-400 transition-colors duration-300 font-medium"
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`transition-colors duration-300 font-medium ${
              currentPage === 'dashboard' ? 'text-green-400' : 'text-gray-300 hover:text-green-400'
            }`}
          >
            Analysis
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`transition-colors duration-300 font-medium ${
              currentPage === 'about' ? 'text-green-400' : 'text-gray-300 hover:text-green-400'
            }`}
          >
            About Us
          </button>
          <button
            onClick={onLogout}
            className="bg-gray-700 hover:bg-red-600/50 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;