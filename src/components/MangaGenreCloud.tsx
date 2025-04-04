
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMangaGenres } from "@/services/mangaService";
import { MangaGenre } from "@/types/manga";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const MangaGenreCloud = () => {
  const [genres, setGenres] = useState<MangaGenre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
    if (genres.length === 0) return 1;
    
    const minCount = Math.min(...genres.map(g => g.count));
    const maxCount = Math.max(...genres.map(g => g.count));
    const range = maxCount - minCount;
    // Protect against division by zero if all counts are the same
    const normalized = range === 0 ? 0.5 : (count - minCount) / range;
    return 0.8 + normalized * 0.8; // Font size between 0.8rem and 1.6rem
  };

  if (loading) {
    return (
      <div className="flex flex-wrap gap-3 justify-center my-8 py-4">
        {Array(16).fill(0).map((_, i) => (
          <Skeleton key={`skeleton-${i}`} className="h-8 w-24 rounded-full bg-gray-800/30" />
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
      <div className="flex flex-wrap gap-3 justify-center my-8 py-4">
        {fallbackGenres.map((genre) => (
          <Link
            to={`/genre/${genre.mal_id}`}
            key={`fallback-${genre.mal_id}`}
            className="bg-cyber-background hover:bg-cyber-accent/20 text-white hover:text-cyber-accent px-4 py-2 rounded-full border border-cyber-accent/30 transition-all hover:border-cyber-accent"
            style={{ fontSize: `${getGenreSize(genre.count)}rem` }}
          >
            {genre.name}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center my-8 py-4">
      {genres
        .sort((a, b) => b.count - a.count)
        .slice(0, 36)
        .map((genre) => {
          const fontSize = getGenreSize(genre.count);
          return (
            <Link
              to={`/genre/${genre.mal_id}`}
              key={`genre-${genre.mal_id}`}
              className="bg-cyber-background hover:bg-cyber-accent/20 text-white hover:text-cyber-accent px-4 py-2 rounded-full border border-cyber-accent/30 transition-all hover:border-cyber-accent"
              style={{ fontSize: `${fontSize}rem` }}
            >
              {genre.name}
            </Link>
          );
        })}
    </div>
  );
};

export default MangaGenreCloud;
