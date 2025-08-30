import React from 'react';
import { Github, Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16 border-t-4 border-emerald-400">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-lg">H₂</span>
              </div>
              <span className="text-2xl font-black">OS</span>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed max-w-md font-medium">
              The hydrogen operating system that's accelerating the global clean energy transition 
              through intelligent infrastructure mapping and AI-powered optimization.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xl font-black mb-6 text-emerald-400">PLATFORM</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 font-bold">
                  <span>INTERACTIVE MAP</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 font-bold">
                  HYDRO AI ASSISTANT
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 font-bold">
                  DATA ANALYTICS
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 font-bold">
                  API ACCESS
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xl font-black mb-6 text-emerald-400">COMPANY</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 font-bold">
                  ABOUT US
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 font-bold">
                  OUR MISSION
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 font-bold">
                  CAREERS
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 font-bold">
                  CONTACT
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Social Media */}
            <div className="flex items-center gap-6">
              <a 
                href="#" 
                className="w-12 h-12 bg-gray-900 hover:bg-emerald-400 text-gray-300 hover:text-black transition-all duration-300 flex items-center justify-center group"
              >
                <Github className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-gray-900 hover:bg-emerald-400 text-gray-300 hover:text-black transition-all duration-300 flex items-center justify-center group"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-gray-900 hover:bg-emerald-400 text-gray-300 hover:text-black transition-all duration-300 flex items-center justify-center group"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-gray-900 hover:bg-emerald-400 text-gray-300 hover:text-black transition-all duration-300 flex items-center justify-center group"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-gray-400 font-bold">
              © 2024 H₂OS • BUILT FOR A SUSTAINABLE FUTURE
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;