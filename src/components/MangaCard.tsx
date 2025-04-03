
import React from "react";
import { Link } from "react-router-dom";
import { Manga } from "@/types/manga";
import { Book } from "lucide-react";

interface MangaCardProps {
  manga: Manga;
}

const MangaCard: React.FC<MangaCardProps> = ({ manga }) => {
  return (
    <Link 
      to={`/manga/${manga.mal_id}`}
      className="cyber-card group relative h-full transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg"
    >
      <div className="relative">
        {/* Image with gradient overlay */}
        <div className="aspect-[3/4] rounded-t overflow-hidden">
          <img 
            src={manga.images.jpg.large_image_url || '/placeholder.svg'} 
            alt={manga.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-background via-transparent to-transparent"></div>
        </div>
        
        {/* Score Badge */}
        {manga.score > 0 && (
          <div className="absolute top-2 right-2 bg-cyber-accent text-cyber-background text-xs font-bold px-2 py-1 rounded">
            ★ {manga.score.toFixed(1)}
          </div>
        )}
        
        {/* Status and Chapters Badge */}
        <div className="absolute top-2 left-2 flex gap-2">
          <div className="bg-cyber-background/80 text-cyber-accent text-xs font-bold px-2 py-1 rounded border border-cyber-accent/30">
            {manga.status}
          </div>
          {manga.chapters && (
            <div className="bg-cyber-background/80 text-white text-xs px-2 py-1 rounded border border-cyber-accent/30 flex items-center gap-1">
              <Book className="h-3 w-3" />
              {manga.chapters}
            </div>
          )}
        </div>
      </div>
      
      {/* Info Section */}
      <div className="p-4 bg-cyber-background">
        <h3 className="text-white font-medium line-clamp-2 mb-1 group-hover:text-cyber-accent transition-colors">
          {manga.title_english || manga.title}
        </h3>
        
        {/* Genre Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {manga.genres.slice(0, 2).map((genre) => (
            <span 
              key={genre.mal_id}
              className="text-xs text-gray-300 bg-cyber-background/80 border border-cyber-accent/20 px-2 py-0.5 rounded"
            >
              {genre.name}
            </span>
          ))}
        </div>
      </div>
      
      {/* Cyber Corner effect */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyber-accent"></div>
      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyber-accent"></div>
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyber-accent"></div>
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyber-accent"></div>
    </Link>
  );
};

export default MangaCard;
