
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

// Get current airing season anime
export const getSeasonNow = async (page = 1, limit = 12) => {
  try {
    // Delay the request to avoid rate limiting
    await delayRequest();
    
    const response = await fetch(
      `${BASE_URL}/seasons/now?page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      console.error(`Error response from season now API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch current season anime');
    }
    
    const data = await response.json();
    console.log(`Current season anime: ${data?.data?.length} items`);
    return data;
  } catch (error) {
    console.error("Error fetching current season anime:", error);
    throw error;
  }
};

// Get upcoming season anime
export const getSeasonUpcoming = async (page = 1, limit = 12) => {
  try {
    // Delay the request to avoid rate limiting
    await delayRequest();
    
    const response = await fetch(
      `${BASE_URL}/seasons/upcoming?page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      console.error(`Error response from upcoming season API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch upcoming season anime');
    }
    
    const data = await response.json();
    console.log(`Upcoming season anime: ${data?.data?.length} items`);
    return data;
  } catch (error) {
    console.error("Error fetching upcoming season anime:", error);
    throw error;
  }
};

// Get list of available seasons
export const getSeasonList = async () => {
  try {
    // Delay the request to avoid rate limiting
    await delayRequest();
    
    const response = await fetch(`${BASE_URL}/seasons`);
    
    if (!response.ok) {
      console.error(`Error response from season list API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch season list');
    }
    
    const data = await response.json();
    console.log(`Season list fetched: ${data?.data?.length} seasons`);
    return data;
  } catch (error) {
    console.error("Error fetching season list:", error);
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
