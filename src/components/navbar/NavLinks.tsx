import React from "react";
import { Link } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";

interface NavLinksProps {
  isLoggedIn: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({ isLoggedIn }) => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-1 md:gap-2">
        {/* Home Link */}
        <NavigationMenuItem>
          <Link 
            to="/" 
            className="text-white hover:text-cyber-accent transition-all duration-300 px-3 py-2 font-orbitron text-xs md:text-sm relative group"
          >
            HOME
            <span className="absolute bottom-0 left-0 w-0 h-px bg-cyber-accent transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </NavigationMenuItem>

        {/* Explore Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-cyber-accent/10 data-[state=open]:bg-cyber-accent/20 text-white font-orbitron text-xs md:text-sm px-3 py-2">
            EXPLORE
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-cyber-background/95 border border-cyber-accent/30 p-4 min-w-[200px] backdrop-blur-lg shadow-cyber">
            <ul className="grid gap-2 w-full">
              <NavigationMenuLink asChild>
                <Link
                  to="/anime"
                  className="flex items-center gap-2 p-2 hover:bg-cyber-accent/10 rounded-md transition-colors group"
                >
                  <span className="text-cyber-accent group-hover:animate-pulse">▹</span>
                  <span className="text-white">All Anime</span>
                </Link>
              </NavigationMenuLink>
              
              <NavigationMenuLink asChild>
                <Link
                  to="/seasonal"
                  className="flex items-center gap-2 p-2 hover:bg-cyber-accent/10 rounded-md transition-colors group"
                >
                  <span className="text-cyber-accent group-hover:animate-pulse">▹</span>
                  <span className="text-white">Seasonal</span>
                </Link>
              </NavigationMenuLink>
              
              <NavigationMenuLink asChild>
                <Link
                  to="/genre"
                  className="flex items-center gap-2 p-2 hover:bg-cyber-accent/10 rounded-md transition-colors group"
                >
                  <span className="text-cyber-accent group-hover:animate-pulse">▹</span>
                  <span className="text-white">Genres</span>
                </Link>
              </NavigationMenuLink>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Conditional Bookmarks Link */}
        {isLoggedIn && (
          <NavigationMenuItem>
            <Link
              to="/bookmark"
              className="text-white hover:text-cyber-accent transition-all duration-300 px-3 py-2 font-orbitron text-xs md:text-sm relative group"
            >
              BOOKMARKS
              <span className="absolute bottom-0 left-0 w-0 h-px bg-cyber-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavLinks;