
import { AnimeResponse, SingleAnimeResponse } from "@/types/anime";

const BASE_URL = "https://api.jikan.moe/v4";

// Helper function to add a delay to prevent rate limiting
const delayRequest = async (ms = 1500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper function to handle rate limiting
const handleRateLimit = async (response: Response) => {
  if (response.status === 429) {
    console.log("Rate limited, waiting before retry (anime service)...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return false;
  }
  return true;
};

// Generic fetch function with retry logic
const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
  try {
    // Add delay before request to prevent rate limiting
    await delayRequest();
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const isRateLimited = await handleRateLimit(response);
      if (!isRateLimited && retries > 0) {
        console.log(`Retrying anime request... (${retries} attempts left)`);
        return fetchWithRetry(url, retries - 1);
      }
      console.error(`API error: ${response.status} ${response.statusText}`);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    // Ensure data has the expected structure to prevent "undefined" errors
    return {
      data: data.data || [],
      pagination: data.pagination || { 
        last_visible_page: 0,
        has_next_page: false,
        current_page: 0,
        items: { count: 0, total: 0, per_page: 0 }
      }
    };
  } catch (error) {
    console.error("Fetch error in anime service:", error);
    if (retries > 0) {
      console.log(`Retrying anime request... (${retries} attempts left)`);
      return fetchWithRetry(url, retries - 1);
    }
    // Return a valid empty response instead of throwing
    return {
      data: [],
      pagination: { 
        last_visible_page: 0,
        has_next_page: false,
        current_page: 0,
        items: { count: 0, total: 0, per_page: 0 }
      }
    };
  }
};

// Get top anime
export const getTopAnime = async (page = 1, limit = 12): Promise<AnimeResponse> => {
  console.log(`Fetching top anime: page=${page}, limit=${limit}`);
  return fetchWithRetry(`${BASE_URL}/top/anime?page=${page}&limit=${limit}`);
};

// Get seasonal anime
export const getSeasonalAnime = async (year = new Date().getFullYear(), season = "winter", page = 1, limit = 12): Promise<AnimeResponse> => {
  console.log(`Fetching seasonal anime: year=${year}, season=${season}, page=${page}, limit=${limit}`);
  return fetchWithRetry(`${BASE_URL}/seasons/${year}/${season}?page=${page}&limit=${limit}`);
};

// Get anime by ID
export const getAnimeById = async (id: number): Promise<SingleAnimeResponse> => {
  try {
    console.log(`Fetching anime by ID: id=${id}`);
    const result = await fetchWithRetry(`${BASE_URL}/anime/${id}`);
    console.log(`Anime fetched successfully: ${result?.data?.title}`);
    return {
      data: result.data || {}
    };
  } catch (error) {
    console.error(`Failed to fetch anime with ID ${id}:`, error);
    return {
      data: {} as any
    };
  }
};

// Search anime
export const searchAnime = async (query: string, page = 1, limit = 12): Promise<AnimeResponse> => {
  console.log(`Searching anime: query=${query}, page=${page}, limit=${limit}`);
  return fetchWithRetry(`${BASE_URL}/anime?q=${query}&page=${page}&limit=${limit}`);
};

// Get anime by genre
export const getAnimeByGenre = async (genreId: number, page = 1, limit = 12): Promise<AnimeResponse> => {
  console.log(`Fetching anime by genre: genreId=${genreId}, page=${page}, limit=${limit}`);
  return fetchWithRetry(`${BASE_URL}/anime?genres=${genreId}&page=${page}&limit=${limit}`);
};

// Get current season anime
export const getCurrentSeasonAnime = async (page = 1, limit = 12): Promise<AnimeResponse> => {
  console.log(`Fetching current season anime: page=${page}, limit=${limit}`);
  return fetchWithRetry(`${BASE_URL}/seasons/now?page=${page}&limit=${limit}`);
};

// Get upcoming anime
export const getUpcomingAnime = async (page = 1, limit = 12): Promise<AnimeResponse> => {
  console.log(`Fetching upcoming anime: page=${page}, limit=${limit}`);
  return fetchWithRetry(`${BASE_URL}/seasons/upcoming?page=${page}&limit=${limit}`);
};

// Get anime genres - UPDATED with correct endpoint and error handling
export const getAnimeGenres = async () => {
  try {
    console.log("Fetching anime genres");
    const response = await fetchWithRetry(`${BASE_URL}/genres/anime`);
    // Filter out sensitive content and return the data array directly
    if (response && response.data) {
      const filteredGenres = response.data.filter((genre: any) => genre.name !== "Hentai");
      console.log(`Anime genres fetched successfully: ${filteredGenres.length} genres`);
      return filteredGenres;
    }
    return []; // Return empty array if data is missing
  } catch (error) {
    console.error("Failed to fetch anime genres:", error);
    return []; // Return empty array on error
  }
};

// Get anime videos/trailers
export const getAnimeVideos = async (animeId: number) => {
  try {
    console.log(`Fetching anime videos: animeId=${animeId}`);
    const response = await fetchWithRetry(`${BASE_URL}/anime/${animeId}/videos`);
    console.log(`Anime videos fetched successfully: ${response?.data?.promo?.length || 0} promos`);
    return response;
  } catch (error) {
    console.error(`Failed to fetch videos for anime ID ${animeId}:`, error);
    return {
      data: {
        promo: [],
        episodes: [],
        music_videos: []
      }
    };
  }
};
