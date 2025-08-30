import React from "react";
import Hero from "./Hero";
import Problem from "./Problem";
import Solution from "./Solution";
import MapPreview from "./MapPreview";
import HydroAI from "./HydroAI";
import Mission from "./Mission";
import CTA from "./CTA";
import Footer from "./Footer";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Problem />
      <Solution />
      <MapPreview />
      <HydroAI />
      <Mission />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
