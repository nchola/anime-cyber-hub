
import { Manga, MangaGenresResponse } from "@/types/manga";

const BASE_URL = "https://api.jikan.moe/v4";

// Helper function to add a delay to prevent rate limiting
const delayRequest = async (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getTopManga = async (page = 1, limit = 12) => {
  try {
    console.log(`Fetching top manga: page=${page}, limit=${limit}`);
    await delayRequest();
    
    const response = await fetch(
      `${BASE_URL}/top/manga?page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      console.error(`Error response from API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch top manga');
    }
    
    const data = await response.json();
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
    await delayRequest();
    
    const response = await fetch(`${BASE_URL}/manga/${id}/full`);
    
    if (!response.ok) {
      console.error(`Error response from API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch manga details');
    }
    
    const data = await response.json();
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
    await delayRequest();
    
    const response = await fetch(`${BASE_URL}/genres/manga`);
    
    if (!response.ok) {
      console.error(`Error response from API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch manga genres');
    }
    
    const data = await response.json();
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
    await delayRequest();
    
    const response = await fetch(
      `${BASE_URL}/manga?genres=${genreId}&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      console.error(`Error response from API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch manga by genre');
    }
    
    const data = await response.json();
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
    await delayRequest();
    
    const response = await fetch(
      `${BASE_URL}/manga?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      console.error(`Error response from API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to search manga');
    }
    
    const data = await response.json();
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
    await delayRequest();
    
    const response = await fetch(
      `${BASE_URL}/manga?order_by=start_date&sort=desc&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      console.error(`Error response from API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch recent manga');
    }
    
    const data = await response.json();
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
    await delayRequest();
    
    const response = await fetch(`${BASE_URL}/manga/${mangaId}/pictures`);
    
    if (!response.ok) {
      console.error(`Error response from API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch manga images');
    }
    
    const data = await response.json();
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
    await delayRequest();
    
    const response = await fetch(
      `${BASE_URL}/manga?genres=${genreId}&order_by=popularity&sort=asc&limit=${limit}`
    );
    
    if (!response.ok) {
      console.error(`Error response from API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch popular manga by genre');
    }
    
    const data = await response.json();
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
    await delayRequest();
    
    const response = await fetch(
      `${BASE_URL}/manga?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    
    if (!response.ok) {
      console.error(`Error response from API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch manga suggestions');
    }
    
    const data = await response.json();
    console.log(`Manga suggestions fetched successfully: ${data?.data?.length} items`);
    return data;
  } catch (error) {
    console.error("Error fetching manga suggestions:", error);
    return { data: [] };
  }
};
