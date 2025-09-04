
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-gray-900 shadow-lg z-20">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div
          className="text-2xl font-bold text-white tracking-widest cursor-pointer"
          onClick={() => navigate('/')}
        >
          H<span className="text-green-400">₂</span>OS
        </div>
        <div className="flex items-center space-x-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-green-400 transition-colors duration-300 font-medium"
          >
            Home
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className={`transition-colors duration-300 font-medium ${
              location.pathname === '/dashboard' ? 'text-green-400' : 'text-gray-300 hover:text-green-400'
            }`}
          >
            Analysis
          </button>
          <button
            onClick={() => navigate('/about')}
            className={`transition-colors duration-300 font-medium ${
              location.pathname === '/about' ? 'text-green-400' : 'text-gray-300 hover:text-green-400'
            }`}
          >
            About Us
          </button>
          {/* <button
            onClick={onLogout}
            className="bg-gray-700 hover:bg-red-600/50 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-sm"
          >
            Logout
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;