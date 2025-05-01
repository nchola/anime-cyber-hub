import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { BookmarkItem } from '@/types/bookmark';
import { Database } from '@/integrations/supabase/database.types';

export type BookmarkType = 'anime' | 'manga';

type DbBookmark = Database['public']['Tables']['bookmarks']['Row'];

export function useBookmark() {
  const { isAuthenticated, user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookmarks from localStorage and server
  const loadBookmarks = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get local bookmarks
      const localAnimeBookmarks = JSON.parse(localStorage.getItem('anime_bookmarks') || '[]');
      const localMangaBookmarks = JSON.parse(localStorage.getItem('manga_bookmarks') || '[]');
      
      // If not authenticated, only use local bookmarks
      if (!isAuthenticated || !user) {
        setBookmarks([...localAnimeBookmarks, ...localMangaBookmarks]);
        setIsLoading(false);
        return;
      }
      
      // Get server bookmarks
      const { data: serverBookmarks, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Process server bookmarks
      const processedServerBookmarks = (serverBookmarks as DbBookmark[]).map(bookmark => {
        const itemData = bookmark.item_data as {
          id: number;
          title: string;
          image_url: string;
          [key: string]: any;
        };
        
        return {
          id: itemData.id,
          title: itemData.title,
          image_url: itemData.image_url,
          type: bookmark.item_type,
          ...itemData
        };
      });
      
      // Update local storage with server bookmarks
      const serverAnimeBookmarks = processedServerBookmarks.filter(b => b.type === 'anime');
      const serverMangaBookmarks = processedServerBookmarks.filter(b => b.type === 'manga');
      
      localStorage.setItem('anime_bookmarks', JSON.stringify(serverAnimeBookmarks));
      localStorage.setItem('manga_bookmarks', JSON.stringify(serverMangaBookmarks));
      
      setBookmarks(processedServerBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      // Fallback to local bookmarks on error
      const localAnimeBookmarks = JSON.parse(localStorage.getItem('anime_bookmarks') || '[]');
      const localMangaBookmarks = JSON.parse(localStorage.getItem('manga_bookmarks') || '[]');
      setBookmarks([...localAnimeBookmarks, ...localMangaBookmarks]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Initialize bookmarks
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  // Check if an item is bookmarked
  const isBookmarked = useCallback((itemId: number) => {
    return bookmarks.some(bookmark => bookmark.id === itemId);
  }, [bookmarks]);

  // Add a bookmark
  const addBookmark = useCallback(async (item: BookmarkItem) => {
    try {
      // Add to local storage first
      const localBookmarks = JSON.parse(
        localStorage.getItem(`${item.type}_bookmarks`) || '[]'
      );
      
      // Check if already bookmarked
      if (localBookmarks.some((bookmark: BookmarkItem) => bookmark.id === item.id)) {
        return true;
      }
      
      const updatedLocalBookmarks = [...localBookmarks, item];
      localStorage.setItem(
        `${item.type}_bookmarks`,
        JSON.stringify(updatedLocalBookmarks)
      );
      
      // Update state
      setBookmarks(prev => [...prev, item]);
      
      // If authenticated, save to server
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            item_id: item.id,
            item_type: item.type,
            item_data: item
          });
          
        if (error) {
          throw error;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }, [isAuthenticated, user]);

  // Remove a bookmark
  const removeBookmark = useCallback(async (itemId: number, type: BookmarkType) => {
    try {
      // Remove from local storage
      const localBookmarks = JSON.parse(
        localStorage.getItem(`${type}_bookmarks`) || '[]'
      );
      const updatedLocalBookmarks = localBookmarks.filter(
        (bookmark: BookmarkItem) => bookmark.id !== itemId
      );
      localStorage.setItem(
        `${type}_bookmarks`,
        JSON.stringify(updatedLocalBookmarks)
      );
      
      // Update state
      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== itemId));
      
      // If authenticated, remove from server
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', itemId);
          
        if (error) {
          throw error;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }, [isAuthenticated, user]);

  // Get bookmarks by type
  const getBookmarksByType = useCallback((type: BookmarkType) => {
    return bookmarks.filter(bookmark => bookmark.type === type);
  }, [bookmarks]);

  return {
    bookmarks,
    isLoading,
    isBookmarked,
    addBookmark,
    removeBookmark,
    getBookmarksByType,
    refreshBookmarks: loadBookmarks
  };
} 