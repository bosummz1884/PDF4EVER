// src/pages/home.jsx
import React from "react";
import Header from "../components/Header.jsx";
import HeroSection from "../components/HeroSection.jsx";
import FeaturesSection from "../components/FeaturesSection.jsx";
import CTASection from "../components/CTASection.jsx";
import OwnershipSection from "../components/OwnershipSection.jsx";
import Footer from "../components/Footer.jsx";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <OwnershipSection />
      <Footer />
    </div>
  );
};

export default HomePage;
