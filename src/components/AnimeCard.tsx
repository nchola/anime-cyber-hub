
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Anime } from "@/types/anime";
import { Star, Clock } from "lucide-react";

interface AnimeCardProps {
  anime: Anime;
  index?: number;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  
  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  return (
    <Link 
      to={`/anime/${anime.mal_id}`}
      className="cyber-card group"
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden aspect-[3/4] rounded-t-md">
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
          <div className="absolute top-2 right-2 bg-cyber-accent/90 text-cyber-background text-xs font-bold px-2 py-1 rounded-md flex items-center">
            <Star size={12} className="mr-1" />
            {anime.score.toFixed(1)}
          </div>
        )}
        
        {/* Episodes badge */}
        {anime.episodes > 0 && (
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
            <Clock size={12} className="mr-1" />
            {anime.episodes} eps
          </div>
        )}
        
        {/* Hover info overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-cyber-background to-transparent/30 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
          <p className="text-white text-sm line-clamp-3">
            {anime.synopsis || "No synopsis available."}
          </p>
        </div>
      </div>
      
      {/* Title and info */}
      <div className="p-3">
        <h3 className="font-orbitron text-white font-medium line-clamp-1 group-hover:text-cyber-accent transition-colors">
          {anime.title_english || anime.title}
        </h3>
        
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
  );
};

export default AnimeCard;
