
import { Anime, AnimeResponse } from "@/types/anime";
import Fuse from 'fuse.js';

// Cache for search results
const searchCache: Record<string, { data: Anime[], timestamp: number }> = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

// Fuzzy search configuration
const fuseOptions = {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'title_english', weight: 2 },
    { name: 'title_japanese', weight: 1 },
    'genres.name',
    'synopsis'
  ],
  threshold: 0.3,
  includeScore: true,
  useExtendedSearch: true,
};

let fuse: Fuse<Anime> | null = null;
let animeList: Anime[] = [];

// Build or get the search index
export const getSearchIndex = async (): Promise<Fuse<Anime>> => {
  if (fuse) return fuse;
  
  try {
    // Try to get data from localStorage
    const cachedData = localStorage.getItem('animeSearchIndex');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        animeList = parsed.data;
        fuse = new Fuse(animeList, fuseOptions);
        return fuse;
      }
    }
    
    // If no valid cache, fetch from API
    const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=100');
    if (!response.ok) throw new Error('Failed to fetch anime data for search index');
    
    const data: AnimeResponse = await response.json();
    animeList = data.data;
    
    // Save to localStorage
    localStorage.setItem('animeSearchIndex', JSON.stringify({
      data: animeList,
      timestamp: Date.now()
    }));
    
    // Create Fuse instance
    fuse = new Fuse(animeList, fuseOptions);
    return fuse;
  } catch (error) {
    console.error('Error building search index:', error);
    // Fallback to empty index if failed
    fuse = new Fuse([], fuseOptions);
    return fuse;
  }
};

// Get search suggestions with debounce and caching
export const getSearchSuggestions = async (query: string, limit = 5): Promise<Anime[]> => {
  if (!query || query.length < 2) return [];
  
  // Check cache first
  const cacheKey = `suggestions:${query}:${limit}`;
  if (searchCache[cacheKey] && Date.now() - searchCache[cacheKey].timestamp < CACHE_TTL) {
    return searchCache[cacheKey].data;
  }
  
  try {
    const searchIndex = await getSearchIndex();
    const results = searchIndex.search(query, { limit });
    
    // Transform results format
    const suggestions = results.map(result => result.item);
    
    // Cache the results
    searchCache[cacheKey] = {
      data: suggestions,
      timestamp: Date.now()
    };
    
    return suggestions;
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return [];
  }
};

// Real API search (for when user submits the search)
export const searchAnimeRealtime = async (query: string): Promise<Anime[]> => {
  if (!query) return [];
  
  // For short queries, try local fuzzy search first
  if (query.length < 5) {
    const searchIndex = await getSearchIndex();
    const results = searchIndex.search(query, { limit: 24 });
    if (results.length > 0) {
      return results.map(result => result.item);
    }
  }
  
  // Fallback to API search
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=24`);
    if (!response.ok) throw new Error('Failed to fetch anime search results');
    
    const data: AnimeResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
};
