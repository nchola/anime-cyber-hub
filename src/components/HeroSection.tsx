
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Heart } from "lucide-react";
import { Anime } from "@/types/anime";
import { getCurrentSeasonAnime } from "@/services/animeService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import TrailerModal from "@/components/TrailerModal";

const HeroSection = () => {
  const [featuredAnime, setFeaturedAnime] = useState<Anime[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const { toast } = useToast();

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

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (featuredAnime.length > 0) {
        setCurrentIndex((prevIndex) => 
          prevIndex === featuredAnime.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [featuredAnime.length]);

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

  const handleWatchTrailer = () => {
    const current = featuredAnime[currentIndex];
    if (!current.trailer || !current.trailer.embed_url) {
      toast({
        title: "Trailer Tidak Tersedia",
        description: `Trailer untuk ${current.title} belum tersedia saat ini.`,
        variant: "destructive",
      });
      return;
    }
    setTrailerModalOpen(true);
  };

  if (loading) {
    return (
      <div className="w-full h-[600px] relative overflow-hidden bg-cyber-background">
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
      <div className="w-full h-[600px] relative overflow-hidden bg-cyber-background flex justify-center items-center">
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
    <div className="w-full h-[600px] relative overflow-hidden bg-cyber-background noise-bg">
      {/* Glowing border at the top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-accent to-transparent z-10 animate-pulse-accent"></div>
      
      {/* Optimized responsive image with picture element */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {current && current.images && current.images.jpg && (
          <picture>
            {/* WebP format for modern browsers */}
            <source 
              type="image/webp"
              srcSet={`
                ${current.images.jpg.large_image_url} 1280w,
                ${current.images.jpg.large_image_url} 1920w
              `}
              sizes="100vw"
            />
            {/* Fallback image */}
            <img 
              src={current.images.jpg.large_image_url}
              alt={current.title || "Featured anime"}
              className="w-full h-full object-cover object-center transition-all duration-1000 ease-in-out transform scale-110"
              style={{ filter: "brightness(0.3) contrast(1.2)" }}
              loading="eager"
              decoding="async"
            />
          </picture>
        )}
      </div>
      
      {/* Geometric patterns overlay */}
      <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGgxMnYyNEgzNnpNMTIgMThoMTJ2MjRIMTJ6TTI0IDEyaDEydjM2SDI0eiIgc3Ryb2tlPSIjRkZEOTVBIiBzdHJva2Utb3BhY2l0eT0iLjEiIHN0cm9rZS13aWR0aD0iLjUiLz48L2c+PC9zdmc+')] opacity-40"></div>
      
      {/* Diagonal lines pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,217,90,0.05)_25%,rgba(255,217,90,0.05)_50%,transparent_50%,transparent_75%,rgba(255,217,90,0.05)_75%)] bg-[length:10px_10px] opacity-30"></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
      
      {/* Scanlines effect */}
      <div className="scanlines absolute inset-0 z-10 opacity-25" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, index) => (
          <div 
            key={index} 
            className="absolute w-1 h-1 rounded-full bg-cyber-accent/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `pulse-accent ${2 + Math.random() * 3}s infinite alternate`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Animated rank badge */}
      <div className="absolute top-10 left-10 z-20 bg-cyber-purple/80 text-white px-4 py-2 rounded-md font-orbitron shadow-[0_0_15px_rgba(138,43,226,0.5)] border border-cyber-purple animate-pulse-accent">
        #{currentIndex + 1} Most Favorited Anime
      </div>
      
      {/* Content Section */}
      <div className="container mx-auto px-4 h-full relative z-20">
        <div className="flex flex-col justify-center h-full">
          <div className="max-w-3xl">
            {/* Title with glow effect */}
            <h1 className="text-5xl md:text-6xl font-orbitron font-bold mb-4 glitch-hover text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {current.title_english || current.title}
            </h1>
            
            {/* Japanese title with subtle effect */}
            <h2 className="text-xl md:text-2xl font-noto-sans opacity-70 mb-4 text-cyber-accent">
              {current.title_japanese}
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {current.genres.slice(0, 3).map((genre) => (
                <span key={genre.mal_id} className="text-xs font-medium py-1 px-3 rounded-full bg-cyber-purple/30 text-cyber-accent border border-cyber-accent/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-cyber-purple/50">
                  {genre.name}
                </span>
              ))}
              {current.score > 0 && (
                <span className="text-xs font-medium py-1 px-3 rounded-full bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30 backdrop-blur-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-cyber-accent text-cyber-accent" /> {current.score.toFixed(1)}
                </span>
              )}
              {current.favorites && current.favorites > 0 && (
                <span className="text-xs font-medium py-1 px-3 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 backdrop-blur-sm flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-pink-500 text-pink-500" /> {current.favorites.toLocaleString()}
                </span>
              )}
            </div>
            
            {/* Synopsis with glass effect */}
            <div className="backdrop-blur-md bg-black/30 border border-cyber-accent/10 rounded-lg p-4 mb-6 transition-all duration-500 hover:bg-black/40">
              <p className="text-gray-300 line-clamp-3">
                {current.synopsis || "Belum ada deskripsi tersedia untuk anime ini."}
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                onClick={handleWatchTrailer} 
                className="bg-cyber-accent text-cyber-background font-orbitron hover:bg-opacity-80 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,217,90,0.5)] transform hover:-translate-y-1"
              >
                Watch Trailer
              </Button>
              <Link to={`/anime/${current.mal_id}`}>
                <Button 
                  variant="outline" 
                  className="border-cyber-accent text-cyber-accent font-orbitron hover:bg-cyber-accent/10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,217,90,0.3)] transform hover:-translate-y-1"
                >
                  More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation arrows with improved styling */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 text-white z-20 hover:bg-black/50 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 text-white z-20 hover:bg-black/50 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      
      {/* Enhanced indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {featuredAnime.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-cyber-accent w-8 shadow-[0_0_10px_rgba(255,217,90,0.7)]" 
                : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Trailer Modal */}
      <TrailerModal 
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        embedUrl={current.trailer?.embed_url}
        title={current.title_english || current.title}
      />
    </div>
  );
};

export default HeroSection;
