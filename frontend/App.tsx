import React, { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./components/landing/Home";
import Dashboard from "./components/Dashboard";
import AboutUs from "./components/AboutUs";

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
    navigate("/dashboard");
  }, [navigate]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    navigate("/");
  }, [navigate]);

  const navigateToPage = useCallback((page: string) => {
    console.log("Navigating to:", page);
    navigate(page);
  }, [navigate]);

  const isLandingPage = location.pathname === "/";

  return (
    <div
      className={`h-screen w-screen bg-gray-900 text-gray-100 font-sans ${
        isLandingPage ? "overflow-y-auto" : "overflow-hidden"
      }`}
    >
      <Routes>
        <Route 
          path="/" 
          element={
            <Home
              onNavigateDashboard={() => {
                console.log("Navigating to dashboard from Home component");
                setIsAuthenticated(true);
                navigate("/dashboard");
              }}
            />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <Dashboard 
                onLogout={handleLogout}
              />
            ) : (
              <Home
                onNavigateDashboard={() => {
                  console.log("Navigating to dashboard from Home component");
                  setIsAuthenticated(true);
                  navigate("/dashboard");
                }}
              />
            )
          } 
        />
        <Route 
          path="/about" 
          element={
            <AboutUs 
              onLogout={handleLogout} 
            />
          } 
        />
      </Routes>
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
