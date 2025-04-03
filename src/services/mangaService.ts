
import { Manga } from "@/types/manga";

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

export const getMangaGenres = async () => {
  try {
    const response = await fetch(`${BASE_URL}/genres/manga`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch manga genres');
    }
    
    const data = await response.json();
    return data.data;
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
