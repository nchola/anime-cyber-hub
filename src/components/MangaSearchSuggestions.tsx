
import React from "react";
import { Link } from "react-router-dom";
import { Manga } from "@/types/manga";
import { Loader2, Star, BookOpen, Calendar, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MangaSearchSuggestionsProps {
  results: Manga[];
  query: string;
  visible: boolean;
  onItemClick: () => void;
  highlightIndex: number;
  onMouseEnter: (index: number) => void;
}

const MangaSearchSuggestions: React.FC<MangaSearchSuggestionsProps> = ({
  results,
  query,
  visible,
  onItemClick,
  highlightIndex,
  onMouseEnter
}) => {
  const isMobile = useIsMobile();
  
  if (!visible || !query || query.length < 2) return null;

  // Highlight matching text in title
  const highlightMatch = (text: string, query: string) => {
    if (!query || !text) return text;
    
    try {
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<span class="text-cyber-accent font-semibold">$1</span>');
    } catch (e) {
      // If regex fails (e.g., with special characters), return the original text
      return text;
    }
  };

  return (
    <div className="absolute mt-1 w-full bg-cyber-background/95 backdrop-blur-sm border border-cyber-accent/30 rounded-md shadow-lg z-50">
      <div className={`${isMobile ? 'max-h-[70vh]' : 'max-h-[450px]'} overflow-auto`}>
        {results.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
            <p>Searching...</p>
          </div>
        ) : (
          <>
            <div className="py-2 px-4 text-xs text-gray-400 border-b border-cyber-accent/20">
              Found {results.length} manga for <span className="font-semibold text-cyber-accent">{query}</span>
            </div>
            <ul>
              {results.map((manga, index) => (
                <li key={manga.mal_id}>
                  <Link
                    to={`/manga/${manga.mal_id}`}
                    className={`flex p-3 cursor-pointer hover:bg-cyber-accent/10 border-b border-cyber-accent/10 ${
                      highlightIndex === index ? "bg-cyber-accent/10" : ""
                    }`}
                    onClick={onItemClick}
                    onMouseEnter={() => onMouseEnter(index)}
                  >
                    <img
                      src={manga.images.jpg.small_image_url || "/placeholder.svg"}
                      alt={manga.title}
                      className={`object-cover rounded mr-3 ${isMobile ? 'h-24 w-16' : 'h-14 w-10'}`}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="text-sm text-white mb-1.5"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightMatch(manga.title || '', query) 
                        }}
                      />
                      
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {manga.score && (
                          <span className="text-xs bg-cyber-accent/20 text-cyber-accent px-1.5 py-0.5 rounded flex items-center">
                            <Star className="w-3 h-3 mr-0.5" /> {manga.score.toFixed(1)}
                          </span>
                        )}
                        {manga.type && (
                          <span className="text-xs bg-cyber-accent/20 text-cyber-accent px-1.5 py-0.5 rounded">
                            {manga.type}
                          </span>
                        )}
                        {manga.chapters && (
                          <span className="text-xs bg-cyber-purple/20 text-cyber-accent px-1.5 py-0.5 rounded flex items-center">
                            <BookOpen className="w-3 h-3 mr-0.5" /> {manga.chapters} ch
                          </span>
                        )}
                        {manga.published?.from && (
                          <span className="text-xs bg-cyber-purple/20 text-cyber-accent px-1.5 py-0.5 rounded flex items-center">
                            <Calendar className="w-3 h-3 mr-0.5" /> {new Date(manga.published.from).getFullYear()}
                          </span>
                        )}
                        {manga.members && (
                          <span className="text-xs bg-cyber-purple/20 text-cyber-accent px-1.5 py-0.5 rounded flex items-center">
                            <Users className="w-3 h-3 mr-0.5" /> {(manga.members > 999) ? `${(manga.members/1000).toFixed(1)}k` : manga.members}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {manga.synopsis || 'No synopsis available.'}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-2 border-t border-cyber-accent/20">
              <Link
                to={`/search/manga/${encodeURIComponent(query)}`}
                className="block text-center text-xs text-cyber-accent py-1 hover:underline"
                onClick={onItemClick}
              >
                View all results for "{query}" »
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MangaSearchSuggestions;
