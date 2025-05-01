import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Manga } from "@/types/manga";
import { Star, Book } from "lucide-react";
import BookmarkButton from "./BookmarkButton";

interface MangaCardProps {
  manga: Manga;
  index?: number;
}

const MangaCard: React.FC<MangaCardProps> = ({ manga, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  
  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  // Get title font size class based on title length
  const getTitleFontSizeClass = () => {
    const title = manga.title_english || manga.title;
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
    <div 
      className="cyber-card group relative"
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/manga/${manga.mal_id}`}>
        <div className="relative overflow-hidden aspect-[3/4] rounded-t-md">
          {/* Action buttons */}
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
            {/* Bookmark button */}
            <BookmarkButton
              itemId={manga.mal_id}
              itemType="manga"
              itemData={manga}
              variant="icon"
              size="sm"
            />
          </div>
          
          {/* Image */}
          <img 
            src={manga.images.jpg.large_image_url} 
            alt={manga.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
          />
          
          {/* Gradient overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-cyber-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          
          {/* Score badge */}
          {manga.score > 0 && (
            <div className="absolute top-2 left-2 bg-cyber-accent/90 text-cyber-background text-xs font-bold px-2 py-1 rounded-md flex items-center">
              <Star size={12} className="mr-1" />
              {manga.score.toFixed(1)}
            </div>
          )}
          
          {/* Type badge */}
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
            <Book size={12} className="mr-1" />
            {manga.type}
          </div>
          
          {/* Hover info overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-cyber-background to-transparent/30 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
            <p className="text-white text-xs line-clamp-6">
              {manga.synopsis || "No synopsis available."}
            </p>
          </div>
        </div>
        
        {/* Title and info */}
        <div className="p-3">
          {/* Dynamic font size based on title length */}
          <div className="min-h-[32px] flex items-center">
            <h3 
              className={`font-orbitron text-white font-light ${getTitleFontSizeClass()} line-clamp-2 group-hover:text-cyber-accent transition-colors`}
              title={manga.title_english || manga.title}
            >
              {manga.title_english || manga.title}
            </h3>
          </div>
          
          {/* Genres */}
          <div className="mt-2 flex flex-wrap gap-1">
            {manga.genres.slice(0, 2).map((genre) => (
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
  );
};

export default MangaCard;
