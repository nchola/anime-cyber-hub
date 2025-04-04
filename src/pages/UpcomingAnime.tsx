
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getUpcomingAnime } from "@/services/animeService";
import { getSeasonUpcoming } from "@/services/searchService";
import { Anime } from "@/types/anime";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimeGrid from "@/components/AnimeGrid";
import PageHeroSection from "@/components/PageHeroSection";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const UpcomingAnime = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [featuredAnime, setFeaturedAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState({
    main: true,
    featured: true
  });
  const [error, setError] = useState({
    main: null as string | null,
    featured: null as string | null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUpcomingAnime = async () => {
      try {
        setLoading(prev => ({ ...prev, main: true }));
        const response = await getUpcomingAnime(currentPage, 24);
        setAnimeList(response.data);
        setTotalPages(Math.min(10, Math.ceil(response.pagination.items.total / 24)));
        setLoading(prev => ({ ...prev, main: false }));
      } catch (err) {
        console.error("Failed to fetch upcoming anime:", err);
        setError(prev => ({ ...prev, main: "Failed to load upcoming anime. Please try again later." }));
        setLoading(prev => ({ ...prev, main: false }));
        toast({
          title: "Error",
          description: "Failed to load upcoming anime. Please try again later.",
          variant: "destructive",
        });
      }
    };

    const fetchFeaturedUpcoming = async () => {
      try {
        setLoading(prev => ({ ...prev, featured: true }));
        const response = await getSeasonUpcoming(1, 5);
        if (response.data && response.data.length > 0) {
          // Sort by popularity to feature the most anticipated anime
          const sorted = [...response.data].sort((a, b) => 
            (b.members || 0) - (a.members || 0)
          );
          setFeaturedAnime(sorted.slice(0, 5));
        }
        setLoading(prev => ({ ...prev, featured: false }));
      } catch (err) {
        console.error("Failed to fetch featured upcoming anime:", err);
        setError(prev => ({ ...prev, featured: "Failed to load featured upcoming anime" }));
        setLoading(prev => ({ ...prev, featured: false }));
      }
    };

    fetchUpcomingAnime();
    fetchFeaturedUpcoming();
  }, [currentPage, toast]);

  const handlePageChange = (page: number) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-cyber-background noise-bg">
      <Navbar />
      
      <PageHeroSection
        title="Upcoming Anime"
        subtitle="Get a sneak peek at the future of anime"
        items={featuredAnime}
        type="anime"
        loading={loading.featured}
        error={error.featured}
      />
      
      <div className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-cyber-accent mb-8 text-center">
            Upcoming Releases
          </h1>
          
          <AnimeGrid
            title=""
            animeList={animeList}
            loading={loading.main}
            error={error.main}
          />
          
          {!loading.main && !error.main && animeList.length > 0 && totalPages > 1 && (
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
      </div>
      
      <Footer />
    </div>
  );
};

export default UpcomingAnime;
