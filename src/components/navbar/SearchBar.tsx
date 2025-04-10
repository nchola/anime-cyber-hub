import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { searchAnime } from "@/services/searchService";
import { Anime } from "@/types/anime";
import SearchSuggestions from "@/components/SearchSuggestions";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  
  const debouncedSearchTerm = useDebounce(searchQuery, 300);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
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
        const results = await searchAnime(debouncedSearchTerm, 1, 5);
        if (results && results.data) {
          setSuggestions(results.data);
          setShowSuggestions(true);
          setHighlightedIndex(-1);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
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
    <div ref={searchRef} className="relative w-full max-w-[300px]">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
          placeholder="Find anime"
          className="py-1 pl-2 pr-8 w-full bg-cyber-background border border-cyber-accent/30 rounded-md focus:outline-none focus:border-cyber-accent text-xs md:text-sm placeholder-gray-500"
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
      
      <div className="absolute left-0 right-0 w-full">
        <SearchSuggestions
          results={suggestions}
          query={searchQuery}
          visible={showSuggestions}
          onItemClick={() => setShowSuggestions(false)}
          highlightIndex={highlightedIndex}
          onMouseEnter={setHighlightedIndex}
        />
      </div>
    </div>
  );
};

export default SearchBar;
