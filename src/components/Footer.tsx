
import React from "react";
import { Github, Instagram, Linkedin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const Footer = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className="bg-cyber-background noise-bg border-t border-cyber-accent/20 py-10">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-8' : 'md:grid-cols-4 gap-8'}`}>
          <div>
            <h3 className="text-xl font-orbitron font-bold text-cyber-accent mb-4">
              CYBER<span className="text-white">ANIME</span>
            </h3>
            <p className="text-gray-400 text-sm">
              A modern cyberpunk-themed anime catalog with a focus on performance and user experience.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://github.com/nchola" className="text-gray-400 hover:text-cyber-accent" target="_blank" rel="noopener noreferrer">
                <Github size={18} />
              </a>
              <a href="https://www.instagram.com/nndncholaa/" className="text-gray-400 hover:text-cyber-accent" target="_blank" rel="noopener noreferrer">
                <Instagram size={18} />
              </a>
              <a href="https://www.linkedin.com/in/mhmmdnanda/" className="text-gray-400 hover:text-cyber-accent" target="_blank" rel="noopener noreferrer">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          {/* Mobile: horizontal links, Desktop: vertical columns */}
          {isMobile ? (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="text-white font-orbitron font-semibold mb-3 text-sm">Quick Links</h4>
                <ul className="space-y-1 text-xs">
                  <li><Link to="/" className="text-gray-400 hover:text-cyber-accent">Home</Link></li>
                  <li><Link to="/top" className="text-gray-400 hover:text-cyber-accent">Top Anime</Link></li>
                  <li><Link to="/seasonal" className="text-gray-400 hover:text-cyber-accent">Seasonal</Link></li>
                  <li><Link to="/upcoming" className="text-gray-400 hover:text-cyber-accent">Upcoming</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-orbitron font-semibold mb-3 text-sm">Genres</h4>
                <ul className="space-y-1 text-xs">
                  <li><Link to="/genre/1" className="text-gray-400 hover:text-cyber-accent">Action</Link></li>
                  <li><Link to="/genre/2" className="text-gray-400 hover:text-cyber-accent">Adventure</Link></li>
                  <li><Link to="/genre/4" className="text-gray-400 hover:text-cyber-accent">Comedy</Link></li>
                  <li><Link to="/genre/8" className="text-gray-400 hover:text-cyber-accent">Drama</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-orbitron font-semibold mb-3 text-sm">Legal</h4>
                <ul className="space-y-1 text-xs">
                  <li><Link to="/terms" className="text-gray-400 hover:text-cyber-accent">Terms</Link></li>
                  <li><Link to="/privacy" className="text-gray-400 hover:text-cyber-accent">Privacy</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-cyber-accent">About Us</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-cyber-accent">Contact</Link></li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h4 className="text-white font-orbitron font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/" className="text-gray-400 hover:text-cyber-accent">Home</Link></li>
                  <li><Link to="/top" className="text-gray-400 hover:text-cyber-accent">Top Anime</Link></li>
                  <li><Link to="/seasonal" className="text-gray-400 hover:text-cyber-accent">Seasonal</Link></li>
                  <li><Link to="/upcoming" className="text-gray-400 hover:text-cyber-accent">Upcoming</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-orbitron font-semibold mb-4">Genres</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/genre/1" className="text-gray-400 hover:text-cyber-accent">Action</Link></li>
                  <li><Link to="/genre/2" className="text-gray-400 hover:text-cyber-accent">Adventure</Link></li>
                  <li><Link to="/genre/4" className="text-gray-400 hover:text-cyber-accent">Comedy</Link></li>
                  <li><Link to="/genre/8" className="text-gray-400 hover:text-cyber-accent">Drama</Link></li>
                  <li><Link to="/genre/10" className="text-gray-400 hover:text-cyber-accent">Fantasy</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-orbitron font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/terms" className="text-gray-400 hover:text-cyber-accent">Terms of Service</Link></li>
                  <li><Link to="/privacy" className="text-gray-400 hover:text-cyber-accent">Privacy Policy</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-cyber-accent">About Us</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-cyber-accent">Contact</Link></li>
                </ul>
              </div>
            </>
          )}
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Data provided by <a href="https://jikan.moe/" className="text-cyber-accent hover:underline">Jikan API</a>. 
            This site is not affiliated with MyAnimeList or any anime production companies.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            © {new Date().getFullYear()} CyberAnime. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
