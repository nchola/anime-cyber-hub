
import React from "react";
import { Link } from "react-router-dom";
import { Manga } from "@/types/manga";
import MangaCard from "./MangaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MangaGridProps {
  title?: string;
  mangaList: Manga[];
  loading: boolean;
  error: string | null;
  viewMoreLink?: string;
  limitItems?: number;
  onViewMore?: () => void;
}

const MangaGrid: React.FC<MangaGridProps> = ({
  title,
  mangaList,
  loading,
  error,
  viewMoreLink,
  limitItems = 10,
  onViewMore,
}) => {
  // Loading placeholders with optimized rendering
  const renderSkeletons = () => {
    return Array.from({ length: limitItems }, (_, index) => (
      <div key={`skeleton-${index}`} className="cyber-card">
        <Skeleton className="aspect-[3/4] w-full rounded-t bg-gray-800" />
        <div className="p-4">
          <Skeleton className="h-5 w-2/3 rounded-md bg-gray-800" />
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-4 w-14 rounded-full bg-gray-800" />
            <Skeleton className="h-4 w-14 rounded-full bg-gray-800" />
          </div>
        </div>
      </div>
    ));
  };

  // Error state with fallback to cached content if available
  if (error) {
    return (
      <div className="text-center py-12 bg-cyber-background/40 rounded-lg border border-cyber-accent/20">
        <AlertCircle className="mx-auto h-12 w-12 text-cyber-accent mb-4" />
        <p className="text-xl font-medium text-cyber-accent">{error}</p>
        <p className="mt-2 text-gray-400">Try refreshing the page or check back later.</p>
        {/* Retry button */}
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-cyber-accent text-cyber-background hover:bg-cyber-accent/90"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Display items with limit
  const displayItems = mangaList?.slice(0, limitItems) || [];
  const hasMore = mangaList?.length > limitItems;

  return (
    <div className="mb-12">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-orbitron text-white">{title}</h2>
          {viewMoreLink && (
            <Link
              to={viewMoreLink}
              className="text-cyber-accent hover:text-cyber-accent/80 transition-colors font-medium text-sm"
            >
              View More →
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 md:gap-5">
        {loading
          ? renderSkeletons()
          : displayItems.length > 0
            ? displayItems.map((manga) => (
                <MangaCard key={`manga-${manga.mal_id}`} manga={manga} />
              ))
            : (
              <div className="col-span-full text-center py-12 text-gray-400 bg-cyber-background/40 rounded-lg border border-cyber-accent/20">
                <p className="text-xl mb-2">No manga found</p>
                <p className="text-sm">Try adjusting your search or check back later.</p>
              </div>
            )
        }
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          {onViewMore ? (
            <Button
              onClick={onViewMore}
              className="bg-cyber-accent/20 hover:bg-cyber-accent/30 text-cyber-accent border border-cyber-accent/30"
            >
              View More <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : viewMoreLink ? (
            <Button
              asChild
              className="bg-cyber-accent/20 hover:bg-cyber-accent/30 text-cyber-accent border border-cyber-accent/30"
            >
              <Link to={viewMoreLink}>
                View More <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default MangaGrid;
