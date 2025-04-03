
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Anime } from "@/types/anime";
import { getAnimeByGenre, getAnimeGenres } from "@/services/animeService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimeGrid from "@/components/AnimeGrid";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import GenreCloud from "@/components/GenreCloud";
import { Button } from "@/components/ui/button";

const GenrePage = () => {
  const { id } = useParams<{ id: string }>();
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genreName, setGenreName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState<any[]>([]);
  const [featuredAnime, setFeaturedAnime] = useState<Anime | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await getAnimeGenres();
        setGenres(genresData);
        
        if (id) {
          const genre = genresData.find(g => g.mal_id === Number(id));
          if (genre) {
            setGenreName(genre.name);
          }
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, [id]);

  useEffect(() => {
    const fetchAnimeByGenre = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getAnimeByGenre(Number(id), currentPage);
        setAnimeList(response.data);
        setTotalPages(Math.min(10, Math.ceil(response.pagination.items.total / 12)));
        
        // Set a featured anime (first with a good image)
        if (response.data.length > 0) {
          const featured = response.data.find(anime => 
            anime.images?.jpg?.large_image_url && !anime.images.jpg.large_image_url.includes('questionmark')
          ) || response.data[0];
          setFeaturedAnime(featured);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch anime by genre:", err);
        setError("Failed to load anime for this genre");
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load anime for this genre. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchAnimeByGenre();
  }, [id, currentPage, toast]);

  const handlePageChange = (page: number) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-cyber-background noise-bg">
      <Navbar />
      
      {/* Genre Hero Section */}
      <div className="relative pt-16">
        {featuredAnime && (
          <div 
            className="absolute top-0 left-0 right-0 h-[400px] bg-cover bg-center opacity-20 blur-sm"
            style={{ backgroundImage: `url(${featuredAnime.images.jpg.large_image_url})` }}
          />
        )}
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-cyber-background/50 via-cyber-background/70 to-cyber-background" />
        
        <div className="container mx-auto px-4 pt-12 pb-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-4">
              {id ? `${genreName} Anime` : 'Browse by Genre'}
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              {id 
                ? `Discover the best ${genreName} anime in our collection`
                : 'Explore anime across different genres and find your next favorite series'
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* Genre Cloud - only show when not viewing a specific genre */}
      {!id && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-cyber-background/60 border border-cyber-accent/30 rounded-lg p-8 mb-10">
            <h2 className="text-2xl font-orbitron text-cyber-accent mb-6">Popular Genres</h2>
            <GenreCloud genres={genres} />
          </div>
        </div>
      )}
      
      {/* Quick Genre Navigation - show for specific genre */}
      {id && (
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {genres.slice(0, 10).map(genre => (
              <Link key={genre.mal_id} to={`/genre/${genre.mal_id}`}>
                <Button 
                  variant={Number(id) === genre.mal_id ? "default" : "outline"}
                  className={Number(id) === genre.mal_id 
                    ? "bg-cyber-accent text-cyber-background" 
                    : "border-cyber-accent/30 text-white hover:bg-cyber-accent/10"}
                  size="sm"
                >
                  {genre.name}
                </Button>
              </Link>
            ))}
            <Link to="/genre">
              <Button variant="outline" className="border-cyber-accent/30 text-white hover:bg-cyber-accent/10" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      {/* Anime Grid */}
      {id && (
        <div className="container mx-auto px-4">
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
        </div>
      )}
      
      {/* Popular Genre Cards - show on main genre page */}
      {!id && (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {genres.slice(0, 6).map(genre => (
              <Link key={genre.mal_id} to={`/genre/${genre.mal_id}`} className="block">
                <div className="cyber-card p-6 h-full bg-gradient-to-br from-cyber-background/90 to-cyber-background border border-cyber-accent/30 rounded-lg hover:border-cyber-accent/60 transition-all group">
                  <h3 className="text-xl font-orbitron text-cyber-accent mb-2 group-hover:text-white transition-colors">
                    {genre.name}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {genre.count} titles
                  </p>
                  <div className="mt-auto pt-4 text-right">
                    <span className="text-cyber-accent text-sm group-hover:underline">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default GenrePage;
