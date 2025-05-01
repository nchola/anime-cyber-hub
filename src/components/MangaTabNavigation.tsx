import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MangaGrid from "@/components/MangaGrid";
import { Manga } from "@/types/manga";
import { Star } from "lucide-react";
import { useBookmark } from "@/hooks/use-bookmark";

interface MangaTabNavigationProps {
  topManga: Manga[];
  popularManga: Manga[];
  loading: {
    top: boolean;
    popular: boolean;
  };
  error: {
    top: string | null;
    popular: string | null;
  };
}

const MangaTabNavigation: React.FC<MangaTabNavigationProps> = ({
  topManga,
  popularManga,
  loading,
  error,
}) => {
  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        switch (e.key) {
          case "1":
            document.querySelector('[data-value="top-rated"]')?.dispatchEvent(
              new MouseEvent("click", { bubbles: true })
            );
            break;
          case "2":
            document.querySelector('[data-value="popular"]')?.dispatchEvent(
              new MouseEvent("click", { bubbles: true })
            );
            break;
          case "3":
            document.querySelector('[data-value="bookmarks"]')?.dispatchEvent(
              new MouseEvent("click", { bubbles: true })
            );
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Get bookmarked manga using the useBookmark hook
  const { bookmarks, getBookmarksByType } = useBookmark();
  const bookmarkedManga = getBookmarksByType('manga') as unknown as Manga[];

  return (
    <div className="container mx-auto px-4 pt-8">
      <Tabs defaultValue="top-rated" className="w-full">
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="manga-tab-container mb-6 w-full justify-start h-12 bg-cyber-background">
            <TabsTrigger 
              value="top-rated" 
              className="tab-item font-orbitron text-base px-6 transition-all duration-300"
              data-category="top-rated"
            >
              TOP RATED
            </TabsTrigger>
            <TabsTrigger 
              value="popular" 
              className="tab-item font-orbitron text-base px-6 transition-all duration-300"
              data-category="popular"
            >
              POPULAR
            </TabsTrigger>
            <TabsTrigger 
              value="bookmarks" 
              className="tab-item font-orbitron text-base px-6 transition-all duration-300 flex items-center gap-2"
              data-category="bookmarks"
            >
              <Star size={16} className="text-cyber-accent" /> BOOKMARKS
              {bookmarkedManga.length > 0 && (
                <span className="bg-cyber-accent text-cyber-background rounded-full px-2 py-0.5 text-xs">
                  {bookmarkedManga.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="top-rated" className="mt-0">
          <MangaGrid
            title=""
            mangaList={topManga}
            loading={loading.top}
            error={error.top}
            viewMoreLink="/manga"
          />
        </TabsContent>
        
        <TabsContent value="popular" className="mt-0">
          <MangaGrid
            title=""
            mangaList={popularManga}
            loading={loading.popular}
            error={error.popular}
            viewMoreLink="/manga/popular"
          />
        </TabsContent>
        
        <TabsContent value="bookmarks" className="mt-0">
          <MangaGrid
            title=""
            mangaList={bookmarkedManga}
            loading={false}
            error={bookmarkedManga.length === 0 ? "No bookmarks yet. Add some manga to your bookmarks!" : null}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MangaTabNavigation; 