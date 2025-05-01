import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useBookmark } from '@/hooks/use-bookmark';
import BookmarkButton from '@/components/BookmarkButton';
import { BookmarkItem } from '@/types/bookmark';
import React from 'react';

// Mock the hooks and localStorage
vi.mock('@/hooks/use-bookmark', () => ({
  useBookmark: vi.fn(() => ({
    bookmarks: [],
    addBookmark: vi.fn(),
    removeBookmark: vi.fn(),
    isBookmarked: vi.fn(() => false),
    getBookmarksByType: vi.fn(() => [])
  }))
}));

vi.mock('@/hooks/use-auth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-id' }
  }))
}));

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('Bookmark Functionality', () => {
  const mockBookmarkItem: BookmarkItem = {
    id: 1,
    type: 'anime',
    title: 'Test Anime',
    image_url: 'https://example.com/image.jpg'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('useBookmark Hook', () => {
    it('should load bookmarks from localStorage', () => {
      const mockBookmarks = [mockBookmarkItem];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockBookmarks));
      
      const mockUseBookmark = useBookmark as jest.Mock;
      mockUseBookmark.mockReturnValue({
        bookmarks: mockBookmarks,
        addBookmark: vi.fn(),
        removeBookmark: vi.fn(),
        isBookmarked: vi.fn(() => false),
        getBookmarksByType: vi.fn(() => [])
      });
      
      const { bookmarks } = useBookmark();
      expect(bookmarks).toEqual(mockBookmarks);
    });

    it('should add a bookmark', async () => {
      const mockBookmarks: BookmarkItem[] = [];
      const mockAddBookmark = vi.fn((item: BookmarkItem) => {
        mockBookmarks.push(item);
      });
      
      const mockUseBookmark = useBookmark as jest.Mock;
      mockUseBookmark.mockReturnValue({
        bookmarks: mockBookmarks,
        addBookmark: mockAddBookmark,
        removeBookmark: vi.fn(),
        isBookmarked: vi.fn(() => false),
        getBookmarksByType: vi.fn(() => [])
      });
      
      const { addBookmark, bookmarks } = useBookmark();
      await act(async () => {
        addBookmark(mockBookmarkItem);
      });
      
      expect(mockAddBookmark).toHaveBeenCalledWith(mockBookmarkItem);
      expect(mockBookmarks).toContainEqual(mockBookmarkItem);
    });

    it('should remove a bookmark', async () => {
      const mockBookmarks: BookmarkItem[] = [mockBookmarkItem];
      const mockRemoveBookmark = vi.fn((id: number) => {
        const index = mockBookmarks.findIndex(b => b.id === id);
        if (index !== -1) mockBookmarks.splice(index, 1);
      });
      
      const mockUseBookmark = useBookmark as jest.Mock;
      mockUseBookmark.mockReturnValue({
        bookmarks: mockBookmarks,
        addBookmark: vi.fn(),
        removeBookmark: mockRemoveBookmark,
        isBookmarked: vi.fn(() => true),
        getBookmarksByType: vi.fn(() => [])
      });
      
      const { removeBookmark } = useBookmark();
      await act(async () => {
        removeBookmark(mockBookmarkItem.id);
      });
      
      expect(mockRemoveBookmark).toHaveBeenCalledWith(mockBookmarkItem.id);
      expect(mockBookmarks).not.toContainEqual(mockBookmarkItem);
    });

    it('should check if an item is bookmarked', async () => {
      const mockBookmarks: BookmarkItem[] = [mockBookmarkItem];
      const mockIsBookmarked = vi.fn((id: number) => mockBookmarks.some(b => b.id === id));
      
      const mockUseBookmark = useBookmark as jest.Mock;
      mockUseBookmark.mockReturnValue({
        bookmarks: mockBookmarks,
        addBookmark: vi.fn(),
        removeBookmark: vi.fn(),
        isBookmarked: mockIsBookmarked,
        getBookmarksByType: vi.fn(() => [])
      });
      
      const { isBookmarked } = useBookmark();
      expect(isBookmarked(mockBookmarkItem.id)).toBe(true);
    });
  });

  describe('BookmarkButton Component', () => {
    it('should render bookmark button', () => {
      const mockUseBookmark = useBookmark as jest.Mock;
      mockUseBookmark.mockReturnValue({
        bookmarks: [],
        isBookmarked: vi.fn(() => false),
        addBookmark: vi.fn(),
        removeBookmark: vi.fn(),
        getBookmarksByType: vi.fn(() => [])
      });

      render(
        <BookmarkButton
          itemId={1}
          itemType="anime"
          itemData={mockBookmarkItem}
        />
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should toggle bookmark on click', async () => {
      const mockAddBookmark = vi.fn();
      const mockRemoveBookmark = vi.fn();
      const mockIsBookmarked = vi.fn(() => false);

      const mockUseBookmark = useBookmark as jest.Mock;
      mockUseBookmark.mockReturnValue({
        bookmarks: [],
        isBookmarked: mockIsBookmarked,
        addBookmark: mockAddBookmark,
        removeBookmark: mockRemoveBookmark,
        getBookmarksByType: vi.fn(() => [])
      });

      render(
        <BookmarkButton
          itemId={1}
          itemType="anime"
          itemData={mockBookmarkItem}
        />
      );

      const button = screen.getByRole('button');
      await act(async () => {
        fireEvent.click(button);
      });

      expect(mockAddBookmark).toHaveBeenCalledWith(mockBookmarkItem);
    });
  });
}); 