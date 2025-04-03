
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { searchAnime } from "@/services/searchService";
import { searchManga } from "@/services/mangaService";
import { Anime } from "@/types/anime";
import { Manga } from "@/types/manga";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimeGrid from "@/components/AnimeGrid";
import MangaGrid from "@/components/MangaGrid";
import { Pagination } from "@/components/ui/pagination";
import { PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface SearchResultsProps {
  manga?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ manga = false }) => {
  const { query } = useParams<{ query: string }>();
  const [results, setResults] = useState<Anime[] | Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = manga 
          ? await searchManga(query, currentPage)
          : await searchAnime(query, currentPage);
        
        if (response && response.data) {
          setResults(response.data);
          setTotalPages(Math.min(10, Math.ceil(response.pagination.items.total / 12)));
        } else {
          setResults([]);
          setError("No results found");
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to load search results");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, currentPage, manga]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-cyber-background noise-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-orbitron text-white mb-6">
          {manga ? "Manga" : "Anime"} Search Results for "{query}"
        </h1>
        
        {manga ? (
          <MangaGrid
            mangaList={results as Manga[]}
            loading={loading}
            error={error}
          />
        ) : (
          <AnimeGrid
            animeList={results as Anime[]}
            loading={loading}
            error={error}
          />
        )}
        
        {!loading && !error && results.length > 0 && totalPages > 1 && (
          <Pagination className="my-10">
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="cursor-pointer border-cyber-accent/30 text-cyber-accent hover:bg-cyber-accent/10" 
                  />
                </PaginationItem>
              )}
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = 1;
                
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`cursor-pointer ${
                        currentPage === pageNum 
                          ? "border-cyber-accent bg-cyber-accent/20 text-cyber-accent" 
                          : "border-cyber-accent/30 text-white hover:bg-cyber-accent/10"
                      }`}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="cursor-pointer border-cyber-accent/30 text-cyber-accent hover:bg-cyber-accent/10"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
