
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

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
            <form onSubmit={handleSearch} className="relative mr-4">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search anime..."
                className="py-1 pl-3 pr-10 w-40 md:w-64 bg-cyber-background border border-cyber-accent/30 rounded-md focus:outline-none focus:border-cyber-accent text-sm placeholder-gray-500"
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-cyber-accent"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
            
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
