
import React, { useState, useEffect } from "react";
import { getTopManga, getRecentManga } from "@/services/mangaService";
import { Manga } from "@/types/manga";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MangaGrid from "@/components/MangaGrid";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MangaPage = () => {
  const [popularManga, setPopularManga] = useState<Manga[]>([]);
  const [recentManga, setRecentManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManga = async () => {
      try {
        setLoading(true);
        const [topResponse, recentResponse] = await Promise.all([
          getTopManga(currentPage, 24),
          getRecentManga(1, 6)
        ]);
        
        setPopularManga(topResponse.data);
        setRecentManga(recentResponse.data);
        setTotalPages(Math.min(10, Math.ceil(topResponse.pagination.items.total / 24)));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch manga:", err);
        setError("Failed to load manga data");
        setLoading(false);
      }
    };

    fetchManga();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
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
        </div>
      </div>

      {/* New Releases Section */}
      <div className="container mx-auto px-4 py-8">
        <MangaGrid
          title="New Releases"
          mangaList={recentManga}
          loading={loading}
          error={null}
          viewMoreLink="/manga/recent"
        />
      </div>

      {/* Reading Experience Preview Section */}
      <div className="bg-cyber-purple/10 py-12 my-8">
        <div className="container mx-auto px-4">
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
              <Button className="bg-cyber-accent text-cyber-background">Start Reading</Button>
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
                    <img src="https://cdn.myanimelist.net/images/manga/3/243675.jpg" className="w-1/2 h-64 object-contain bg-gray-900" alt="Manga page preview" />
                    <img src="https://cdn.myanimelist.net/images/manga/1/268323.jpg" className="w-1/2 h-64 object-contain bg-gray-900" alt="Manga page preview" />
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
      </div>

      {/* Popular Manga Section with Pagination */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-orbitron text-white mb-6">Popular Manga</h2>
        
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
      
      <Footer />
    </div>
  );
};

export default MangaPage;
