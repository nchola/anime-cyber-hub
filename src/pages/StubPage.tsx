
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface StubPageProps {
  title: string;
}

const StubPage: React.FC<StubPageProps> = ({ title }) => {
  return (
    <div className="min-h-screen bg-cyber-background noise-bg">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-orbitron font-bold text-cyber-accent mb-4">{title}</h1>
          <p className="text-gray-300 text-center max-w-lg mb-8">
            This page is under construction. We're working on bringing you the best content soon.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-cyber-purple to-cyber-accent rounded-full mb-8"></div>
          <div className="text-cyber-accent text-6xl font-orbitron animate-pulse">
            Coming Soon
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StubPage;
