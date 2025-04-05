
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getSeasonNow, getSeasonList, getSeasonUpcoming } from "@/services/searchService";
import { Anime } from "@/types/anime";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimeGrid from "@/components/AnimeGrid";
import SlidableHeroSection from "@/components/SlidableHeroSection";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const getCurrentSeason = () => {
  const now = new Date();
  const month = now.getMonth();
  
  if (month >= 0 && month <= 2) return "Winter";
  if (month >= 3 && month <= 5) return "Spring";
  if (month >= 6 && month <= 8) return "Summer";
  return "Fall";
};

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const SeasonalAnime = () => {
  const [currentAnimeList, setCurrentAnimeList] = useState<Anime[]>([]);
  const [featuredAnime, setFeaturedAnime] = useState<Anime[]>([]);
  const [upcomingAnimeList, setUpcomingAnimeList] = useState<Anime[]>([]);
  const [seasonList, setSeasonList] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    current: true,
    upcoming: true,
    list: true,
    featured: true
  });
  const [error, setError] = useState({
    current: null as string | null,
    upcoming: null as string | null,
    list: null as string | null,
    featured: null as string | null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("current");
  const { toast } = useToast();
  
  const currentSeason = getCurrentSeason();
  const currentYear = getCurrentYear();

  useEffect(() => {
    const fetchCurrentSeasonAnime = async () => {
      try {
        setLoading(prev => ({ ...prev, current: true }));
        const response = await getSeasonNow(currentPage, 24);
        setCurrentAnimeList(response.data);
        setTotalPages(Math.min(10, Math.ceil(response.pagination.items.total / 24)));
        setLoading(prev => ({ ...prev, current: false }));
      } catch (err) {
        console.error("Failed to fetch current seasonal anime:", err);
        setError(prev => ({ ...prev, current: "Failed to load current seasonal anime. Please try again later." }));
        setLoading(prev => ({ ...prev, current: false }));
        toast({
          title: "Error",
          description: "Failed to load current seasonal anime. Please try again later.",
          variant: "destructive",
        });
      }
    };

    const fetchFeaturedAnime = async () => {
      try {
        setLoading(prev => ({ ...prev, featured: true }));
        const response = await getSeasonNow(1, 5);
        if (response.data && response.data.length > 0) {
          // Sort by popularity/score to feature the best anime
          const sorted = [...response.data].sort((a, b) => 
            (b.score || 0) - (a.score || 0)
          );
          setFeaturedAnime(sorted.slice(0, 5));
        }
        setLoading(prev => ({ ...prev, featured: false }));
      } catch (err) {
        console.error("Failed to fetch featured seasonal anime:", err);
        setError(prev => ({ ...prev, featured: "Failed to load featured seasonal anime" }));
        setLoading(prev => ({ ...prev, featured: false }));
      }
    };

    const fetchUpcomingSeasonAnime = async () => {
      try {
        setLoading(prev => ({ ...prev, upcoming: true }));
        const response = await getSeasonUpcoming(1, 24);
        setUpcomingAnimeList(response.data);
        setLoading(prev => ({ ...prev, upcoming: false }));
      } catch (err) {
        console.error("Failed to fetch upcoming seasonal anime:", err);
        setError(prev => ({ ...prev, upcoming: "Failed to load upcoming seasonal anime. Please try again later." }));
        setLoading(prev => ({ ...prev, upcoming: false }));
      }
    };

    const fetchSeasonList = async () => {
      try {
        setLoading(prev => ({ ...prev, list: true }));
        const response = await getSeasonList();
        setSeasonList(response.data);
        setLoading(prev => ({ ...prev, list: false }));
      } catch (err) {
        console.error("Failed to fetch season list:", err);
        setError(prev => ({ ...prev, list: "Failed to load season list. Please try again later." }));
        setLoading(prev => ({ ...prev, list: false }));
      }
    };

    fetchCurrentSeasonAnime();
    fetchFeaturedAnime();
    fetchUpcomingSeasonAnime();
    fetchSeasonList();
  }, [currentPage, toast]);

  const handlePageChange = (page: number) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-cyber-background noise-bg">
      <Navbar />
      
      <div className="pt-16"> {/* Padding for navbar */}
        <SlidableHeroSection
          title={`${currentSeason} ${currentYear} Anime`}
          subtitle="Discover what's hot this season"
          items={featuredAnime}
          loading={loading.featured}
          error={error.featured}
        />
        
        <div className="pt-8 pb-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="current" onValueChange={handleTabChange} className="w-full mb-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="current" className="font-orbitron">Current Season</TabsTrigger>
                <TabsTrigger value="upcoming" className="font-orbitron">Upcoming</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current">
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-cyber-accent mb-8 text-center">
                  {currentSeason} {currentYear} Releases
                </h2>
                
                <AnimeGrid
                  title=""
                  animeList={currentAnimeList}
                  loading={loading.current}
                  error={error.current}
                />
                
                {!loading.current && !error.current && currentAnimeList.length > 0 && totalPages > 1 && (
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
              
              <TabsContent value="upcoming">
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-cyber-accent mb-8 text-center">
                  Upcoming Season Releases
                </h2>
                
                <AnimeGrid
                  title=""
                  animeList={upcomingAnimeList}
                  loading={loading.upcoming}
                  error={error.upcoming}
                />
              </TabsContent>
            </Tabs>
            
            {!loading.list && !error.list && seasonList.length > 0 && (
              <div className="mt-16 bg-cyber-background/40 border border-cyber-accent/20 rounded-lg p-6">
                <h3 className="text-2xl font-orbitron text-cyber-accent mb-6 text-center">
                  Available Seasons Archive
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {seasonList.slice(0, 12).map((season, index) => (
                    <div 
                      key={`${season.year}-${season.season}`}
                      className="bg-cyber-background/60 border border-cyber-accent/30 hover:border-cyber-accent/70 
                                rounded-md p-3 text-center cursor-pointer transition-all"
                    >
                      <p className="text-cyber-accent font-medium">{season.year}</p>
                      <p className="text-gray-300 capitalize">{season.season}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SeasonalAnime;
