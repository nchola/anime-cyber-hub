import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getTopAnime } from "@/services/animeService";
import { Anime } from "@/types/anime";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimeGrid from "@/components/AnimeGrid";
import PageHeroSection from "@/components/PageHeroSection";
import AnimatedCardCarousel from "@/components/AnimatedCardCarousel";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const AllAnime = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllAnime = async () => {
      try {
        setLoading(true);
        const response = await getTopAnime(currentPage, 24); // Fetch more items for this page
        setAnimeList(response.data);
        setTotalPages(Math.min(10, Math.ceil(response.pagination.items.total / 24)));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch anime:", err);
        setError("Failed to load anime. Please try again later.");
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load anime. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchAllAnime();
  }, [currentPage, toast]);

  const handlePageChange = (page: number) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  // Get a few featured anime for the hero section
  const featuredAnime = animeList.slice(0, 5);

  return (
    <div className="min-h-screen bg-cyber-background noise-bg">
      <Navbar />
      
      <PageHeroSection
        title="All Anime Collection"
        subtitle="Discover the best anime from across the universe"
        items={featuredAnime}
        type="anime"
      />
      
      <div className="pt-12 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-cyber-accent mb-8 text-center">
            Top Rated Anime
          </h1>
          
          <AnimeGrid
            title=""
            animeList={animeList}
            loading={loading}
            error={error}
          />
          
          {!loading && !error && animeList.length > 0 && totalPages > 1 && (
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
          
          {/* Featured Anime Carousel */}
          {!loading && !error && animeList.length > 0 && (
            <div className="mt-16 mb-8">
              <AnimatedCardCarousel 
                items={animeList.slice(0, 10)} 
                title="Featured Anime" 
                subtitle="Check out these top-rated anime series"
                type="anime"
              />
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AllAnime;
