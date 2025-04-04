
import React from "react";
import { Manga } from "@/types/manga";
import MangaCard from "./MangaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface MangaGridProps {
  title?: string;
  mangaList: Manga[];
  loading: boolean;
  error: string | null;
  viewMoreLink?: string;
}

const MangaGrid: React.FC<MangaGridProps> = ({
  title,
  mangaList,
  loading,
  error,
  viewMoreLink,
}) => {
  console.log("MangaGrid rendering with:", { 
    title, 
    mangaListLength: mangaList?.length, 
    loading, 
    error 
  });

  // Loading placeholders
  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
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

  // Error state
  if (error) {
    return (
      <div className="text-center py-12 bg-cyber-background/40 rounded-lg border border-cyber-accent/20">
        <AlertCircle className="mx-auto h-12 w-12 text-cyber-accent mb-4" />
        <p className="text-xl font-medium text-cyber-accent">{error}</p>
        <p className="mt-2 text-gray-400">Try refreshing the page or check back later.</p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-orbitron text-white">{title}</h2>
          {viewMoreLink && (
            <a
              href={viewMoreLink}
              className="text-cyber-accent hover:text-cyber-accent/80 transition-colors font-medium text-sm"
            >
              View More →
            </a>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
        {loading
          ? renderSkeletons()
          : mangaList && mangaList.length > 0
            ? mangaList.map((manga) => (
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
    </div>
  );
};

export default MangaGrid;
