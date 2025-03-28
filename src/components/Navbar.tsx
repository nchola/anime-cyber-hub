
import React from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-cyber-background/80 backdrop-blur-md border-b border-cyber-accent/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-cyber-accent text-2xl font-orbitron font-bold">
              CYBER<span className="text-white">ANIME</span>
            </span>
          </Link>
          
          <div className="hidden md:flex space-x-8 font-orbitron text-sm">
            <Link to="/" className="text-white hover:text-cyber-accent transition-colors">
              HOME
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search anime..."
                className="py-1 pl-3 pr-10 w-40 md:w-64 bg-cyber-background border border-cyber-accent/30 rounded-md focus:outline-none focus:border-cyber-accent text-sm placeholder-gray-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <button className="py-1 px-4 bg-cyber-accent text-cyber-background rounded-md text-sm font-medium hover:bg-opacity-80 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
