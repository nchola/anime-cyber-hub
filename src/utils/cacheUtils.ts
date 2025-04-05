
// Cache utility for implementing stale-while-revalidate pattern

// Cache duration constants (in milliseconds)
export const CACHE_DURATIONS = {
  TOP_ANIME: 24 * 60 * 60 * 1000, // 24 hours
  SEASONAL_ANIME: 12 * 60 * 60 * 1000, // 12 hours
  UPCOMING_ANIME: 12 * 60 * 60 * 1000, // 12 hours
  ANIME_DETAILS: 7 * 24 * 60 * 60 * 1000, // 7 days
  MANGA_DETAILS: 7 * 24 * 60 * 60 * 1000, // 7 days
  SEARCH_RESULTS: 60 * 60 * 1000, // 1 hour
  GENRES: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// LocalStorage cache implementation
export const cacheStorage = {
  get: <T>(key: string): { data: T; timestamp: number } | null => {
    try {
      const item = localStorage.getItem(`cyber-anime-cache:${key}`);
      if (!item) return null;
      
      return JSON.parse(item);
    } catch (error) {
      console.error("Error retrieving from cache:", error);
      return null;
    }
  },
  
  set: <T>(key: string, data: T): void => {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
      };
      
      localStorage.setItem(`cyber-anime-cache:${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.error("Error setting cache:", error);
    }
  },
  
  isStale: (key: string, maxAge: number): boolean => {
    const cached = localStorage.getItem(`cyber-anime-cache:${key}`);
    if (!cached) return true;
    
    try {
      const { timestamp } = JSON.parse(cached);
      return Date.now() - timestamp > maxAge;
    } catch {
      return true;
    }
  },
  
  remove: (key: string): void => {
    localStorage.removeItem(`cyber-anime-cache:${key}`);
  },
  
  clear: (): void => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cyber-anime-cache:')) {
        localStorage.removeItem(key);
      }
    });
  }
};
