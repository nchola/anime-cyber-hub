import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Anime } from "@/types/anime";
import { Star, Clock, Play } from "lucide-react";
import TrailerModal from "./TrailerModal";
import BookmarkButton from "./BookmarkButton";

interface AnimeCardProps {
  anime: Anime;
  index?: number;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  
  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  // Open trailer modal
  const openTrailer = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (anime.trailer?.embed_url) {
      setShowTrailer(true);
    }
  };

  // Get title font size class based on title length
  const getTitleFontSizeClass = () => {
    const title = anime.title_english || anime.title;
    if (title.length > 40) {
      return "text-[10px]"; // Extra extra small for very very long titles
    } else if (title.length > 30) {
      return "text-[10px]"; // Extra small for very long titles
    } else if (title.length > 20) {
      return "text-[11px]"; // Small for long titles
    } else {
      return "text-[12px]"; // Default size for normal titles
    }
  };

  return (
    <>
      <div 
        className="cyber-card group relative"
        style={{ animationDelay: `${index * 0.05}s` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link to={`/anime/${anime.mal_id}`}>
          <div className="relative overflow-hidden aspect-[3/4] rounded-t-md">
            {/* Action buttons */}
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
              {/* Bookmark button */}
              <BookmarkButton
                itemId={anime.mal_id}
                itemType="anime"
                itemData={anime}
                variant="icon"
                size="sm"
              />
              
              {/* Play trailer button (only show if trailer exists) */}
              {anime.trailer?.youtube_id && (
                <button 
                  onClick={openTrailer}
                  className="bg-black/70 p-1.5 rounded-full transition-all hover:bg-cyber-accent/90 hover:text-cyber-background"
                >
                  <Play size={16} className="text-white" />
                </button>
              )}
            </div>
            
            {/* Image */}
            <img 
              src={anime.images.jpg.large_image_url} 
              alt={anime.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
            />
            
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-t from-cyber-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            {/* Score badge */}
            {anime.score > 0 && (
              <div className="absolute top-2 left-2 bg-cyber-accent/90 text-cyber-background text-xs font-bold px-2 py-1 rounded-md flex items-center">
                <Star size={12} className="mr-1" />
                {anime.score.toFixed(1)}
              </div>
            )}
            
            {/* Episodes badge */}
            {anime.episodes > 0 && (
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                <Clock size={12} className="mr-1" />
                {anime.episodes} eps
              </div>
            )}
            
            {/* Hover info overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-cyber-background to-transparent/30 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
              <p className="text-white text-xs line-clamp-6">
                {anime.synopsis || "No synopsis available."}
              </p>
            </div>
          </div>
          
          {/* Title and info */}
          <div className="p-3">
            {/* Dynamic font size based on title length */}
            <div className="min-h-[32px] flex items-center">
              <h3 
                className={`font-orbitron text-white font-light ${getTitleFontSizeClass()} line-clamp-2 group-hover:text-cyber-accent transition-colors`}
                title={anime.title_english || anime.title}
              >
                {anime.title_english || anime.title}
              </h3>
            </div>
            
            {/* Genres */}
            <div className="mt-2 flex flex-wrap gap-1">
              {anime.genres.slice(0, 2).map((genre) => (
                <span 
                  key={genre.mal_id}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-cyber-purple/30 to-cyber-background border border-cyber-accent/20 text-gray-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </Link>
      </div>

      {/* Trailer Modal */}
      <TrailerModal 
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        embedUrl={anime.trailer?.embed_url}
        title={`${anime.title_english || anime.title} Trailer`}
      />
    </>
  );
};

export default AnimeCard;