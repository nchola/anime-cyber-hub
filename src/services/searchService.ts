
const BASE_URL = "https://api.jikan.moe/v4";

// Helper function to add a delay to prevent rate limiting
// Increase base delay to avoid rate limiting errors (429)
const delayRequest = async (ms = 2000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry mechanism for API calls that fail due to rate limiting
const fetchWithRetry = async (url: string, retries = 3, delay = 2000) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Add delay before each attempt
      await delayRequest(delay);
      
      const response = await fetch(url);
      
      if (response.status === 429) {
        console.error(`Rate limited (attempt ${attempt + 1}/${retries}), waiting longer before retry...`);
        // Exponential backoff for retries
        await delayRequest(delay * (attempt + 2));
        continue;
      }
      
      if (!response.ok) {
        console.error(`Error response from API: ${response.status} ${response.statusText}`);
        throw new Error(`Failed with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (attempt === retries - 1) throw error;
      console.error(`Attempt ${attempt + 1} failed, retrying...`, error);
    }
  }
  
  throw new Error('Maximum retries exceeded');
};

export const searchAnime = async (query: string, page = 1, limit = 12) => {
  try {
    const data = await fetchWithRetry(
      `${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    
    console.log(`Anime search results: ${data?.data?.length} items`);
    return data;
  } catch (error) {
    console.error("Error searching anime:", error);
    throw error;
  }
};

export const searchManga = async (query: string, page = 1, limit = 12) => {
  try {
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

// Get current airing season anime
export const getSeasonNow = async (page = 1, limit = 12) => {
  try {
    const data = await fetchWithRetry(
      `${BASE_URL}/seasons/now?page=${page}&limit=${limit}`
    );
    
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
    const data = await fetchWithRetry(
      `${BASE_URL}/seasons/upcoming?page=${page}&limit=${limit}`
    );
    
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
    const data = await fetchWithRetry(`${BASE_URL}/seasons`);
    
    console.log(`Season list fetched: ${data?.data?.length} seasons`);
    return data;
  } catch (error) {
    console.error("Error fetching season list:", error);
    throw error;
  }
};

export const getSearchSuggestions = async (query: string, limit = 5) => {
  try {
    const data = await fetchWithRetry(
      `${BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    
    console.log(`Anime suggestions: ${data?.data?.length} items`);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};

export const getMangaSearchSuggestions = async (query: string, limit = 5) => {
  try {
    const data = await fetchWithRetry(
      `${BASE_URL}/manga?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    
    console.log(`Manga suggestions: ${data?.data?.length} items`);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching manga suggestions:", error);
    return [];
  }
};
