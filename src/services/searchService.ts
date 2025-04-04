
const BASE_URL = "https://api.jikan.moe/v4";

// Helper function to add a delay to prevent rate limiting
const delayRequest = async (ms = 1500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const searchAnime = async (query: string, page = 1, limit = 12) => {
  try {
    // Delay the request to avoid rate limiting
    await delayRequest();
    
    const response = await fetch(
      `${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      console.error(`Error response from anime search API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to search anime');
    }
    
    const data = await response.json();
    console.log(`Anime search results: ${data?.data?.length} items`);
    return data;
  } catch (error) {
    console.error("Error searching anime:", error);
    throw error;
  }
};

export const searchManga = async (query: string, page = 1, limit = 12) => {
  try {
    // Delay the request to avoid rate limiting
    await delayRequest();
    
    const response = await fetch(
      `${BASE_URL}/manga?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      console.error(`Error response from manga search API: ${response.status} ${response.statusText}`);
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

export const getSearchSuggestions = async (query: string, limit = 5) => {
  try {
    // Delay the request to avoid rate limiting
    await delayRequest();
    
    const response = await fetch(
      `${BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    
    if (!response.ok) {
      console.error(`Error response from suggestions API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch anime suggestions');
    }
    
    const data = await response.json();
    console.log(`Anime suggestions: ${data?.data?.length} items`);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};

export const getMangaSearchSuggestions = async (query: string, limit = 5) => {
  try {
    // Delay the request to avoid rate limiting
    await delayRequest();
    
    const response = await fetch(
      `${BASE_URL}/manga?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    
    if (!response.ok) {
      console.error(`Error response from manga suggestions API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch manga suggestions');
    }
    
    const data = await response.json();
    console.log(`Manga suggestions: ${data?.data?.length} items`);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching manga suggestions:", error);
    return [];
  }
};
