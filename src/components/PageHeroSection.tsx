
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Anime, Manga } from "@/types/anime";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PageHeroSectionProps {
  title: string;
  subtitle: string;
  items: Anime[] | Manga[];
  type: "anime" | "manga";
  loading?: boolean;
  error?: string | null;
}

const PageHeroSection = ({ 
  title, 
  subtitle, 
  items, 
  type,
  loading = false,
  error = null 
}: PageHeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

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

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (items.length > 1) {
        handleNext();
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [items.length]);

  if (loading) {
    return (
      <div className="w-full h-[500px] relative overflow-hidden bg-cyber-background flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="h-10 w-80 mx-auto bg-gray-800/40 animate-pulse rounded-md mb-4"></div>
          <div className="h-4 w-96 mx-auto bg-gray-800/40 animate-pulse rounded-md"></div>
        </div>
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div className="w-full h-[500px] relative overflow-hidden bg-cyber-background flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-orbitron text-cyber-accent mb-4">
            {error || `No ${type} data available`}
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
  const detailPath = type === "anime" ? `/anime/${current.mal_id}` : `/manga/${current.mal_id}`;
  
  return (
    <div className="w-full h-[500px] relative overflow-hidden bg-cyber-background noise-bg">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-accent to-transparent z-10 animate-pulse-accent"></div>
      
      <div className="absolute inset-0 z-0 overflow-hidden">
        {current && current.images && current.images.jpg && (
          <img 
            src={current.images.jpg.large_image_url}
            alt={current.title || `Featured ${type}`}
            className="w-full h-full object-cover object-center transition-all duration-1000 ease-in-out transform scale-110"
            style={{ filter: "brightness(0.3) contrast(1.2)" }}
            loading="eager"
          />
        )}
      </div>
      
      <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGgxMnYyNEgzNnpNMTIgMThoMTJ2MjRIMTJ6TTI0IDEyaDEydjM2SDI0eiIgc3Ryb2tlPSIjRkZEOTVBIiBzdHJva2Utb3BhY2l0eT0iLjEiIHN0cm9rZS13aWR0aD0iLjUiLz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      
      <div className="container mx-auto px-4 h-full relative z-20">
        <div className="flex flex-col justify-center h-full pt-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 text-white">
              {title}
            </h1>
            
            <p className="text-lg text-gray-300 mb-8">
              {subtitle}
            </p>
            
            <h2 className="text-2xl md:text-3xl font-orbitron font-bold mb-4 text-cyber-accent">
              {current.title_english || current.title}
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {current.genres && current.genres.slice(0, 3).map((genre) => (
                <span 
                  key={genre.mal_id} 
                  className="text-xs font-medium py-1 px-3 rounded-full bg-cyber-purple/30 text-cyber-accent border border-cyber-accent/30"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            
            <p className="text-gray-300 text-sm mb-6 line-clamp-3">
              {current.synopsis
                ? current.synopsis.replace(/\[Written by MAL Rewrite\]$/g, "")
                : `No description found for this ${type}.`}
            </p>
            
            <Link to={detailPath}>
              <Button 
                variant="default" 
                className="bg-cyber-accent text-cyber-background font-orbitron hover:bg-opacity-80 transition-all"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {items.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white z-20 hover:bg-black/50 backdrop-blur-sm border border-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white z-20 hover:bg-black/50 backdrop-blur-sm border border-white/10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {items.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-cyber-accent w-8" 
                    : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to item ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PageHeroSection;
