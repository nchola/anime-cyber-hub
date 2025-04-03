
import { Manga, MangaGenresResponse } from "@/types/manga";

const BASE_URL = "https://api.jikan.moe/v4";

export const getTopManga = async (page = 1, limit = 12) => {
  try {
    const response = await fetch(
      `${BASE_URL}/top/manga?page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch top manga');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching top manga:", error);
    throw error;
  }
};

export const getMangaById = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/manga/${id}/full`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch manga details');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching manga details:", error);
    throw error;
  }
};

export const getMangaGenres = async (): Promise<MangaGenresResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/genres/manga`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch manga genres');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching manga genres:", error);
    throw error;
  }
};

export const getMangaByGenre = async (genreId: number, page = 1, limit = 12) => {
  try {
    const response = await fetch(
      `${BASE_URL}/manga?genres=${genreId}&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch manga by genre');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching manga by genre:", error);
    throw error;
  }
};

export const searchManga = async (query: string, page = 1, limit = 12) => {
  try {
    const response = await fetch(
      `${BASE_URL}/manga?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search manga');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error searching manga:", error);
    throw error;
  }
};

export const getRecentManga = async (page = 1, limit = 12) => {
  try {
    const response = await fetch(
      `${BASE_URL}/manga?order_by=start_date&sort=desc&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch recent manga');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching recent manga:", error);
    throw error;
  }
};

export const getMangaImages = async (mangaId: number) => {
  try {
    // Using a timeout to avoid API rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await fetch(`${BASE_URL}/manga/${mangaId}/pictures`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch manga images');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching manga images:", error);
    throw error;
  }
};

export const getPopularMangaByGenre = async (genreId: number, limit = 6) => {
  try {
    const response = await fetch(
      `${BASE_URL}/manga?genres=${genreId}&order_by=popularity&sort=asc&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch popular manga by genre');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching popular manga by genre:", error);
    throw error;
  }
};

export const getMangaSuggestions = async (query: string, limit = 5) => {
  try {
    const response = await fetch(
      `${BASE_URL}/manga?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch manga suggestions');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching manga suggestions:", error);
    throw error;
  }
};
