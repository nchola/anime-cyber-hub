
import React from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const NavbarBrand = () => {
  const isMobile = useIsMobile();
  
  return (
    <Link to="/" className="flex items-center space-x-2">
      <span className={`text-cyber-accent ${isMobile ? 'text-lg' : 'text-xl sm:text-2xl'} font-orbitron font-bold`}>
        CYBER<span className="text-white">ANIME</span>
      </span>
    </Link>
  );
};

export default NavbarBrand;
