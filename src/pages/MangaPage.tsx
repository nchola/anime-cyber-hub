
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MangaGrid from "@/components/MangaGrid";
import MangaGenreCloud from "@/components/MangaGenreCloud";
import { Manga } from "@/types/manga";
import { getTopManga, getRecentManga, getPopularMangaByGenre } from "@/services/mangaService";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import TabNavigation from "@/components/TabNavigation";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

const MangaPage = () => {
  const [topManga, setTopManga] = useState<Manga[]>([]);
  const [recentManga, setRecentManga] = useState<Manga[]>([]);
  const [featuredGenreManga, setFeaturedGenreManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState({
    top: true,
    recent: true,
    genre: true
  });
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const mangaPerPage = 10; // Limit to 10 manga per page
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchManga = async () => {
    try {
      setLoading({ top: true, recent: true, genre: true });
      
      const [topResult, recentResult, featuredGenreResult] = await Promise.all([
        getTopManga(currentPage, mangaPerPage),
        getRecentManga(1, 6),
        getPopularMangaByGenre(1, 1, 6) // Romance genre
      ]);
      
      setTopManga(topResult.data);
      setRecentManga(recentResult.data);
      setFeaturedGenreManga(featuredGenreResult.data);
      
      // Calculate total pages based on top manga result
      if (topResult.pagination) {
        const calculatedPages = Math.ceil(topResult.pagination.items.total / mangaPerPage);
        setTotalPages(Math.min(calculatedPages, 20)); // Limit to 20 pages maximum
      }
      
      setLoading({ top: false, recent: false, genre: false });
    } catch (err) {
      console.error("Failed to fetch manga:", err);
      setError("Failed to load manga. Please try again later.");
      setLoading({ top: false, recent: false, genre: false });
      toast({
        title: "Error",
        description: "There was a problem loading manga data.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchManga();
  }, [currentPage, toast]);

  const handlePageChange = (page: number) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-cyber-background noise-bg">
      <Navbar />
      
      <div className="bg-gradient-to-b from-cyber-background via-cyber-background/80 to-cyber-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-cyber-accent mb-4">
            Manga Library
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Explore the vast world of manga
          </p>
          
          <TabNavigation />
        </div>
      </div>
      
      <div className="pt-12 pb-24">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-3xl font-orbitron font-bold text-cyber-accent mb-6 text-center">
              Explore Manga Genres
            </h2>
            <MangaGenreCloud />
          </div>
          
          <Tabs defaultValue="top" className="mb-16">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="top" className="font-orbitron">Top Manga</TabsTrigger>
              <TabsTrigger value="recent" className="font-orbitron">Recent Manga</TabsTrigger>
            </TabsList>
            
            <TabsContent value="top">
              <h2 className="text-2xl font-orbitron font-bold text-white mb-8 text-center">
                Top-Rated Manga Series
              </h2>
              
              <MangaGrid 
                mangaList={topManga}
                loading={loading.top}
                error={error}
                className="mb-10"
              />
              
              {!loading.top && !error && topManga.length > 0 && (
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
            </TabsContent>
            
            <TabsContent value="recent">
              <h2 className="text-2xl font-orbitron font-bold text-white mb-8 text-center">
                Recently Updated Manga
              </h2>
              
              <MangaGrid 
                mangaList={recentManga}
                loading={loading.recent}
                error={error}
                className="mb-6"
              />
              
              <div className="text-center mt-6">
                <Button 
                  onClick={() => navigate("/manga/recent")}
                  className="bg-cyber-accent text-cyber-background font-orbitron"
                >
                  View All Recent Manga
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-16">
            <h2 className="text-2xl font-orbitron font-bold text-white mb-8 text-center">
              Featured Romance Manga
            </h2>
            
            <MangaGrid 
              mangaList={featuredGenreManga}
              loading={loading.genre}
              error={error}
              className="mb-6"
            />
            
            <div className="text-center mt-6">
              <Button 
                onClick={() => navigate("/genre/1")}
                className="bg-cyber-accent text-cyber-background font-orbitron"
              >
                Explore More Romance Manga
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MangaPage;
