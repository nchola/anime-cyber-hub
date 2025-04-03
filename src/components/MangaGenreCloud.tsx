
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMangaGenres } from "@/services/mangaService";
import { MangaGenre } from "@/types/manga";
import { Skeleton } from "@/components/ui/skeleton";

const MangaGenreCloud = () => {
  const [genres, setGenres] = useState<MangaGenre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const response = await getMangaGenres();
        setGenres(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch manga genres:", err);
        setError("Failed to load genres");
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  // Calculate font size based on count (popularity)
  const getGenreSize = (count: number) => {
    const minCount = Math.min(...genres.map(g => g.count));
    const maxCount = Math.max(...genres.map(g => g.count));
    const range = maxCount - minCount;
    const normalized = (count - minCount) / range;
    return 0.8 + normalized * 0.8; // Font size between 0.8rem and 1.6rem
  };

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2 my-4">
        {Array(16).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 bg-gray-800 rounded-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-cyber-accent text-center py-4">{error}</div>;
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center my-4">
      {genres
        .sort((a, b) => b.count - a.count)
        .slice(0, 36)
        .map((genre) => {
          const fontSize = getGenreSize(genre.count);
          return (
            <Link
              to={`/genre/${genre.mal_id}`}
              key={genre.mal_id}
              className="text-white hover:text-cyber-accent bg-cyber-background/60 hover:bg-cyber-accent/10 border border-cyber-accent/30 rounded-full px-4 py-1 transition-all"
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
