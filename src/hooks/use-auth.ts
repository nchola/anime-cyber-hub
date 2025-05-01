import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check current session
  const checkSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
    } catch (error) {
      console.error('Error checking session:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [checkSession]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear bookmarks from localStorage
      localStorage.removeItem('anime_bookmarks');
      localStorage.removeItem('manga_bookmarks');
      
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    signOut,
    refreshSession: checkSession
  };
} 