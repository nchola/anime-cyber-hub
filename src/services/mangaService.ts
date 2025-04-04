
import { Manga, MangaGenresResponse } from "@/types/manga";

const BASE_URL = "https://api.jikan.moe/v4";

// Helper function to add a delay to prevent rate limiting
const delayRequest = async (ms = 1500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper function to handle rate limiting
const handleRateLimit = async (response: Response) => {
  if (response.status === 429) {
    console.log("Rate limited, waiting before retry (manga service)...");
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
        console.log(`Retrying manga request... (${retries} attempts left)`);
        return fetchWithRetry(url, retries - 1);
      }
      console.error(`API error: ${response.status} ${response.statusText}`);
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Fetch error in manga service:", error);
    if (retries > 0) {
      console.log(`Retrying manga request... (${retries} attempts left)`);
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

export const getTopManga = async (page = 1, limit = 12) => {
  try {
    console.log(`Fetching top manga: page=${page}, limit=${limit}`);
    
    const data = await fetchWithRetry(
      `${BASE_URL}/top/manga?page=${page}&limit=${limit}`
    );
    
    console.log(`Top manga fetched successfully: ${data?.data?.length} items`);
    return data;
  } catch (error) {
    console.error("Error fetching top manga:", error);
    throw error;
  }
};

export const getMangaById = async (id: number) => {
  try {
    console.log(`Fetching manga details: id=${id}`);
    
    const data = await fetchWithRetry(`${BASE_URL}/manga/${id}/full`);
    
    console.log(`Manga details fetched successfully: ${data?.data?.title}`);
    return data;
  } catch (error) {
    console.error("Error fetching manga details:", error);
    throw error;
  }
};

export const getMangaGenres = async (): Promise<MangaGenresResponse> => {
  try {
    console.log("Fetching manga genres");
    
    const data = await fetchWithRetry(`${BASE_URL}/genres/manga`);
    
    console.log(`Manga genres fetched successfully: ${data?.data?.length} genres`);
    return data;
  } catch (error) {
    console.error("Error fetching manga genres:", error);
    throw error;
  }
};

export const getMangaByGenre = async (genreId: number, page = 1, limit = 12) => {
  try {
    console.log(`Fetching manga by genre: genreId=${genreId}, page=${page}, limit=${limit}`);
    
    const data = await fetchWithRetry(
      `${BASE_URL}/manga?genres=${genreId}&page=${page}&limit=${limit}`
    );
    
    console.log(`Manga by genre fetched successfully: ${data?.data?.length} items`);
    return data;
  } catch (error) {
    console.error("Error fetching manga by genre:", error);
    throw error;
  }
};

export const searchManga = async (query: string, page = 1, limit = 12) => {
  try {
    console.log(`Searching manga: query=${query}, page=${page}, limit=${limit}`);
    
    const data = await fetchWithRetry(
      `${BASE_URL}/manga?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    
    console.log(`Manga search results: ${data?.data?.length} items`);
    return data;
  } catch (error) {
    console.error("Error searching manga:", error);
    throw error;
  }
};

export const getRecentManga = async (page = 1, limit = 12) => {
  try {
    console.log(`Fetching recent manga: page=${page}, limit=${limit}`);
    
    const data = await fetchWithRetry(
      `${BASE_URL}/manga?order_by=start_date&sort=desc&page=${page}&limit=${limit}`
    );
    
    console.log(`Recent manga fetched successfully: ${data?.data?.length} items`);
    return data;
  } catch (error) {
    console.error("Error fetching recent manga:", error);
    throw error;
  }
};

export const getMangaImages = async (mangaId: number) => {
  try {
    console.log(`Fetching manga images: mangaId=${mangaId}`);
    
    const data = await fetchWithRetry(`${BASE_URL}/manga/${mangaId}/pictures`);
    
    console.log(`Manga images fetched successfully: ${data?.data?.length} images`);
    return data;
  } catch (error) {
    console.error("Error fetching manga images:", error);
    throw error;
  }
};

export const getPopularMangaByGenre = async (genreId: number, limit = 6) => {
  try {
    console.log(`Fetching popular manga by genre: genreId=${genreId}, limit=${limit}`);
    
    const data = await fetchWithRetry(
      `${BASE_URL}/manga?genres=${genreId}&order_by=popularity&sort=asc&limit=${limit}`
    );
    
    console.log(`Popular manga by genre fetched successfully: ${data?.data?.length} items`);
    return data;
  } catch (error) {
    console.error("Error fetching popular manga by genre:", error);
    throw error;
  }
};

export const getMangaSuggestions = async (query: string, limit = 5) => {
  try {
    console.log(`Fetching manga suggestions: query=${query}, limit=${limit}`);
    
    const data = await fetchWithRetry(
      `${BASE_URL}/manga?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    
    console.log(`Manga suggestions fetched successfully: ${data?.data?.length} items`);
    return data;
  } catch (error) {
    console.error("Error fetching manga suggestions:", error);
    return { data: [] };
  }
};
