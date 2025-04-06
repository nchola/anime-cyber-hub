
import React from 'react';
import { Anime } from '@/types/anime';
import { Link } from 'react-router-dom';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Star } from 'lucide-react';

interface SearchSuggestionsProps {
  results: Anime[];
  query: string;
  visible: boolean;
  onItemClick: () => void;
  highlightIndex: number;
  onMouseEnter: (index: number) => void;
}

const SearchSuggestions = ({
  results,
  query,
  visible,
  onItemClick,
  highlightIndex,
  onMouseEnter
}: SearchSuggestionsProps) => {
  const isMobile = useIsMobile();
  
  if (!visible || query.length < 2) return null;

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
    <div className="absolute z-50 mt-1 w-full bg-cyber-background/95 backdrop-blur-sm border border-cyber-accent/30 rounded-md shadow-lg">
      <div className="rounded-md">
        <div className={`${isMobile ? 'max-h-[70vh]' : 'max-h-60'} overflow-auto p-0`}>
          {results.length === 0 && query.length >= 2 ? (
            <div className="py-6 text-center text-sm text-gray-400">
              No results found for "{query}"
            </div>
          ) : (
            <>
              <div className="px-3 py-2 text-xs text-gray-400 border-b border-cyber-accent/10">
                Search results for <span className="font-semibold text-cyber-accent">{query}</span>
              </div>
              {results.map((anime, index) => (
                <Link 
                  to={`/anime/${anime.mal_id}`} 
                  key={anime.mal_id}
                  onClick={onItemClick}
                >
                  {isMobile ? (
                    // Mobile view - expanded card format
                    <div
                      className={`flex p-3 cursor-pointer border-b border-cyber-accent/10 ${
                        index === highlightIndex ? 'bg-cyber-accent/10' : ''
                      }`}
                      onMouseEnter={() => onMouseEnter(index)}
                    >
                      <div className="flex-shrink-0 h-16 w-12 mr-3">
                        <img 
                          src={anime.images?.jpg?.image_url || '/placeholder.svg'} 
                          alt={anime.title} 
                          className="h-full w-full object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div 
                          className="text-sm font-medium text-white mb-1"
                          dangerouslySetInnerHTML={{ 
                            __html: highlightMatch(anime.title || '', query) 
                          }}
                        />
                        <div className="flex flex-wrap gap-1 mb-1">
                          {anime.score && (
                            <span className="text-xs bg-cyber-accent/20 text-cyber-accent px-1.5 py-0.5 rounded flex items-center">
                              <Star className="w-3 h-3 mr-0.5" /> {anime.score.toFixed(1)}
                            </span>
                          )}
                          {anime.status && (
                            <span className="text-xs bg-cyber-accent/20 text-cyber-accent px-1.5 py-0.5 rounded">
                              {anime.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {anime.synopsis || 'No synopsis available.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Desktop view - hover card
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div
                          className={`flex items-center py-2 px-3 cursor-pointer hover:bg-cyber-accent/5 ${
                            index === highlightIndex ? 'bg-cyber-accent/10' : ''
                          }`}
                          onMouseEnter={() => onMouseEnter(index)}
                        >
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img 
                              src={anime.images?.jpg?.image_url || '/placeholder.svg'} 
                              alt={anime.title} 
                              className="h-full w-full object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div 
                              className="text-sm font-medium text-white truncate"
                              dangerouslySetInnerHTML={{ 
                                __html: highlightMatch(anime.title || '', query) 
                              }}
                            />
                            <div className="text-xs text-gray-400 truncate">
                              {anime.status || 'Anime'}{anime.episodes ? `, ${anime.episodes} eps` : ''}
                            </div>
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent side="right" className="w-72 p-0 bg-cyber-background border border-cyber-accent/30 shadow-lg">
                        <div className="flex flex-col">
                          <img 
                            src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '/placeholder.svg'} 
                            alt={anime.title}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                          <div className="p-3">
                            <h4 className="font-bold text-white">{anime.title}</h4>
                            <div className="flex gap-2 mt-1 mb-2 flex-wrap">
                              {anime.score && (
                                <span className="text-xs bg-cyber-accent/20 text-cyber-accent px-2 py-0.5 rounded">
                                  ★ {anime.score}
                                </span>
                              )}
                              {anime.episodes && (
                                <span className="text-xs bg-cyber-accent/20 text-cyber-accent px-2 py-0.5 rounded">
                                  {anime.episodes} eps
                                </span>
                              )}
                              {anime.status && (
                                <span className="text-xs bg-cyber-accent/20 text-cyber-accent px-2 py-0.5 rounded">
                                  {anime.status}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-300 line-clamp-3">{anime.synopsis || 'No synopsis available.'}</p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </Link>
              ))}
              {results.length > 0 && (
                <Link 
                  to={`/search/${encodeURIComponent(query)}`}
                  className="block py-2 px-3 text-center text-xs text-cyber-accent hover:bg-cyber-accent/5 border-t border-cyber-accent/10"
                  onClick={onItemClick}
                >
                  View All Results <span className="ml-1">»</span>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestions;
