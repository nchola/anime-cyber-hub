import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { addBookmark, removeBookmarkItem, isBookmarked } from '@/utils/bookmarkUtils';
import { BookmarkItem } from '@/types/bookmark';

interface BookmarkButtonProps {
  item: BookmarkItem;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline' | 'default';
  className?: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ 
  item, 
  size = 'md', 
  variant = 'ghost',
  className = ''
}) => {
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check if item is bookmarked on component mount
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const bookmarked = await isBookmarked(item.id, item.type);
        setIsBookmarkedState(bookmarked);
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

    checkBookmarkStatus();
  }, [item.id, item.type]);

  // Listen for storage events to update bookmark status
  useEffect(() => {
    const handleStorageChange = () => {
      const checkBookmarkStatus = async () => {
        try {
          const bookmarked = await isBookmarked(item.id, item.type);
          setIsBookmarkedState(bookmarked);
        } catch (error) {
          console.error('Error checking bookmark status after storage change:', error);
        }
      };

      checkBookmarkStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [item.id, item.type]);

  const handleToggleBookmark = async () => {
    setIsLoading(true);
    try {
      if (isBookmarkedState) {
        // Remove bookmark
        await removeBookmarkItem(item.id, item.type);
        setIsBookmarkedState(false);
        toast({
          title: "Bookmark Dihapus",
          description: `${item.title} telah dihapus dari bookmark`,
        });
      } else {
        // Add bookmark
        await addBookmark(item);
        setIsBookmarkedState(true);
        toast({
          title: "Bookmark Ditambahkan",
          description: `${item.title} telah ditambahkan ke bookmark`,
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengelola bookmark",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Determine button size classes
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <Button
      variant={variant}
      size="icon"
      className={`${sizeClasses[size]} ${className} ${isBookmarkedState ? 'text-cyber-accent' : 'text-white'}`}
      onClick={handleToggleBookmark}
      disabled={isLoading}
      aria-label={isBookmarkedState ? "Hapus bookmark" : "Tambahkan bookmark"}
    >
      {isBookmarkedState ? (
        <BookmarkCheck className="h-4 w-4 sm:h-5 sm:w-5" />
      ) : (
        <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
      )}
    </Button>
  );
};

export default BookmarkButton; 