
import { AnimeResponse, SingleAnimeResponse } from "@/types/anime";

const BASE_URL = "https://api.jikan.moe/v4";

// Helper function to handle rate limiting
const handleRateLimit = async (response: Response) => {
  if (response.status === 429) {
    console.log("Rate limited, waiting before retry...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return false;
  }
  return true;
};

// Generic fetch function with retry logic
const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const isRateLimited = await handleRateLimit(response);
      if (!isRateLimited && retries > 0) {
        return fetchWithRetry(url, retries - 1);
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    if (retries > 0) {
      console.log(`Retrying... (${retries} left)`);
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
};

// Get top anime
export const getTopAnime = async (page = 1, limit = 12): Promise<AnimeResponse> => {
  return fetchWithRetry(`${BASE_URL}/top/anime?page=${page}&limit=${limit}`);
};

// Get seasonal anime
export const getSeasonalAnime = async (year = new Date().getFullYear(), season = "winter", page = 1, limit = 12): Promise<AnimeResponse> => {
  return fetchWithRetry(`${BASE_URL}/seasons/${year}/${season}?page=${page}&limit=${limit}`);
};

// Get anime by ID
export const getAnimeById = async (id: number): Promise<SingleAnimeResponse> => {
  return fetchWithRetry(`${BASE_URL}/anime/${id}`);
};

// Search anime
export const searchAnime = async (query: string, page = 1, limit = 12): Promise<AnimeResponse> => {
  return fetchWithRetry(`${BASE_URL}/anime?q=${query}&page=${page}&limit=${limit}`);
};

// Get anime by genre
export const getAnimeByGenre = async (genreId: number, page = 1, limit = 12): Promise<AnimeResponse> => {
  return fetchWithRetry(`${BASE_URL}/anime?genres=${genreId}&page=${page}&limit=${limit}`);
};

// Get current season anime
export const getCurrentSeasonAnime = async (page = 1, limit = 12): Promise<AnimeResponse> => {
  return fetchWithRetry(`${BASE_URL}/seasons/now?page=${page}&limit=${limit}`);
};

// Get upcoming anime
export const getUpcomingAnime = async (page = 1, limit = 12): Promise<AnimeResponse> => {
  return fetchWithRetry(`${BASE_URL}/seasons/upcoming?page=${page}&limit=${limit}`);
};
