import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AnimeGrid from "@/components/AnimeGrid";
import { Anime } from "@/types/anime";
import { Star } from "lucide-react";
import { useBookmark } from "@/hooks/use-bookmark";

interface TabNavigationProps {
  topAnime: Anime[];
  seasonalAnime: Anime[];
  upcomingAnime: Anime[];
  loading: {
    top: boolean;
    seasonal: boolean;
    upcoming: boolean;
  };
  error: {
    top: string | null;
    seasonal: string | null;
    upcoming: string | null;
  };
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  topAnime,
  seasonalAnime,
  upcomingAnime,
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
            document.querySelector('[data-value="seasonal"]')?.dispatchEvent(
              new MouseEvent("click", { bubbles: true })
            );
            break;
          case "3":
            document.querySelector('[data-value="upcoming"]')?.dispatchEvent(
              new MouseEvent("click", { bubbles: true })
            );
            break;
          case "4":
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

  // Get bookmarked anime using the useBookmark hook
  const { bookmarks, getBookmarksByType } = useBookmark();
  const bookmarkedAnime = getBookmarksByType('anime');

  return (
    <div className="container mx-auto px-4 pt-8">
      <Tabs defaultValue="top-rated" className="w-full">
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="anime-tab-container mb-6 w-full justify-start h-12 bg-cyber-background">
            <TabsTrigger 
              value="top-rated" 
              className="tab-item font-orbitron text-base px-6 transition-all duration-300"
              data-category="top-rated"
            >
              TOP RATED
            </TabsTrigger>
            <TabsTrigger 
              value="seasonal" 
              className="tab-item font-orbitron text-base px-6 transition-all duration-300"
              data-category="seasonal"
            >
              SEASONAL
            </TabsTrigger>
            <TabsTrigger 
              value="upcoming" 
              className="tab-item font-orbitron text-base px-6 transition-all duration-300"
              data-category="upcoming"
            >
              UPCOMING
            </TabsTrigger>
            <TabsTrigger 
              value="bookmarks" 
              className="tab-item font-orbitron text-base px-6 transition-all duration-300 flex items-center gap-2"
              data-category="bookmarks"
            >
              <Star size={16} className="text-cyber-accent" /> BOOKMARKS
              {bookmarkedAnime.length > 0 && (
                <span className="bg-cyber-accent text-cyber-background rounded-full px-2 py-0.5 text-xs">
                  {bookmarkedAnime.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="top-rated" className="mt-0">
          <AnimeGrid
            title=""
            animeList={topAnime}
            loading={loading.top}
            error={error.top}
            viewMoreLink="/anime"
          />
        </TabsContent>
        
        <TabsContent value="seasonal" className="mt-0">
          <AnimeGrid
            title=""
            animeList={seasonalAnime}
            loading={loading.seasonal}
            error={error.seasonal}
            viewMoreLink="/seasonal"
          />
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-0">
          <AnimeGrid
            title=""
            animeList={upcomingAnime}
            loading={loading.upcoming}
            error={error.upcoming}
            viewMoreLink="/upcoming"
          />
        </TabsContent>
        
        <TabsContent value="bookmarks" className="mt-0">
          <AnimeGrid
            title=""
            animeList={bookmarkedAnime}
            loading={false}
            error={bookmarkedAnime.length === 0 ? "No bookmarks yet. Add some anime to your bookmarks!" : null}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabNavigation;
