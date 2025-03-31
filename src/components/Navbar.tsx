
import React, { useState, useEffect, useRef } from "react";
import { Search, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { getSearchSuggestions } from "@/services/searchService";
import { Anime } from "@/types/anime";
import SearchSuggestions from "@/components/SearchSuggestions";
import SignInDialog from "@/components/SignInDialog";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [signInOpen, setSignInOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Debounce search query
  const debouncedSearchTerm = useDebounce(searchQuery, 300);

  // Handle form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0 && highlightedIndex >= 0) {
        // Navigate to the selected anime
        navigate(`/anime/${suggestions[highlightedIndex].mal_id}`);
        setShowSuggestions(false);
      } else if (searchQuery.trim()) {
        // Search with current query
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

  // Fetch suggestions when debounced search term changes
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

  // Handle click outside to close suggestions
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
            <Link to="/anime" className="text-white hover:text-cyber-accent transition-colors">
              ANIME
            </Link>
            <Link to="/genre" className="text-white hover:text-cyber-accent transition-colors">
              GENRES
            </Link>
            <Link to="/seasonal" className="text-white hover:text-cyber-accent transition-colors">
              SEASONAL
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div ref={searchRef} className="relative">
              <form onSubmit={handleSearch}>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
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
              
              {/* Search suggestions dropdown */}
              <SearchSuggestions
                results={suggestions}
                query={searchQuery}
                visible={showSuggestions}
                onItemClick={() => setShowSuggestions(false)}
                highlightIndex={highlightedIndex}
                onMouseEnter={setHighlightedIndex}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setSignInOpen(true)}
                variant="default"
                className="py-1 px-4 bg-cyber-accent text-cyber-background rounded-md text-sm font-medium hover:bg-opacity-80 transition-colors"
              >
                Sign In
              </Button>
              
              <Button
                onClick={() => {
                  setSignInOpen(true);
                  // Trigger the Sign Up dialog through Sign In dialog
                  setTimeout(() => {
                    document.querySelector('[aria-label="Sign up"]')?.dispatchEvent(
                      new MouseEvent('click', { bubbles: true })
                    );
                  }, 100);
                }}
                variant="outline"
                className="hidden md:flex py-1 px-4 border-cyber-accent text-cyber-accent rounded-md text-sm font-medium hover:bg-cyber-accent/10 transition-colors gap-1 items-center"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Sign Up
              </Button>
            </div>
            
            {/* Sign In Dialog with Sign Up capability */}
            <SignInDialog 
              open={signInOpen} 
              onOpenChange={setSignInOpen} 
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
