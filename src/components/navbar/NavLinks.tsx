
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
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className="text-white hover:text-cyber-accent transition-colors px-3 lg:px-4 py-2 font-orbitron text-xs lg:text-sm">
            HOME
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:text-cyber-accent hover:bg-transparent font-orbitron text-xs lg:text-sm">
            EXPLORE
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-cyber-background/95 border border-cyber-accent/30 p-4 min-w-[16rem] backdrop-blur-md">
            <ul className="grid gap-3">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/anime" className="flex items-center gap-2 p-2 hover:bg-cyber-accent/10 rounded-md transition-colors">
                    <span className="text-cyber-accent">•</span>
                    <span className="text-white">All Anime</span>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/seasonal" className="flex items-center gap-2 p-2 hover:bg-cyber-accent/10 rounded-md transition-colors">
                    <span className="text-cyber-accent">•</span>
                    <span className="text-white">Seasonal</span>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/upcoming" className="flex items-center gap-2 p-2 hover:bg-cyber-accent/10 rounded-md transition-colors">
                    <span className="text-cyber-accent">•</span>
                    <span className="text-white">Upcoming</span>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/genre" className="flex items-center gap-2 p-2 hover:bg-cyber-accent/10 rounded-md transition-colors">
                    <span className="text-cyber-accent">•</span>
                    <span className="text-white">Genres</span>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/top" className="flex items-center gap-2 p-2 hover:bg-cyber-accent/10 rounded-md transition-colors">
                    <span className="text-cyber-accent">•</span>
                    <span className="text-white">Top Rated</span>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        {isLoggedIn && (
          <NavigationMenuItem>
            <Link to="/bookmark" className="text-white hover:text-cyber-accent transition-colors px-3 lg:px-4 py-2 font-orbitron text-xs lg:text-sm">
              BOOKMARKS
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavLinks;
