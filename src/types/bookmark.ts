// Bookmark types
export type BookmarkItem = {
  id: number;
  title: string;
  image_url: string;
  type: 'anime' | 'manga';
  [key: string]: any;
};

// Supabase bookmark types
export type SupabaseBookmark = {
  id: number;
  user_id: string;
  item_id: number;
  item_type: 'anime' | 'manga';
  item_data: any;
  created_at: string;
  updated_at: string;
}; 