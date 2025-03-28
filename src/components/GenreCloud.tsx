
import React, { useState, useEffect } from "react";
import { getAnimeGenres } from "@/services/animeService";
import { Genre } from "@/types/anime";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const GenreCloud: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const genreData = await getAnimeGenres();
        setGenres(genreData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
        setError("Failed to load genres");
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load genres",
          variant: "destructive",
        });
      }
    };

    fetchGenres();
  }, [toast]);

  // Calculate font size based on genre popularity
  const calculateFontSize = (count: number) => {
    const min = Math.min(...genres.map(g => g.count || 0));
    const max = Math.max(...genres.map(g => g.count || 0));
    const normalized = (count - min) / (max - min);
    return 0.8 + normalized * 1.2; // Font size between 0.8rem and 2rem
  };

  const handleGenreClick = (genreId: number, genreName: string) => {
    toast({
      title: "Genre Selected",
      description: `Viewing anime in ${genreName} category`,
    });
    navigate(`/genre/${genreId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2 justify-center my-6">
        {Array(20).fill(0).map((_, i) => (
          <div 
            key={i} 
            className="h-8 bg-cyber-background/80 rounded-full animate-pulse"
            style={{ width: `${Math.random() * 80 + 40}px` }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-6 text-cyber-accent">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center my-6 px-4">
      {genres.map((genre) => (
        <button 
          key={genre.mal_id}
          onClick={() => handleGenreClick(genre.mal_id, genre.name)}
          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-cyber-purple/40 to-cyber-accent/20 border border-cyber-accent/30 text-white hover:scale-105 hover:shadow-glow transition-all duration-300"
          style={{ 
            fontSize: `${calculateFontSize(genre.count || 100)}rem`,
            background: `linear-gradient(45deg, #8A2BE2 0%, #FFD95A 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreCloud;
