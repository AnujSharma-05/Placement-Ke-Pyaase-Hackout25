
import React, { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AboutUs from './components/AboutUs';

type Page = 'landing' | 'dashboard' | 'about';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentPage('landing');
  }, []);
  
  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return isAuthenticated ? <Dashboard onLogout={handleLogout} onNavigate={navigate} /> : <LandingPage onLogin={handleLogin} />;
      case 'about':
        return <AboutUs onNavigate={navigate} onLogout={handleLogout} />;
      case 'landing':
      default:
        return <LandingPage onLogin={handleLogin} />;
    }
  };

  const isLandingPage = currentPage === 'landing';

  return (
    <div className={`h-screen w-screen bg-gray-900 text-gray-100 font-sans ${isLandingPage ? 'overflow-y-auto' : 'overflow-hidden'}`}>
      {renderPage()}
    </div>
  );
};

export default App;