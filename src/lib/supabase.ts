import { supabase } from '@/integrations/supabase/client';
import { SupabaseBookmark } from '@/types/bookmark';

// Authentication helper functions
export async function signUpWithEmail(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
      }
    }
  });

  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Bookmark helper functions
export async function saveBookmark(userId: string, itemId: number, itemType: 'anime' | 'manga', itemData: any) {
  const { data, error } = await supabase
    .from('bookmarks')
    .upsert({
      user_id: userId,
      item_id: itemId,
      item_type: itemType,
      item_data: itemData,
      created_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,item_id,item_type'
    });
  
  return { data, error };
}

export async function removeBookmark(userId: string, itemId: number, itemType: 'anime' | 'manga') {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .match({ user_id: userId, item_id: itemId, item_type: itemType });
  
  return { error };
}

export async function getUserBookmarks(userId: string) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId);
  
  return { data, error };
}

export async function syncLocalBookmarksWithServer(userId: string) {
  // Get local bookmarks
  const localBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  const localMangaBookmarks = JSON.parse(localStorage.getItem('bookmarkedManga') || '[]');
  
  // Get server bookmarks
  const { data: serverBookmarks, error } = await getUserBookmarks(userId);
  
  if (error) {
    console.error('Error syncing bookmarks:', error);
    return { error };
  }
  
  // Process anime bookmarks
  for (const bookmark of localBookmarks) {
    await saveBookmark(userId, bookmark.id, 'anime', bookmark);
  }
  
  // Process manga bookmarks
  for (const bookmark of localMangaBookmarks) {
    await saveBookmark(userId, bookmark.id, 'manga', bookmark);
  }
  
  // Update local storage with server data
  if (serverBookmarks) {
    // Type assertion to handle the data properly
    const bookmarks = serverBookmarks as SupabaseBookmark[];
    
    const animeBookmarks = bookmarks
      .filter(b => b.item_type === 'anime')
      .map(b => b.item_data);
      
    const mangaBookmarks = bookmarks
      .filter(b => b.item_type === 'manga')
      .map(b => b.item_data);
    
    localStorage.setItem('bookmarks', JSON.stringify(animeBookmarks));
    localStorage.setItem('bookmarkedManga', JSON.stringify(mangaBookmarks));
  }
  
  return { data: serverBookmarks, error: null };
}
