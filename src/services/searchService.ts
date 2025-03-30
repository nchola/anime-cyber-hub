
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
  includeScore: true
};

let fuse: Fuse<Anime> | null = null;
let animeList: Anime[] = [];

// Build or get the search index
export const getSearchIndex = async (): Promise<Fuse<Anime>> => {
  if (fuse && animeList.length > 0) return fuse;
  
  try {
    // Try to get data from localStorage
    const cachedData = localStorage.getItem('animeSearchIndex');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      if (Date.now() - parsed.timestamp < CACHE_TTL && parsed.data && parsed.data.length > 0) {
        animeList = parsed.data;
        fuse = new Fuse(animeList, fuseOptions);
        return fuse;
      }
    }
    
    // If no valid cache, fetch from API
    console.log("Fetching fresh anime data for search index");
    const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=100');
    if (!response.ok) throw new Error('Failed to fetch anime data for search index');
    
    const data: AnimeResponse = await response.json();
    
    // Ensure data exists and is an array
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('Invalid data structure received from API');
    }
    
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
    
    // If we have any data in animeList, use it as fallback
    if (animeList.length === 0) {
      // Fetch directly from API as last resort
      try {
        const fallbackResponse = await fetch('https://api.jikan.moe/v4/anime?q=popular&limit=20');
        if (fallbackResponse.ok) {
          const fallbackData: AnimeResponse = await fallbackResponse.json();
          if (fallbackData.data && Array.isArray(fallbackData.data)) {
            animeList = fallbackData.data;
          }
        }
      } catch (fallbackError) {
        console.error('Fallback fetch also failed:', fallbackError);
      }
    }
    
    // Create Fuse instance with whatever data we have
    fuse = new Fuse(animeList, fuseOptions);
    return fuse;
  }
};

// Get search suggestions with debounce and caching
export const getSearchSuggestions = async (query: string, limit = 5): Promise<Anime[]> => {
  if (!query || query.length < 2) return [];
  
  // Check cache first
  const cacheKey = `suggestions:${query}:${limit}`;
  if (searchCache[cacheKey] && Date.now() - searchCache[cacheKey].timestamp < CACHE_TTL) {
    console.log("Using cached search results for:", query);
    return searchCache[cacheKey].data;
  }
  
  try {
    // Ensure we have a valid search index
    const searchIndex = await getSearchIndex();
    
    if (!searchIndex) {
      console.error("Failed to get search index");
      return [];
    }
    
    console.log("Searching for:", query, "with index size:", animeList.length);
    
    // Use direct API search for better results
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const data: AnimeResponse = await response.json();
    const apiResults = data.data || [];
    
    // Cache the results
    searchCache[cacheKey] = {
      data: apiResults,
      timestamp: Date.now()
    };
    
    return apiResults;
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    
    // Fallback to local search if API fails
    try {
      if (fuse && animeList.length > 0) {
        console.log("Falling back to local fuzzy search");
        const results = fuse.search(query, { limit });
        return results.map(result => result.item);
      }
    } catch (fallbackError) {
      console.error("Local fuzzy search also failed:", fallbackError);
    }
    
    return [];
  }
};

// Real API search (for when user submits the search)
export const searchAnimeRealtime = async (query: string): Promise<Anime[]> => {
  if (!query) return [];
  
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=24`);
    if (!response.ok) throw new Error('Failed to fetch anime search results');
    
    const data: AnimeResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
};
