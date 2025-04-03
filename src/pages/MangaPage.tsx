
import React, { useState, useEffect } from "react";
import { getTopManga, getRecentManga, getMangaGenres } from "@/services/mangaService";
import { Manga, MangaGenre } from "@/types/manga";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MangaGrid from "@/components/MangaGrid";
import MangaGenreCloud from "@/components/MangaGenreCloud";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, ChevronRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const MangaPage = () => {
  const [popularManga, setPopularManga] = useState<Manga[]>([]);
  const [recentManga, setRecentManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [popularGenres, setPopularGenres] = useState<MangaGenre[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchManga = async () => {
      try {
        setLoading(true);
        const [topResponse, recentResponse, genresResponse] = await Promise.all([
          getTopManga(currentPage, 24),
          getRecentManga(1, 6),
          getMangaGenres()
        ]);
        
        if (topResponse && topResponse.data) {
          setPopularManga(topResponse.data);
          setTotalPages(Math.min(10, Math.ceil(topResponse.pagination.items.total / 24)));
        } else {
          setError("Failed to load popular manga");
          toast({
            title: "Error loading manga",
            description: "Could not load popular manga",
            variant: "destructive",
          });
        }
        
        if (recentResponse && recentResponse.data) {
          setRecentManga(recentResponse.data);
        }
        
        // Get top 5 genres with most manga
        if (genresResponse && genresResponse.data) {
          const sortedGenres = genresResponse.data
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
          setPopularGenres(sortedGenres);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch manga:", err);
        setError("Failed to load manga data");
        toast({
          title: "Error loading manga",
          description: "Please try again later",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchManga();
  }, [currentPage, toast]);

  const handlePageChange = (page: number) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/manga/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-background noise-bg">
      <Navbar />
      
      {/* Hero Section with Featured Manga */}
      <div className="relative pt-16">
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-cover bg-center opacity-30"
             style={{ backgroundImage: 'url(https://cdn.myanimelist.net/images/manga/3/268228l.jpg)' }} />
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-cyber-background via-cyber-background/80 to-cyber-background" />
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-5">
              Discover Manga
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Explore thousands of manga titles across different genres and demographics
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for manga..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-cyber-background/70 border border-cyber-accent/30 rounded-lg px-4 py-3 pl-12 text-white focus:outline-none focus:border-cyber-accent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <Button type="submit" className="bg-cyber-accent text-cyber-background mt-4">
                Search
              </Button>
            </form>
          </div>
          
          {/* Quick Links */}
          <div className="flex justify-center mt-8 gap-4 flex-wrap">
            <Link to="/manga">
              <Button variant="outline" className="border-cyber-accent/30 text-cyber-accent">All Manga</Button>
            </Link>
            {popularGenres.map(genre => (
              <Link key={genre.mal_id} to={`/genre/${genre.mal_id}`}>
                <Button variant="outline" className="border-cyber-accent/30 text-cyber-accent">{genre.name}</Button>
              </Link>
            ))}
            <Link to="/bookmark">
              <Button variant="outline" className="border-cyber-accent/30 text-cyber-accent">Bookmarks</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Reading Experience Preview Section (Moved to top as requested) */}
        <div className="bg-cyber-purple/10 p-8 rounded-lg border border-cyber-accent/20 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-orbitron text-white mb-4">Immersive Reading Experience</h2>
              <p className="text-gray-300 mb-6">
                Enjoy a seamless and distraction-free reading experience with our manga reader. 
                Page through your favorite titles with intuitive controls and customizable display options.
              </p>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-cyber-background/60 border border-cyber-accent/30 rounded-md px-4 py-2 text-center">
                  <div className="text-cyber-accent text-xl font-bold">10,000+</div>
                  <div className="text-sm text-gray-400">Manga Titles</div>
                </div>
                <div className="bg-cyber-background/60 border border-cyber-accent/30 rounded-md px-4 py-2 text-center">
                  <div className="text-cyber-accent text-xl font-bold">50+</div>
                  <div className="text-sm text-gray-400">Genres</div>
                </div>
                <div className="bg-cyber-background/60 border border-cyber-accent/30 rounded-md px-4 py-2 text-center">
                  <div className="text-cyber-accent text-xl font-bold">24/7</div>
                  <div className="text-sm text-gray-400">Access</div>
                </div>
              </div>
              <Button 
                className="bg-cyber-accent text-cyber-background"
                onClick={() => {
                  if (popularManga.length > 0) {
                    navigate(`/manga/${popularManga[0].mal_id}`);
                  } else {
                    navigate(`/manga`);
                  }
                }}
              >
                Start Reading
              </Button>
            </div>
            
            <div className="md:w-1/2">
              <div className="cyber-card p-1">
                <div className="bg-cyber-background/80 p-4 rounded">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-cyber-accent font-orbitron">Reader Preview</div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyber-accent"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                    </div>
                  </div>
                  <div className="flex gap-4 overflow-hidden border border-cyber-accent/20 rounded">
                    <img 
                      src="https://cdn.myanimelist.net/images/manga/3/243675.jpg" 
                      className="w-1/2 h-64 object-contain bg-gray-900" 
                      alt="Manga page preview" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <img 
                      src="https://cdn.myanimelist.net/images/manga/1/268323.jpg" 
                      className="w-1/2 h-64 object-contain bg-gray-900" 
                      alt="Manga page preview" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm" className="border-cyber-accent/30 text-cyber-accent">← Previous</Button>
                    <div className="text-white">Page 1/230</div>
                    <Button variant="outline" size="sm" className="border-cyber-accent/30 text-cyber-accent">Next →</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        {/* New Releases Section (Moved to second position as requested) */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-orbitron text-white">New Releases</h2>
            <Link to="/manga/recent" className="flex items-center text-cyber-accent hover:text-cyber-accent/80 transition-colors text-sm">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <MangaGrid
            mangaList={recentManga}
            loading={loading}
            error={null}
          />
        </div>
        
        {/* Genre Cloud Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-orbitron text-white mb-6">Browse by Genre</h2>
          <MangaGenreCloud />
        </div>
      
        {/* Tabs for Different Manga Categories */}
        <div className="mb-8">
          <Tabs defaultValue="popular">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-cyber-background/40 border border-cyber-accent/20">
                <TabsTrigger value="popular" className="data-[state=active]:text-cyber-accent">Popular</TabsTrigger>
                <TabsTrigger value="trending" className="data-[state=active]:text-cyber-accent">Trending</TabsTrigger>
                <TabsTrigger value="upcoming" className="data-[state=active]:text-cyber-accent">Upcoming</TabsTrigger>
              </TabsList>
              
              <Link to="/manga" className="text-cyber-accent hover:text-cyber-accent/80 transition-colors text-sm flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <TabsContent value="popular">
              <MangaGrid
                mangaList={popularManga.slice(0, 12)}
                loading={loading}
                error={error}
              />
            </TabsContent>
            
            <TabsContent value="trending">
              <MangaGrid
                mangaList={popularManga.slice(12, 24)}
                loading={loading}
                error={error}
              />
            </TabsContent>
            
            <TabsContent value="upcoming">
              <MangaGrid
                mangaList={recentManga}
                loading={loading}
                error={error}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Popular Manga Section with Pagination */}
        <div>
          <h2 className="text-2xl font-orbitron text-white mb-6">All Manga</h2>
          
          <MangaGrid
            mangaList={popularManga}
            loading={loading}
            error={error}
          />
          
          {!loading && !error && popularManga.length > 0 && totalPages > 1 && (
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

export default MangaPage;
