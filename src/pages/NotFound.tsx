
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-cyber-background noise-bg">
      <Navbar />
      
      <div className="flex items-center justify-center h-screen">
        <div className="text-center px-4">
          <h1 className="text-6xl font-orbitron font-bold text-cyber-accent mb-4 glitch-hover">404</h1>
          <div className="relative mb-8">
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-cyber-accent to-transparent"></div>
          </div>
          <h2 className="text-2xl text-white font-orbitron mb-6">Page Not Found</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>
          <div className="space-x-4">
            <Link to="/">
              <Button className="bg-cyber-accent text-cyber-background font-orbitron">
                Return to Home
              </Button>
            </Link>
            <Button variant="outline" className="border-cyber-accent text-cyber-accent font-orbitron" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
