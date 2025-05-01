import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBookmark } from '@/hooks/use-bookmark';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  itemId: number;
  itemType: 'anime' | 'manga';
  itemData: any;
  variant?: 'icon' | 'button';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  itemId,
  itemType,
  itemData,
  variant = 'icon',
  className,
  size = 'md'
}) => {
  const { toast } = useToast();
  const { isBookmarked, addBookmark, removeBookmark, isLoading } = useBookmark();
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);

  // Update local state when global state changes
  useEffect(() => {
    setIsBookmarkedState(isBookmarked(itemId));
  }, [isBookmarked, itemId]);

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoadingState(true);
    
    try {
      if (isBookmarkedState) {
        await removeBookmark(itemId, itemType);
        setIsBookmarkedState(false);
        toast({
          title: "Removed from bookmarks",
          description: `${itemData.title_english || itemData.title} removed from your bookmarks`,
        });
      } else {
        // Create a bookmark item with the required properties
        const bookmarkItem = {
          id: itemId,
          title: itemData.title_english || itemData.title,
          image_url: itemData.images?.jpg?.large_image_url || '',
          type: itemType,
          ...itemData
        };
        
        await addBookmark(bookmarkItem);
        setIsBookmarkedState(true);
        toast({
          title: "Added to bookmarks",
          description: `${itemData.title_english || itemData.title} added to your bookmarks`,
        });
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingState(false);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };

  // Icon sizes
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggleBookmark}
        disabled={isLoadingState || isLoading}
        className={cn(
          "bg-black/70 rounded-full transition-all hover:bg-cyber-accent/90 hover:text-cyber-background",
          sizeClasses[size],
          className
        )}
        aria-label={isBookmarkedState ? "Remove from bookmarks" : "Add to bookmarks"}
      >
        {isBookmarkedState ? (
          <BookmarkCheck size={iconSizes[size]} className="text-cyber-accent" />
        ) : (
          <Bookmark size={iconSizes[size]} className="text-white" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={isLoadingState || isLoading}
      className={cn(
        "w-full border-cyber-accent text-cyber-accent font-orbitron flex gap-2 items-center justify-center py-2 px-4 rounded-md transition-all hover:bg-cyber-accent hover:text-cyber-background",
        className
      )}
    >
      {isBookmarkedState ? (
        <>
          <BookmarkCheck size={iconSizes[size]} />
          Remove from Bookmarks
        </>
      ) : (
        <>
          <Bookmark size={iconSizes[size]} />
          Add to Bookmarks
        </>
      )}
    </button>
  );
};

export default BookmarkButton; 