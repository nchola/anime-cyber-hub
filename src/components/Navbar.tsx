import React, { useState, useEffect, useRef } from "react";
import { Search, UserPlus, User, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { getSearchSuggestions } from "@/services/searchService";
import { Anime } from "@/types/anime";
import SearchSuggestions from "@/components/SearchSuggestions";
import SignInDialog from "@/components/SignInDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [signInOpen, setSignInOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    
    if (token && userJson) {
      try {
        const userData = JSON.parse(userJson);
        setIsLoggedIn(true);
        setUsername(userData.username || 'User');
        setAvatar(userData.avatar || '');
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUsername('');
    setAvatar('');
    setMobileMenuOpen(false);
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari akun",
    });
  };
  
  const debouncedSearchTerm = useDebounce(searchQuery, 300);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0 && highlightedIndex >= 0) {
        navigate(`/anime/${suggestions[highlightedIndex].mal_id}`);
        setShowSuggestions(false);
      } else if (searchQuery.trim()) {
        navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
        setShowSuggestions(false);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await getSearchSuggestions(debouncedSearchTerm);
        setSuggestions(results);
        setShowSuggestions(true);
        setHighlightedIndex(-1);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-cyber-background/80 backdrop-blur-md border-b border-cyber-accent/20">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-cyber-accent text-xl sm:text-2xl font-orbitron font-bold">
                CYBER<span className="text-white">ANIME</span>
              </span>
            </Link>
            
            <div className="hidden md:flex ml-6 lg:ml-8">
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
                            <Link to="/genre" className="flex items-center gap-2 p-2 hover:bg-cyber-accent/10 rounded-md transition-colors">
                              <span className="text-cyber-accent">•</span>
                              <span className="text-white">Genres</span>
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
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden text-white hover:text-cyber-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            <div ref={searchRef} className="relative">
              <form onSubmit={handleSearch}>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  placeholder="Search anime..."
                  className="py-1 pl-2 pr-8 w-32 sm:w-40 md:w-64 bg-cyber-background border border-cyber-accent/30 rounded-md focus:outline-none focus:border-cyber-accent text-xs md:text-sm placeholder-gray-500"
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon"
                  className="absolute right-0 top-0 h-full px-2 text-gray-400 hover:text-cyber-accent"
                >
                  <Search className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </form>
              
              <SearchSuggestions
                results={suggestions}
                query={searchQuery}
                visible={showSuggestions}
                onItemClick={() => setShowSuggestions(false)}
                highlightIndex={highlightedIndex}
                onMouseEnter={setHighlightedIndex}
              />
            </div>
            
            <div className="hidden md:block">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="relative h-7 w-7 md:h-8 md:w-8 rounded-full overflow-hidden border border-cyber-accent/50 focus:ring-0 focus:ring-offset-0"
                      >
                        {avatar ? (
                          <img src={avatar} alt={username} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-3 w-3 md:h-4 md:w-4 text-cyber-accent" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-cyber-background/95 border border-cyber-accent/30 backdrop-blur-md">
                      <DropdownMenuLabel className="font-orbitron text-cyber-accent">
                        {username}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-cyber-accent/20" />
                      <DropdownMenuItem className="cursor-pointer hover:bg-cyber-accent/10 focus:bg-cyber-accent/10">
                        <Link to="/profile" className="flex w-full items-center">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-cyber-accent/10 focus:bg-cyber-accent/10">
                        <Link to="/bookmark" className="flex w-full items-center">Bookmarks</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-cyber-accent/10 focus:bg-cyber-accent/10">
                        <Link to="/settings" className="flex w-full items-center">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-cyber-accent/20" />
                      <DropdownMenuItem 
                        onClick={handleLogout} 
                        className="text-red-500 cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => setSignInOpen(true)}
                    variant="default"
                    className="py-1 px-3 md:px-4 bg-cyber-accent text-cyber-background rounded-md text-xs md:text-sm font-medium hover:bg-opacity-80 transition-colors"
                  >
                    Sign In
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setSignInOpen(true);
                      setTimeout(() => {
                        document.querySelector('[aria-label="Sign up"]')?.dispatchEvent(
                          new MouseEvent('click', { bubbles: true })
                        );
                      }, 100);
                    }}
                    variant="outline"
                    className="hidden md:flex py-1 px-3 md:px-4 border-cyber-accent text-cyber-accent rounded-md text-xs md:text-sm font-medium hover:bg-cyber-accent/10 transition-colors gap-1 items-center"
                  >
                    <UserPlus className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-cyber-background/95 backdrop-blur-md border-b border-cyber-accent/30 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <div className="flex flex-col space-y-3 pt-3">
              <Link 
                to="/" 
                className="text-white hover:text-cyber-accent font-orbitron text-base px-3 py-2 rounded-md hover:bg-cyber-accent/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                HOME
              </Link>
              <Link 
                to="/anime" 
                className="text-white hover:text-cyber-accent font-orbitron text-base px-3 py-2 rounded-md hover:bg-cyber-accent/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                ALL ANIME
              </Link>
              <Link 
                to="/seasonal" 
                className="text-white hover:text-cyber-accent font-orbitron text-base px-3 py-2 rounded-md hover:bg-cyber-accent/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                SEASONAL
              </Link>
              <Link 
                to="/genre" 
                className="text-white hover:text-cyber-accent font-orbitron text-base px-3 py-2 rounded-md hover:bg-cyber-accent/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                GENRES
              </Link>
              {isLoggedIn && (
                <Link 
                  to="/bookmark" 
                  className="text-white hover:text-cyber-accent font-orbitron text-base px-3 py-2 rounded-md hover:bg-cyber-accent/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  BOOKMARKS
                </Link>
              )}
            </div>
            
            <div className="flex flex-col space-y-2 pt-2 border-t border-cyber-accent/20">
              <div className="px-3 py-2 font-orbitron text-cyber-accent">
                {username}
              </div>
              <Link 
                to="/profile" 
                className="text-white hover:text-cyber-accent px-3 py-2 rounded-md hover:bg-cyber-accent/10 transition-colors flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="text-left text-red-500 px-3 py-2 rounded-md hover:bg-red-500/10 transition-colors flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
      
      <SignInDialog 
        open={signInOpen} 
        onOpenChange={setSignInOpen} 
        onLoginSuccess={(userData) => {
          setIsLoggedIn(true);
          setUsername(userData.username || 'User');
          setAvatar(userData.avatar || '');
          toast({
            title: "Login Berhasil",
            description: `Selamat datang kembali, ${userData.username || 'User'}!`,
          });
        }}
      />
    </nav>
  );
};

export default Navbar;
