
import React from "react";
import { Link } from "react-router-dom";
import { Manga } from "@/types/manga";
import { Loader2 } from "lucide-react";

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
  if (!visible || !query || query.length < 2) return null;

  return (
    <div className="absolute mt-1 w-full bg-cyber-background border border-cyber-accent/30 rounded-md shadow-lg z-50 max-h-[450px] overflow-auto">
      {results.length === 0 ? (
        <div className="p-4 text-center text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
          <p>Searching...</p>
        </div>
      ) : (
        <>
          <div className="py-2 px-4 text-xs text-gray-400 border-b border-cyber-accent/20">
            Found {results.length} manga
          </div>
          <ul>
            {results.map((manga, index) => (
              <li key={manga.mal_id}>
                <Link
                  to={`/manga/${manga.mal_id}`}
                  className={`flex items-center p-2 hover:bg-cyber-accent/10 ${
                    highlightIndex === index ? "bg-cyber-accent/10" : ""
                  }`}
                  onClick={onItemClick}
                  onMouseEnter={() => onMouseEnter(index)}
                >
                  <img
                    src={manga.images.jpg.small_image_url || "/placeholder.svg"}
                    alt={manga.title}
                    className="h-12 w-9 object-cover rounded mr-3"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div>
                    <h4 className="text-sm text-white line-clamp-1">{manga.title}</h4>
                    <p className="text-xs text-gray-400">
                      {manga.type} • {manga.chapters || "?"} chapters
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
              View all results for "{query}"
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default MangaSearchSuggestions;
