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
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[3/4] rounded-md" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-cyber-accent">{error}</p>
      </div>
    );
  }

  if (!mangaList || mangaList.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-cyber-accent">No manga found.</p>
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displayItems.map((manga, index) => (
          <MangaCard key={manga.mal_id} manga={manga} index={index} />
        ))}
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
