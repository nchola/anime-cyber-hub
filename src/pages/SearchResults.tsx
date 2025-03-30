
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchAnime } from "@/services/animeService";
import Navbar from "@/components/Navbar";
import AnimeGrid from "@/components/AnimeGrid";
import Footer from "@/components/Footer";

const SearchResults = () => {
  const { query } = useParams<{ query: string }>();
  
  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["animeSearch", query],
    queryFn: () => searchAnime(query || ""),
    enabled: !!query,
  });

  return (
    <div className="min-h-screen bg-cyber-background noise-bg">
      <Navbar />
      
      <div className="pt-16 pb-20"> {/* Padding for navbar and footer */}
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-orbitron font-bold text-white mb-8">
            Search Results: <span className="text-cyber-accent">{query}</span>
          </h1>
        </div>
        
        <AnimeGrid
          animeList={searchResults?.data || []}
          title="Anime Found"
          loading={isLoading}
          error={error ? "Failed to load search results" : null}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
