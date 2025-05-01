import { Database } from "@/integrations/supabase/database.types";

// Bookmark types
export type BookmarkType = 'anime' | 'manga';

export interface BookmarkItem {
  id: number;
  type: BookmarkType;
  title: string;
  image_url: string;
}

// Supabase bookmark types
export type SupabaseBookmark = Database['public']['Tables']['bookmarks']['Row'];

export interface BookmarkData {
  id: number;
  type: BookmarkType;
  data: any;
} 