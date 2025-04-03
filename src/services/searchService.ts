
const BASE_URL = "https://api.jikan.moe/v4";

export const searchAnime = async (query: string, page = 1, limit = 12) => {
  try {
    const response = await fetch(
      `${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search anime');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error searching anime:", error);
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
