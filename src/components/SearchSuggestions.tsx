
import React from 'react';
import { Anime } from '@/types/anime';
import { Command } from '@/components/ui/command';
import { Link } from 'react-router-dom';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

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
  if (!visible || results.length === 0) return null;

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
    <div className="absolute z-50 mt-1 w-full bg-cyber-background border border-cyber-accent/30 rounded-md shadow-lg">
      <Command className="rounded-md">
        <Command.List className="max-h-60 overflow-auto p-0">
          {results.length === 0 && query.length > 1 ? (
            <div className="py-6 text-center text-sm text-gray-400">
              No results found for "{query}"
            </div>
          ) : (
            results.map((anime, index) => (
              <Link 
                to={`/anime/${anime.mal_id}`} 
                key={anime.mal_id}
                onClick={onItemClick}
              >
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Command.Item
                      className={`flex items-center py-2 px-3 cursor-pointer ${
                        index === highlightIndex ? 'bg-cyber-accent/10' : ''
                      }`}
                      onMouseEnter={() => onMouseEnter(index)}
                    >
                      <div className="flex-shrink-0 h-10 w-10 mr-3">
                        <img 
                          src={anime.images?.jpg?.image_url || '/placeholder.svg'} 
                          alt={anime.title} 
                          className="h-full w-full object-cover rounded"
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
                          {anime.genres?.slice(0, 3).map(g => g.name).join(', ')}
                        </div>
                      </div>
                    </Command.Item>
                  </HoverCardTrigger>
                  <HoverCardContent side="right" className="w-72 p-0 bg-cyber-background border border-cyber-accent/30">
                    <div className="flex flex-col">
                      <img 
                        src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '/placeholder.svg'} 
                        alt={anime.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="font-bold text-white">{anime.title}</h4>
                        <div className="flex gap-2 mt-1 mb-2">
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
                        </div>
                        <p className="text-xs text-gray-300 line-clamp-3">{anime.synopsis}</p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </Link>
            ))
          )}
        </Command.List>
      </Command>
    </div>
  );
};

export default SearchSuggestions;
