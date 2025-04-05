
import { cacheStorage, CACHE_DURATIONS } from "@/utils/cacheUtils";

const BASE_URL = "https://api.jikan.moe/v4";

// Request queue for rate limiting - using same pattern as in animeService
class RequestQueue {
  private queue: (() => Promise<void>)[] = [];
  private processing = false;
  private requestsThisSecond = 0;
  private lastRequestTime = 0;
  private maxRequestsPerSecond = 3;

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    
    // Implement rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < 1000) {
      // Still within the same second
      this.requestsThisSecond++;
      
      if (this.requestsThisSecond >= this.maxRequestsPerSecond) {
        // Wait until the next second
        const waitTime = 1000 - timeSinceLastRequest + 50; // Add 50ms buffer
        await delayRequest(waitTime);
        this.requestsThisSecond = 0;
      }
    } else {
      // New second started
      this.requestsThisSecond = 1;
    }
    
    this.lastRequestTime = Date.now();
    
    const nextRequest = this.queue.shift();
    if (nextRequest) {
      await nextRequest();
      this.processQueue();
    } else {
      this.processing = false;
    }
  }
}

const requestQueue = new RequestQueue();

// Helper function to add a delay to prevent rate limiting
const delayRequest = async (ms = 4000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Exponential backoff for retries
const getBackoffDelay = (attempt: number, baseDelay = 4000, maxDelay = 20000) => {
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // Add some jitter to prevent all retries happening at the same time
  return delay + Math.random() * 1000;
};

// Fetch with retry, caching and stale-while-revalidate pattern
const fetchWithRetry = async (
  url: string, 
  cacheKey: string, 
  cacheDuration: number,
  retries = 3
): Promise<any> => {
  // Check cache first
  const cachedData = cacheStorage.get(cacheKey);
  
  // If we have cached data and it's not stale, use it immediately
  if (cachedData && !cacheStorage.isStale(cacheKey, cacheDuration)) {
    console.log(`[Cache] Using cached data for ${cacheKey}`);
    return cachedData.data;
  }
  
  // If we're offline and have cached data (even if stale), use it
  if (!navigator.onLine && cachedData) {
    console.log(`[Offline] Using stale cached data for ${cacheKey}`);
    return cachedData.data;
  }
  
  // If we have stale data, we'll return it but still fetch fresh data in the background
  const shouldRevalidate = cachedData && cacheStorage.isStale(cacheKey, cacheDuration);
  
  // Function to perform the actual fetch
  const performFetch = async (): Promise<any> => {
    return requestQueue.add(async () => {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          // Add delay before each attempt to prevent rate limiting
          if (attempt > 0) {
            const backoffDelay = getBackoffDelay(attempt - 1);
            await delayRequest(backoffDelay);
          }
          
          const response = await fetch(url);
          
          if (response.status === 429) {
            console.warn(`Rate limited (attempt ${attempt + 1}/${retries}), applying exponential backoff...`);
            continue;
          }
          
          if (!response.ok) {
            console.error(`Error response from API: ${response.status} ${response.statusText}`);
            if (attempt < retries - 1) continue;
            throw new Error(`Failed with status: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Cache the fresh data
          cacheStorage.set(cacheKey, data);
          
          return data;
        } catch (error) {
          if (attempt === retries - 1) throw error;
          console.error(`Attempt ${attempt + 1} failed, retrying...`, error);
        }
      }
      
      throw new Error('Maximum retries exceeded');
    });
  };
  
  // Stale-while-revalidate pattern
  if (shouldRevalidate) {
    console.log(`[SWR] Returning stale data for ${cacheKey} while revalidating`);
    
    // Revalidate in the background without awaiting
    performFetch().catch(err => {
      console.error(`Background revalidation failed for ${cacheKey}:`, err);
    });
    
    return cachedData.data;
  }
  
  // If we don't have any cached data or we need fresh data and we're online
  try {
    return await performFetch();
  } catch (error) {
    // If fetch fails and we have cached data (even if stale), use it as fallback
    if (cachedData) {
      console.log(`[Fallback] Using stale cached data after fetch failure for ${cacheKey}`);
      return cachedData.data;
    }
    
    // If we have no cached data and fetch failed, we must throw
    console.error(`Failed to fetch ${cacheKey} with no cache fallback:`, error);
    throw error;
  }
};

export const searchAnime = async (query: string, page = 1, limit = 12) => {
  try {
    const cacheKey = `search-anime-${query}-p${page}-l${limit}`;
    const data = await fetchWithRetry(
      `${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      cacheKey,
      CACHE_DURATIONS.SEARCH_RESULTS
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
    const cacheKey = `search-manga-${query}-p${page}-l${limit}`;
    const data = await fetchWithRetry(
      `${BASE_URL}/manga?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      cacheKey,
      CACHE_DURATIONS.SEARCH_RESULTS
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
    const cacheKey = `season-now-p${page}-l${limit}`;
    const data = await fetchWithRetry(
      `${BASE_URL}/seasons/now?page=${page}&limit=${limit}`,
      cacheKey,
      CACHE_DURATIONS.SEASONAL_ANIME
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
    const cacheKey = `season-upcoming-p${page}-l${limit}`;
    const data = await fetchWithRetry(
      `${BASE_URL}/seasons/upcoming?page=${page}&limit=${limit}`,
      cacheKey,
      CACHE_DURATIONS.UPCOMING_ANIME
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
    const cacheKey = `season-list`;
    const data = await fetchWithRetry(
      `${BASE_URL}/seasons`,
      cacheKey,
      CACHE_DURATIONS.GENRES
    );
    
    console.log(`Season list fetched: ${data?.data?.length} seasons`);
    return data;
  } catch (error) {
    console.error("Error fetching season list:", error);
    throw error;
  }
};

export const getSearchSuggestions = async (query: string, limit = 5) => {
  try {
    // For search suggestions, use a shorter cache duration
    const cacheKey = `anime-suggestions-${query}-l${limit}`;
    const data = await fetchWithRetry(
      `${BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=${limit}`,
      cacheKey,
      60 * 1000 // 1 minute cache for suggestions
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
    const cacheKey = `manga-suggestions-${query}-l${limit}`;
    const data = await fetchWithRetry(
      `${BASE_URL}/manga?q=${encodeURIComponent(query)}&limit=${limit}`,
      cacheKey,
      60 * 1000 // 1 minute cache for suggestions
    );
    
    console.log(`Manga suggestions: ${data?.data?.length} items`);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching manga suggestions:", error);
    return [];
  }
};
