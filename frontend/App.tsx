import React, { useState, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import Home from "./components/landing/Home";
import Dashboard from "./components/Dashboard";
import AboutUs from "./components/AboutUs";

type Page = "landing" | "dashboard" | "about";

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("landing");

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentPage("landing");
  }, []);

  const navigate = useCallback((page: Page) => {
    console.log("Navigating to:", page);
    setCurrentPage(page);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return isAuthenticated ? (
          <Dashboard onLogout={handleLogout} onNavigate={navigate} />
        ) : (
          <Home
            onNavigateDashboard={() => {
              console.log("Navigating to dashboard from Home component");
              setIsAuthenticated(true);
              setCurrentPage("dashboard");
            }}
          />
        );
      case "about":
        return <AboutUs onNavigate={navigate} onLogout={handleLogout} />;
      case "landing":
      default:
        return (
          <Home
            onNavigateDashboard={() => {
              console.log("Navigating to dashboard from Home component");
              setIsAuthenticated(true);
              setCurrentPage("dashboard");
            }}
          />
        );
    }
  };

  const isLandingPage = currentPage === "landing";

  return (
    <div
      className={`h-screen w-screen bg-gray-900 text-gray-100 font-sans ${
        isLandingPage ? "overflow-y-auto" : "overflow-hidden"
      }`}
    >
      {renderPage()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
