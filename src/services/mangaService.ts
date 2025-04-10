import { Manga, MangaGenresResponse } from "@/types/manga";
import { cacheStorage, CACHE_DURATIONS } from "@/utils/cacheUtils";

const BASE_URL = "https://api.jikan.moe/v4";

// Queue for API requests to implement rate limiting
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
const delayRequest = async (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Exponential backoff for retries
const getBackoffDelay = (attempt: number, baseDelay = 1000, maxDelay = 10000) => {
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // Add some jitter to prevent all retries happening at the same time
  return delay + Math.random() * 500;
};

// Generic fetch function with retry logic and caching
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
          const response = await fetch(url);
          
          if (response.status === 429) {
            console.warn(`Rate limited (attempt ${attempt + 1}/${retries}), applying exponential backoff...`);
            // Exponential backoff for retries
            const backoffDelay = getBackoffDelay(attempt);
            await delayRequest(backoffDelay);
            continue;
          }
          
          if (!response.ok) {
            console.error(`Error response from API: ${response.status} ${response.statusText}`);
            if (attempt < retries - 1) {
              const backoffDelay = getBackoffDelay(attempt);
              await delayRequest(backoffDelay);
              continue;
            }
            throw new Error(`Failed with status: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Cache the fresh data
          cacheStorage.set(cacheKey, data);
          
          return data;
        } catch (error) {
          if (attempt === retries - 1) throw error;
          console.error(`Attempt ${attempt + 1} failed, retrying...`, error);
          const backoffDelay = getBackoffDelay(attempt);
          await delayRequest(backoffDelay);
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

export const getTopManga = async (page = 1, limit = 12) => {
  try {
    console.log(`Fetching top manga: page=${page}, limit=${limit}`);
    const cacheKey = `top-manga-p${page}-l${limit}`;
    const data = await fetchWithRetry(
      `${BASE_URL}/top/manga?page=${page}&limit=${limit}`,
      cacheKey,
      CACHE_DURATIONS.TOP_ANIME
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
    const cacheKey = `manga-${id}`;
    const data = await fetchWithRetry(
      `${BASE_URL}/manga/${id}/full`,
      cacheKey,
      CACHE_DURATIONS.MANGA_DETAILS
    );
    
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
    const cacheKey = `manga-genres`;
    const data = await fetchWithRetry(
      `${BASE_URL}/genres/manga`,
      cacheKey,
      CACHE_DURATIONS.GENRES
    );
    
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
    const cacheKey = `genre-manga-${genreId}-p${page}-l${limit}`;
    const data = await fetchWithRetry(
      `${BASE_URL}/manga?genres=${genreId}&page=${page}&limit=${limit}`,
      cacheKey,
      CACHE_DURATIONS.SEARCH_RESULTS
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

export const getRecentManga = async (page = 1, limit = 12) => {
  try {
    console.log(`Fetching recent manga: page=${page}, limit=${limit}`);
    const cacheKey = `recent-manga-p${page}-l${limit}`;
    const data = await fetchWithRetry(
      `${BASE_URL}/manga?order_by=start_date&sort=desc&page=${page}&limit=${limit}`,
      cacheKey,
      CACHE_DURATIONS.SEARCH_RESULTS
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
    const cacheKey = `manga-images-${mangaId}`;
    const data = await fetchWithRetry(
      `${BASE_URL}/manga/${mangaId}/pictures`,
      cacheKey,
      CACHE_DURATIONS.MANGA_DETAILS
    );
    
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
    const cacheKey = `popular-genre-manga-${genreId}-l${limit}`;
    const data = await fetchWithRetry(
      `${BASE_URL}/manga?genres=${genreId}&order_by=popularity&sort=asc&limit=${limit}`,
      cacheKey,
      CACHE_DURATIONS.SEARCH_RESULTS
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
    const cacheKey = `manga-suggestions-${query}-l${limit}`;
    const data = await fetchWithRetry(
      `${BASE_URL}/manga?q=${encodeURIComponent(query)}&limit=${limit}`,
      cacheKey,
      60 * 1000 // 1 minute cache for suggestions
    );
    
    console.log(`Manga suggestions fetched successfully: ${data?.data?.length} items`);
    return data;
  } catch (error) {
    console.error("Error fetching manga suggestions:", error);
    return { data: [] };
  }
};
