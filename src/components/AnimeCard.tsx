import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Anime } from "@/types/anime";
import { Star, Clock, Bookmark, BookmarkCheck, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TrailerModal from "./TrailerModal";
import { supabase } from "@/integrations/supabase/client";

interface AnimeCardProps {
  anime: Anime;
  index?: number;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const { toast } = useToast();
  
  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  // Check if this anime is bookmarked
  useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setIsBookmarked(bookmarks.includes(anime.mal_id));
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
    }
  }, [anime.mal_id]);

  // Toggle bookmark status
  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to add bookmarks",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      let newBookmarks;
      
      if (isBookmarked) {
        // Remove from bookmarks
        newBookmarks = bookmarks.filter((id: number) => id !== anime.mal_id);
        toast({
          title: "Removed from bookmarks",
          description: `${anime.title_english || anime.title} removed from your bookmarks`,
        });
      } else {
        // Add to bookmarks
        newBookmarks = [...bookmarks, anime.mal_id];
        toast({
          title: "Added to bookmarks",
          description: `${anime.title_english || anime.title} added to your bookmarks`,
        });
      }
      
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      setIsBookmarked(!isBookmarked);
      
      // Dispatch a storage event to notify other components
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error("Failed to update bookmarks:", err);
      toast({
        title: "Error",
        description: "Failed to update bookmarks",
        variant: "destructive",
      });
    }
  };

  // Open trailer modal
  const openTrailer = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (anime.trailer?.embed_url) {
      setShowTrailer(true);
    } else {
      toast({
        title: "Trailer not available",
        description: "No trailer available for this anime",
      });
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
              <button 
                onClick={toggleBookmark}
                className="bg-black/70 p-1.5 rounded-full transition-all hover:bg-cyber-accent/90 hover:text-cyber-background"
              >
                {isBookmarked ? (
                  <BookmarkCheck size={16} className="text-cyber-accent" />
                ) : (
                  <Bookmark size={16} className="text-white" />
                )}
              </button>
              
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