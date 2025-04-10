import React, { useState, useEffect, useRef } from "react";
import { Anime } from "@/types/anime";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnimatedCardCarouselProps {
  items: Anime[];
  title?: string;
  subtitle?: string;
  type?: 'anime' | 'manga';
}

const AnimatedCardCarousel: React.FC<AnimatedCardCarouselProps> = ({
  items,
  title,
  subtitle,
  type = 'anime'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate how many items to show based on screen size
  const itemsToShow = isMobile ? 2 : 4;
  const totalSlides = Math.ceil(items.length / itemsToShow);
  
  useEffect(() => {
    if (!isHovered && items.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isHovered, items.length, totalSlides]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  // Get the current items to display
  const getCurrentItems = () => {
    const startIndex = currentIndex * itemsToShow;
    return items.slice(startIndex, startIndex + itemsToShow);
  };

  return (
    <div 
      className="w-full py-8 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(title || subtitle) && (
        <div className="container mx-auto px-4 mb-6 text-center">
          {title && (
            <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-cyber-accent mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-300">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="relative overflow-hidden">
        <div 
          ref={containerRef}
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${totalSlides * 100}%`
          }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div 
              key={slideIndex} 
              className="flex justify-center gap-4 px-4"
              style={{ width: `${100 / totalSlides}%` }}
            >
              {items.slice(slideIndex * itemsToShow, (slideIndex + 1) * itemsToShow).map((item, itemIndex) => (
                <Link 
                  key={item.mal_id} 
                  to={`/${type}/${item.mal_id}`}
                  className="group flex-shrink-0 w-full max-w-[250px] transition-all duration-300 hover:scale-105"
                >
                  <div className="relative overflow-hidden rounded-md border border-cyber-accent/30 bg-cyber-background/60 backdrop-blur-sm">
                    <div className="aspect-[2/3] overflow-hidden">
                      <img 
                        src={item.images?.jpg?.image_url || '/placeholder.svg'} 
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-orbitron text-sm font-bold mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      {item.score > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3 h-3 fill-cyber-accent text-cyber-accent" />
                          <span>{item.score.toFixed(1)}</span>
                        </div>
                      )}
                      {item.genres && item.genres.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.genres.slice(0, 2).map((genre) => (
                            <span key={genre.mal_id} className="text-xs bg-cyber-accent/20 text-cyber-accent px-1.5 py-0.5 rounded">
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.synopsis && (
                        <p className="mt-2 text-xs line-clamp-2 text-gray-300">
                          {item.synopsis}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
        
        {totalSlides > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white z-20 hover:bg-black/70 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white z-20 hover:bg-black/70 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-cyber-accent w-6 shadow-[0_0_10px_rgba(255,217,90,0.7)]" 
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnimatedCardCarousel; 