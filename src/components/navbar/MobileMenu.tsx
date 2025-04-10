import React from "react";
import { Link } from "react-router-dom";
import { LogOut, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  username: string;
  onItemClick: () => void;
  onLogout: () => void;
  onSignInClick: () => void;
  onSignUpClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  isLoggedIn, 
  username, 
  onItemClick,
  onLogout,
  onSignInClick,
  onSignUpClick
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-cyber-background/95 backdrop-blur-md border-b border-cyber-accent/30 animate-fade-in">
      <div className="px-4 pt-2 pb-6 space-y-4">
        <div className="flex flex-col space-y-3 pt-3">
          <Link 
            to="/" 
            className="text-white hover:text-cyber-accent font-orbitron text-base px-3 py-2 rounded-md hover:bg-cyber-accent/10 transition-colors"
            onClick={onItemClick}
          >
            HOME
          </Link>
          <Link 
            to="/anime" 
            className="text-white hover:text-cyber-accent font-orbitron text-base px-3 py-2 rounded-md hover:bg-cyber-accent/10 transition-colors"
            onClick={onItemClick}
          >
            ALL ANIME
          </Link>
          <Link 
            to="/seasonal" 
            className="text-white hover:text-cyber-accent font-orbitron text-base px-3 py-2 rounded-md hover:bg-cyber-accent/10 transition-colors"
            onClick={onItemClick}
          >
            SEASONAL
          </Link>
          <Link 
            to="/upcoming" 
            className="text-white hover:text-cyber-accent font-orbitron text-base px-3 py-2 rounded-md hover:bg-cyber-accent/10 transition-colors"
            onClick={onItemClick}
          >
            UPCOMING
          </Link>
          <Link 
            to="/genre" 
            className="text-white hover:text-cyber-accent font-orbitron text-base px-3 py-2 rounded-md hover:bg-cyber-accent/10 transition-colors"
            onClick={onItemClick}
          >
            GENRES
          </Link>
          <Link 
            to="/manga" 
            className="text-white hover:text-cyber-accent font-orbitron text-base px-3 py-2 rounded-md hover:bg-cyber-accent/10 transition-colors"
            onClick={onItemClick}
          >
            MANGA
          </Link>
          <Link 
            to="/top" 
            className="text-white hover:text-cyber-accent font-orbitron text-base px-3 py-2 rounded-md hover:bg-cyber-accent/10 transition-colors"
            onClick={onItemClick}
          >
            TOP RATED
          </Link>
          {isLoggedIn && (
            <Link 
              to="/bookmark" 
              className="text-white hover:text-cyber-accent font-orbitron text-base px-3 py-2 rounded-md hover:bg-cyber-accent/10 transition-colors"
              onClick={onItemClick}
            >
              BOOKMARKS
            </Link>
          )}
        </div>
        
        {isLoggedIn ? (
          <div className="flex flex-col space-y-2 pt-2 border-t border-cyber-accent/20">
            <div className="px-3 py-2 font-orbitron text-cyber-accent">
              {username}
            </div>
            <button 
              onClick={onLogout}
              className="text-left text-red-500 px-3 py-2 rounded-md hover:bg-red-500/10 transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2 pt-2 border-t border-cyber-accent/20">
            <Button 
              onClick={onSignInClick}
              className="w-full bg-cyber-accent text-cyber-background"
            >
              Sign In
            </Button>
            <Button
              onClick={onSignUpClick}
              variant="outline"
              className="w-full border-cyber-accent text-cyber-accent"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
