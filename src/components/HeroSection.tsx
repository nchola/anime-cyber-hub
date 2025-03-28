
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Anime } from "@/types/anime";
import { getCurrentSeasonAnime } from "@/services/animeService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const HeroSection = () => {
  const [featuredAnime, setFeaturedAnime] = useState<Anime[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedAnime = async () => {
      try {
        setLoading(true);
        const response = await getCurrentSeasonAnime(1, 5);
        setFeaturedAnime(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch featured anime:", err);
        setError("Failed to load featured anime");
        setLoading(false);
      }
    };

    fetchFeaturedAnime();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredAnime.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === featuredAnime.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return (
      <div className="w-full h-[500px] relative overflow-hidden bg-cyber-background">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="w-full max-w-3xl">
            <Skeleton className="h-12 w-3/4 mb-4 bg-gray-800" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
            <Skeleton className="h-4 w-2/3 mb-6 bg-gray-800" />
            <Skeleton className="h-10 w-32 bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  if (error || featuredAnime.length === 0) {
    return (
      <div className="w-full h-[500px] relative overflow-hidden bg-cyber-background flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-orbitron text-cyber-accent mb-4">
            {error || "No featured anime available"}
          </h2>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-cyber-accent text-cyber-background"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const current = featuredAnime[currentIndex];
  
  return (
    <div className="w-full h-[500px] relative overflow-hidden bg-cyber-background noise-bg">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-30 bg-cover bg-center blur-sm scale-105"
        style={{ 
          backgroundImage: `url(${current.images.jpg.large_image_url})`,
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 bg-cyber-gradient opacity-70" />
      
      {/* Scanlines effect */}
      <div className="scanlines absolute inset-0 z-10" />
      
      <div className="container mx-auto px-4 h-full relative z-20">
        <div className="flex flex-col justify-center h-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 glitch-hover text-white">
              {current.title_english || current.title}
            </h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {current.genres.slice(0, 3).map((genre) => (
                <span key={genre.mal_id} className="text-xs font-medium py-1 px-3 rounded-full bg-cyber-purple/30 text-cyber-accent border border-cyber-accent/30">
                  {genre.name}
                </span>
              ))}
              {current.score > 0 && (
                <span className="text-xs font-medium py-1 px-3 rounded-full bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30">
                  ★ {current.score.toFixed(1)}
                </span>
              )}
            </div>
            
            <p className="text-gray-300 mb-6 line-clamp-3">
              {current.synopsis}
            </p>
            
            <div className="flex space-x-4">
              <Button className="bg-cyber-accent text-cyber-background font-orbitron hover:bg-opacity-80 transition-colors">
                Watch Trailer
              </Button>
              <Button variant="outline" className="border-cyber-accent text-cyber-accent font-orbitron hover:bg-cyber-accent/10 transition-colors">
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation arrows */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white z-20 hover:bg-black/50"
      >
        <ChevronLeft />
      </button>
      
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white z-20 hover:bg-black/50"
      >
        <ChevronRight />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {featuredAnime.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-cyber-accent" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
