
import React from "react";
import { Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-cyber-background noise-bg border-t border-cyber-accent/20 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-orbitron font-bold text-cyber-accent mb-4">
              CYBER<span className="text-white">ANIME</span>
            </h3>
            <p className="text-gray-400 text-sm">
              A modern cyberpunk-themed anime catalog with a focus on performance and user experience.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-cyber-accent">
                <Github size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyber-accent">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyber-accent">
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-orbitron font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-cyber-accent">Home</a></li>
              <li><a href="/top" className="text-gray-400 hover:text-cyber-accent">Top Anime</a></li>
              <li><a href="/seasonal" className="text-gray-400 hover:text-cyber-accent">Seasonal</a></li>
              <li><a href="/upcoming" className="text-gray-400 hover:text-cyber-accent">Upcoming</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-orbitron font-semibold mb-4">Genres</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/genre/1" className="text-gray-400 hover:text-cyber-accent">Action</a></li>
              <li><a href="/genre/2" className="text-gray-400 hover:text-cyber-accent">Adventure</a></li>
              <li><a href="/genre/4" className="text-gray-400 hover:text-cyber-accent">Comedy</a></li>
              <li><a href="/genre/8" className="text-gray-400 hover:text-cyber-accent">Drama</a></li>
              <li><a href="/genre/10" className="text-gray-400 hover:text-cyber-accent">Fantasy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-orbitron font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/terms" className="text-gray-400 hover:text-cyber-accent">Terms of Service</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-cyber-accent">Privacy Policy</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-cyber-accent">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-cyber-accent">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
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
