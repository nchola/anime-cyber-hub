
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Anime } from "@/types/anime";
import { getAnimeByGenre, getAnimeGenres } from "@/services/animeService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimeGrid from "@/components/AnimeGrid";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const GenrePage = () => {
  const { id } = useParams<{ id: string }>();
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genreName, setGenreName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGenreName = async () => {
      try {
        const genres = await getAnimeGenres();
        const genre = genres.find(g => g.mal_id === Number(id));
        if (genre) {
          setGenreName(genre.name);
        }
      } catch (error) {
        console.error("Error fetching genre name:", error);
      }
    };

    const fetchAnimeByGenre = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getAnimeByGenre(Number(id), currentPage);
        setAnimeList(response.data);
        setTotalPages(Math.min(10, Math.ceil(response.pagination.items.total / 12)));
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

    fetchGenreName();
    fetchAnimeByGenre();
  }, [id, currentPage, toast]);

  const handlePageChange = (page: number) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-cyber-background noise-bg">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-cyber-accent mb-6">
            {genreName ? `${genreName} Anime` : 'Genre Anime'}
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
                  // Simple pagination logic to show 5 pages around current page
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

export default GenrePage;
