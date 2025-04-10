import { getCurrentUser, saveBookmark, removeBookmark, getUserBookmarks } from '@/lib/supabase';
import { BookmarkItem, SupabaseBookmark } from '@/types/bookmark';

// Local storage keys
const ANIME_BOOKMARKS_KEY = 'bookmarks';
const MANGA_BOOKMARKS_KEY = 'bookmarkedManga';

// Get all bookmarks from local storage
export const getLocalBookmarks = (): BookmarkItem[] => {
  try {
    const animeBookmarks = JSON.parse(localStorage.getItem(ANIME_BOOKMARKS_KEY) || '[]');
    const mangaBookmarks = JSON.parse(localStorage.getItem(MANGA_BOOKMARKS_KEY) || '[]');
    
    return [
      ...animeBookmarks.map((item: any) => ({ ...item, type: 'anime' })),
      ...mangaBookmarks.map((item: any) => ({ ...item, type: 'manga' }))
    ];
  } catch (error) {
    console.error('Error getting local bookmarks:', error);
    return [];
  }
};

// Add a bookmark to local storage
export const addLocalBookmark = (item: BookmarkItem): void => {
  try {
    if (item.type === 'anime') {
      const bookmarks = JSON.parse(localStorage.getItem(ANIME_BOOKMARKS_KEY) || '[]');
      if (!bookmarks.some((b: any) => b.id === item.id)) {
        bookmarks.push(item);
        localStorage.setItem(ANIME_BOOKMARKS_KEY, JSON.stringify(bookmarks));
      }
    } else if (item.type === 'manga') {
      const bookmarks = JSON.parse(localStorage.getItem(MANGA_BOOKMARKS_KEY) || '[]');
      if (!bookmarks.some((b: any) => b.id === item.id)) {
        bookmarks.push(item);
        localStorage.setItem(MANGA_BOOKMARKS_KEY, JSON.stringify(bookmarks));
      }
    }
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Error adding local bookmark:', error);
  }
};

// Remove a bookmark from local storage
export const removeLocalBookmark = (itemId: number, itemType: 'anime' | 'manga'): void => {
  try {
    if (itemType === 'anime') {
      const bookmarks = JSON.parse(localStorage.getItem(ANIME_BOOKMARKS_KEY) || '[]');
      const filteredBookmarks = bookmarks.filter((b: any) => b.id !== itemId);
      localStorage.setItem(ANIME_BOOKMARKS_KEY, JSON.stringify(filteredBookmarks));
    } else if (itemType === 'manga') {
      const bookmarks = JSON.parse(localStorage.getItem(MANGA_BOOKMARKS_KEY) || '[]');
      const filteredBookmarks = bookmarks.filter((b: any) => b.id !== itemId);
      localStorage.setItem(MANGA_BOOKMARKS_KEY, JSON.stringify(filteredBookmarks));
    }
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Error removing local bookmark:', error);
  }
};

// Check if an item is bookmarked in local storage
export const isLocalBookmarked = (itemId: number, itemType: 'anime' | 'manga'): boolean => {
  try {
    if (itemType === 'anime') {
      const bookmarks = JSON.parse(localStorage.getItem(ANIME_BOOKMARKS_KEY) || '[]');
      return bookmarks.some((b: any) => b.id === itemId);
    } else if (itemType === 'manga') {
      const bookmarks = JSON.parse(localStorage.getItem(MANGA_BOOKMARKS_KEY) || '[]');
      return bookmarks.some((b: any) => b.id === itemId);
    }
    return false;
  } catch (error) {
    console.error('Error checking local bookmark:', error);
    return false;
  }
};

// Add a bookmark (both local and server if logged in)
export const addBookmark = async (item: BookmarkItem): Promise<void> => {
  // Always add to local storage
  addLocalBookmark(item);
  
  // If user is logged in, also add to server
  try {
    const user = await getCurrentUser();
    if (user) {
      await saveBookmark(user.id, item.id, item.type, item);
    }
  } catch (error) {
    console.error('Error adding server bookmark:', error);
  }
};

// Remove a bookmark (both local and server if logged in)
export const removeBookmarkItem = async (itemId: number, itemType: 'anime' | 'manga'): Promise<void> => {
  // Always remove from local storage
  removeLocalBookmark(itemId, itemType);
  
  // If user is logged in, also remove from server
  try {
    const user = await getCurrentUser();
    if (user) {
      await removeBookmark(user.id, itemId, itemType);
    }
  } catch (error) {
    console.error('Error removing server bookmark:', error);
  }
};

// Check if an item is bookmarked (both local and server if logged in)
export const isBookmarked = async (itemId: number, itemType: 'anime' | 'manga'): Promise<boolean> => {
  // Always check local storage first
  if (isLocalBookmarked(itemId, itemType)) {
    return true;
  }
  
  // If user is logged in, also check server
  try {
    const user = await getCurrentUser();
    if (user) {
      const { data } = await getUserBookmarks(user.id);
      if (data) {
        // Type assertion to handle the data properly
        const bookmarks = data as SupabaseBookmark[];
        return bookmarks.some(b => b.item_id === itemId && b.item_type === itemType);
      }
    }
  } catch (error) {
    console.error('Error checking server bookmark:', error);
  }
  
  return false;
}; 