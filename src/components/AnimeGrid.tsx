
import React from "react";
import { Anime } from "@/types/anime";
import AnimeCard from "./AnimeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnimeGridProps {
  animeList: Anime[];
  title: string;
  loading?: boolean;
  error?: string | null;
  viewMoreLink?: string;
}

const AnimeGrid: React.FC<AnimeGridProps> = ({ 
  animeList, 
  title, 
  loading = false,
  error = null,
  viewMoreLink
}) => {
  const isMobile = useIsMobile();
  
  // Render loading skeletons
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-orbitron font-bold mb-6 text-white">
          {title}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {Array(12).fill(0).map((_, index) => (
            <div key={index} className="cyber-card">
              <Skeleton className="aspect-[3/4] w-full rounded-t-md bg-gray-800" />
              <div className="p-3">
                <Skeleton className="h-5 w-full mb-2 bg-gray-800" />
                <div className="flex gap-1">
                  <Skeleton className="h-3 w-16 bg-gray-800" />
                  <Skeleton className="h-3 w-16 bg-gray-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error || animeList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-orbitron font-bold mb-6 text-white">
          {title}
        </h2>
        <div className="bg-cyber-background/50 rounded-lg p-8 text-center border border-cyber-accent/20">
          <p className="text-xl text-cyber-accent font-orbitron">
            {error || "No anime found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-orbitron font-bold text-white">
          {title}
        </h2>
        {viewMoreLink && (
          <Link to={viewMoreLink}>
            <Button 
              variant="outline" 
              className="border-cyber-accent text-cyber-accent hover:bg-cyber-accent/10"
            >
              View More <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {animeList.map((anime, index) => (
          <AnimeCard key={anime.mal_id} anime={anime} index={index} />
        ))}
      </div>
    </div>
  );
};

export default AnimeGrid;
