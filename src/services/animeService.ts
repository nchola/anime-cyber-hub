
import { AnimeResponse, SingleAnimeResponse } from "@/types/anime";
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

// Get top anime
export const getTopAnime = async (page = 1, limit = 12): Promise<AnimeResponse> => {
  console.log(`Fetching top anime: page=${page}, limit=${limit}`);
  const cacheKey = `top-anime-p${page}-l${limit}`;
  return fetchWithRetry(
    `${BASE_URL}/top/anime?page=${page}&limit=${limit}`,
    cacheKey,
    CACHE_DURATIONS.TOP_ANIME
  );
};

// Get seasonal anime
export const getSeasonalAnime = async (year = new Date().getFullYear(), season = "winter", page = 1, limit = 12): Promise<AnimeResponse> => {
  console.log(`Fetching seasonal anime: year=${year}, season=${season}, page=${page}, limit=${limit}`);
  const cacheKey = `seasonal-anime-${year}-${season}-p${page}-l${limit}`;
  return fetchWithRetry(
    `${BASE_URL}/seasons/${year}/${season}?page=${page}&limit=${limit}`,
    cacheKey,
    CACHE_DURATIONS.SEASONAL_ANIME
  );
};

// Get anime by ID
export const getAnimeById = async (id: number): Promise<SingleAnimeResponse> => {
  try {
    console.log(`Fetching anime by ID: id=${id}`);
    const cacheKey = `anime-${id}`;
    const result = await fetchWithRetry(
      `${BASE_URL}/anime/${id}`,
      cacheKey,
      CACHE_DURATIONS.ANIME_DETAILS
    );
    console.log(`Anime fetched successfully: ${result?.data?.title}`);
    return result;
  } catch (error) {
    console.error(`Failed to fetch anime with ID ${id}:`, error);
    return {
      data: {} as any
    };
  }
};

// Search anime
export const searchAnime = async (query: string, page = 1, limit = 12): Promise<AnimeResponse> => {
  console.log(`Searching anime: query=${query}, page=${page}, limit=${limit}`);
  const cacheKey = `search-anime-${query}-p${page}-l${limit}`;
  return fetchWithRetry(
    `${BASE_URL}/anime?q=${query}&page=${page}&limit=${limit}`,
    cacheKey,
    CACHE_DURATIONS.SEARCH_RESULTS
  );
};

// Get anime by genre
export const getAnimeByGenre = async (genreId: number, page = 1, limit = 12): Promise<AnimeResponse> => {
  console.log(`Fetching anime by genre: genreId=${genreId}, page=${page}, limit=${limit}`);
  const cacheKey = `genre-anime-${genreId}-p${page}-l${limit}`;
  return fetchWithRetry(
    `${BASE_URL}/anime?genres=${genreId}&page=${page}&limit=${limit}`,
    cacheKey,
    CACHE_DURATIONS.SEARCH_RESULTS
  );
};

// Get current season anime
export const getCurrentSeasonAnime = async (page = 1, limit = 12): Promise<AnimeResponse> => {
  console.log(`Fetching current season anime: page=${page}, limit=${limit}`);
  const cacheKey = `current-season-anime-p${page}-l${limit}`;
  return fetchWithRetry(
    `${BASE_URL}/seasons/now?page=${page}&limit=${limit}`,
    cacheKey,
    CACHE_DURATIONS.SEASONAL_ANIME
  );
};

// Get upcoming anime
export const getUpcomingAnime = async (page = 1, limit = 12): Promise<AnimeResponse> => {
  console.log(`Fetching upcoming anime: page=${page}, limit=${limit}`);
  const cacheKey = `upcoming-anime-p${page}-l${limit}`;
  return fetchWithRetry(
    `${BASE_URL}/seasons/upcoming?page=${page}&limit=${limit}`,
    cacheKey,
    CACHE_DURATIONS.UPCOMING_ANIME
  );
};

// Get anime genres
export const getAnimeGenres = async () => {
  try {
    console.log("Fetching anime genres");
    const cacheKey = `anime-genres`;
    const response = await fetchWithRetry(
      `${BASE_URL}/genres/anime`,
      cacheKey,
      CACHE_DURATIONS.GENRES
    );
    // Filter out sensitive content and return the data array directly
    if (response && response.data) {
      const filteredGenres = response.data.filter((genre: any) => genre.name !== "Hentai");
      console.log(`Anime genres fetched successfully: ${filteredGenres.length} genres`);
      return filteredGenres;
    }
    return []; // Return empty array if data is missing
  } catch (error) {
    console.error("Failed to fetch anime genres:", error);
    return []; // Return empty array on error
  }
};

// Get anime videos/trailers
export const getAnimeVideos = async (animeId: number) => {
  try {
    console.log(`Fetching anime videos: animeId=${animeId}`);
    const cacheKey = `anime-videos-${animeId}`;
    const response = await fetchWithRetry(
      `${BASE_URL}/anime/${animeId}/videos`,
      cacheKey,
      CACHE_DURATIONS.ANIME_DETAILS
    );
    console.log(`Anime videos fetched successfully: ${response?.data?.promo?.length || 0} promos`);
    return response;
  } catch (error) {
    console.error(`Failed to fetch videos for anime ID ${animeId}:`, error);
    return {
      data: {
        promo: [],
        episodes: [],
        music_videos: []
      }
    };
  }
};
