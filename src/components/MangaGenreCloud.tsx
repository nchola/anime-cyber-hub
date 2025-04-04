
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMangaGenres } from "@/services/mangaService";
import { MangaGenre } from "@/types/manga";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const MangaGenreCloud = () => {
  const [genres, setGenres] = useState<MangaGenre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        console.log("Fetching manga genres...");
        const response = await getMangaGenres();
        console.log("Manga genres response:", response);
        
        if (response && response.data && response.data.length > 0) {
          // Filter out duplicates by creating a Map based on mal_id
          const uniqueGenres = Array.from(
            new Map(response.data.map(genre => [genre.mal_id, genre])).values()
          );
          setGenres(uniqueGenres);
        } else {
          setError("No genres found");
          toast({
            title: "Error loading manga genres",
            description: "Please try again later",
            variant: "destructive",
          });
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch manga genres:", err);
        setError("Failed to load genres");
        toast({
          title: "Error loading manga genres",
          description: "Please try again later",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchGenres();
  }, [toast]);

  // Calculate font size based on count (popularity)
  const getGenreSize = (count: number) => {
    if (genres.length === 0) return isMobile ? 0.6 : 1.0;
    
    const minCount = Math.min(...genres.map(g => g.count || 0));
    const maxCount = Math.max(...genres.map(g => g.count || 0));
    const range = maxCount - minCount;
    
    // Protect against division by zero if all counts are the same
    const normalized = range === 0 ? 0.5 : ((count - minCount) / range);
    
    // Different size ranges for mobile vs desktop
    if (isMobile) {
      return 0.55 + normalized * 0.4; // Font size between 0.55rem and 0.95rem for mobile
    }
    
    return 0.8 + normalized * 0.8; // Font size between 0.8rem and 1.6rem for desktop
  };

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2 justify-center my-6">
        {Array(16).fill(0).map((_, i) => (
          <Skeleton key={`skeleton-${i}`} className="h-7 w-16 md:h-8 md:w-24 rounded-full bg-gray-800/30" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-cyber-accent text-center py-4">{error}</div>;
  }

  // If no genres are found, provide some fallbacks
  if (genres.length === 0) {
    console.log("No genres found, using fallbacks");
    const fallbackGenres: MangaGenre[] = [
      { mal_id: 1, name: "Action", count: 100 },
      { mal_id: 2, name: "Adventure", count: 90 },
      { mal_id: 4, name: "Comedy", count: 110 },
      { mal_id: 8, name: "Drama", count: 85 },
      { mal_id: 10, name: "Fantasy", count: 95 },
      { mal_id: 27, name: "Shounen", count: 105 },
      { mal_id: 40, name: "Psychological", count: 70 },
      { mal_id: 7, name: "Mystery", count: 65 }
    ];
    
    return (
      <div className="flex flex-wrap gap-1 md:gap-2 justify-center my-4 md:my-6 px-2 md:px-4">
        {fallbackGenres.map((genre) => {
          const fontSize = getGenreSize(genre.count);
          return (
            <Link
              to={`/genre/${genre.mal_id}`}
              key={`fallback-${genre.mal_id}`}
              className={`rounded-full bg-gradient-to-r from-cyber-purple/40 to-cyber-accent/20 border border-cyber-accent/30 hover:scale-105 hover:shadow-glow transition-all duration-300 ${
                isMobile ? 'px-1.5 py-0.5 my-0.5' : 'px-3 py-1.5'
              }`}
              style={{ 
                fontSize: `${fontSize}rem`,
                background: `linear-gradient(45deg, #8A2BE2 0%, #FFD95A 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {genre.name}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 md:gap-2 justify-center my-4 md:my-6 px-2 md:px-4">
      {genres
        .sort((a, b) => (b.count || 0) - (a.count || 0))
        .slice(0, 36)
        .map((genre) => {
          const fontSize = getGenreSize(genre.count || 0);
          // Create a unique key with both id and name to avoid duplicates
          const uniqueKey = `genre-${genre.mal_id}-${genre.name}`;
          
          return (
            <Link
              to={`/genre/${genre.mal_id}`}
              key={uniqueKey}
              className={`rounded-full bg-gradient-to-r from-cyber-purple/40 to-cyber-accent/20 border border-cyber-accent/30 hover:scale-105 hover:shadow-glow transition-all duration-300 ${
                isMobile ? 'px-1.5 py-0.5 my-0.5' : 'px-3 py-1.5'
              }`}
              style={{ 
                fontSize: `${fontSize}rem`,
                background: `linear-gradient(45deg, #8A2BE2 0%, #FFD95A 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {genre.name}
            </Link>
          );
        })}
    </div>
  );
};

export default MangaGenreCloud;
