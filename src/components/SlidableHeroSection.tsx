
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Heart } from "lucide-react";
import { Anime } from "@/types/anime";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface SlidableHeroSectionProps {
  title: string;
  subtitle?: string;
  items: Anime[];
  loading: boolean;
  error: string | null;
}

const SlidableHeroSection: React.FC<SlidableHeroSectionProps> = ({
  title,
  subtitle,
  items,
  loading,
  error,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (items.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
      }, 6000);
      
      return () => clearInterval(interval);
    }
  }, [items.length]);

  // Ensure hero section takes full height of viewport
  useEffect(() => {
    const adjustHeight = () => {
      if (sectionRef.current) {
        sectionRef.current.style.minHeight = `${window.innerHeight}px`;
      }
    };

    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    
    return () => {
      window.removeEventListener('resize', adjustHeight);
    };
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Loading state
  if (loading) {
    return (
      <div ref={sectionRef} className="w-full min-h-screen relative overflow-hidden bg-cyber-background">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center">
          <Skeleton className="h-12 w-3/4 max-w-md mb-4 bg-gray-800" />
          <Skeleton className="h-6 w-1/2 max-w-xs mb-8 bg-gray-800" />
          <div className="flex space-x-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-28 rounded-md bg-gray-800" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || items.length === 0) {
    return (
      <div ref={sectionRef} className="w-full min-h-screen relative overflow-hidden bg-cyber-background flex justify-center items-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-cyber-accent mb-4" />
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

  const current = items[currentIndex];

  return (
    <div 
      ref={sectionRef}
      className="w-full min-h-screen relative overflow-hidden bg-cyber-background noise-bg"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-accent to-transparent z-10 animate-pulse-accent"></div>
      
      {/* Background image with improved positioning */}
      <div className="absolute inset-0 z-0">
        {current && current.images && current.images.jpg && (
          <div 
            className="absolute inset-0 w-full h-full"
            style={{ 
              backgroundImage: `url(${current.images.jpg.large_image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: "brightness(0.5)",
            }}
          />
        )}
      </div>
      
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      
      <div className="container mx-auto px-4 h-full relative z-20">
        <div className="flex flex-col justify-center h-full">
          <div className={`max-w-3xl mx-auto text-center ${isMobile ? 'transform scale-80' : ''}`}>
            <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 text-cyber-accent">
              {title}
            </h1>
            
            {subtitle && (
              <p className="text-lg text-gray-300 mb-8">
                {subtitle}
              </p>
            )}
            
            <div className="max-w-2xl mx-auto mb-8">
              {/* Improved title styling */}
              <h2 className="text-2xl font-orbitron mb-2 text-white">
                {current.title_english || current.title}
              </h2>
              
              <div className="flex flex-wrap justify-center gap-2 mb-4 mt-3">
                {current.genres && current.genres.length > 0 && current.genres.slice(0, 3).map((genre) => (
                  <span key={genre.mal_id} className="text-xs font-medium py-1 px-3 rounded-full bg-cyber-purple/30 text-cyber-accent border border-cyber-accent/30">
                    {genre.name}
                  </span>
                ))}
                {current.score > 0 && (
                  <span className="text-xs font-medium py-1 px-3 rounded-full bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-cyber-accent text-cyber-accent" /> {current.score.toFixed(1)}
                  </span>
                )}
              </div>
              
              <div className="backdrop-blur-md bg-black/30 border border-cyber-accent/10 p-4 mb-6 rounded-md">
                <p className="text-gray-300 text-sm font-thin line-clamp-3">
                  {current.synopsis
                    ? current.synopsis.replace(/\[Written by MAL Rewrite\]$/g, "")
                    : "No description found for this anime series."}
                </p>
              </div>
              
              <Link to={`/anime/${current.mal_id}`}>
                <Button 
                  className="bg-cyber-accent text-cyber-background font-orbitron hover:bg-opacity-80"
                >
                  View Details
                </Button>
              </Link>
            </div>
            
            <div className="flex justify-center space-x-2 mt-6">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-cyber-accent w-6" 
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {items.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white z-20 hover:bg-black/50 backdrop-blur-sm border border-white/10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white z-20 hover:bg-black/50 backdrop-blur-sm border border-white/10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};

export default SlidableHeroSection;
