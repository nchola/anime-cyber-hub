
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem
} from '@/components/ui/carousel';
import { getMangaImages } from '@/services/mangaService';
import { Manga } from '@/types/manga';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface MangaReaderProps {
  manga: Manga;
  onClose: () => void;
}

const MangaReader = ({ manga, onClose }: MangaReaderProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [api, setApi] = useState<any>(null);
  const { toast } = useToast();

  // Safe fallback images
  const fallbackImages = useMemo(() => [
    "https://cdn.myanimelist.net/images/manga/3/243675.jpg",
    "https://cdn.myanimelist.net/images/manga/1/268323.jpg",
    "https://cdn.myanimelist.net/images/manga/3/268228.jpg",
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
    "https://cdn.myanimelist.net/images/manga/3/188896.jpg"
  ], []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      setCurrentPage((prev) => {
        const newPage = prev < images.length - 1 ? prev + 1 : prev;
        if (api && newPage !== prev) {
          api.scrollTo(newPage);
        }
        return newPage;
      });
    } else if (event.key === 'ArrowLeft') {
      setCurrentPage((prev) => {
        const newPage = prev > 0 ? prev - 1 : prev;
        if (api && newPage !== prev) {
          api.scrollTo(newPage);
        }
        return newPage;
      });
    } else if (event.key === 'Escape') {
      onClose();
    }
  }, [images.length, onClose, api]);

  // Fetch manga images
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await getMangaImages(manga.mal_id);
        
        // Get image URLs from the response
        let mangaImages = response.data?.map((img: any) => 
          img?.jpg?.large_image_url || img?.jpg?.image_url
        ).filter(Boolean);
        
        // If no images found, use fallbacks
        if (!mangaImages || mangaImages.length === 0) {
          mangaImages = [...fallbackImages];
        }
        
        // Add the manga cover as first image
        const coverImage = manga.images.jpg.large_image_url;
        if (coverImage && !mangaImages.includes(coverImage)) {
          mangaImages.unshift(coverImage);
        }
        
        setImages(mangaImages);
      } catch (error) {
        console.error("Error fetching manga images:", error);
        toast({
          title: "Failed to load manga pages",
          description: "Using sample pages instead",
          variant: "destructive",
        });
        setImages([...fallbackImages]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [manga.mal_id, manga.images.jpg.large_image_url, fallbackImages, toast]);

  // Setup keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle zoom
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.6));
  };

  // Handle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullscreen(false);
      }
    }
  };

  // Ensure correct order of navigation
  useEffect(() => {
    if (api) {
      api.scrollTo(currentPage);
    }
  }, [currentPage, api]);
  
  // Handle image load errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    // Try to load a fallback image
    const randomFallbackIndex = Math.floor(Math.random() * fallbackImages.length);
    target.src = fallbackImages[randomFallbackIndex];
    target.onerror = null; // Prevent infinite loop if fallback also fails
  };

  return (
    <div className="fixed inset-0 z-50 bg-cyber-background/95 flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-cyber-accent/30">
        <div className="text-white font-orbitron">
          <h2 className="text-lg">{manga.title_english || manga.title}</h2>
          <p className="text-sm text-gray-400">Page {currentPage + 1} of {images.length}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleZoomOut}
            disabled={zoom <= 0.6}
            className="border-cyber-accent/30 text-cyber-accent"
          >
            <ZoomOut size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleZoomIn}
            disabled={zoom >= 2}
            className="border-cyber-accent/30 text-cyber-accent"
          >
            <ZoomIn size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleFullscreen}
            className="border-cyber-accent/30 text-cyber-accent"
          >
            <Monitor size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-red-500/20"
          >
            <X size={20} />
          </Button>
        </div>
      </div>
      
      {/* Reader Content */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="h-[80vh] w-2/3 max-w-xl bg-gray-800" />
          </div>
        ) : (
          <Carousel 
            orientation="horizontal" 
            className="w-full max-w-4xl mx-auto h-full"
            setApi={setApi}
            opts={{
              align: "center",
              containScroll: "trimSnaps"
            }}
          >
            <CarouselContent className="h-full">
              {images.map((src, index) => (
                <CarouselItem key={index} className="h-full flex items-center justify-center py-8">
                  <div 
                    className="h-full flex items-center justify-center"
                    style={{ transform: `scale(${zoom})` }}
                  >
                    <img 
                      src={src} 
                      alt={`Page ${index + 1}`} 
                      className="max-h-full max-w-full object-contain transition-transform"
                      onError={handleImageError}
                      loading={Math.abs(index - currentPage) < 2 ? "eager" : "lazy"}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => prev > 0 ? prev - 1 : prev)}
                disabled={currentPage === 0}
                className="bg-cyber-background/80 border-cyber-accent/30 text-cyber-accent"
              >
                <ChevronLeft size={24} />
              </Button>
            </div>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => prev < images.length - 1 ? prev + 1 : prev)}
                disabled={currentPage === images.length - 1}
                className="bg-cyber-background/80 border-cyber-accent/30 text-cyber-accent"
              >
                <ChevronRight size={24} />
              </Button>
            </div>
          </Carousel>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 flex justify-between items-center border-t border-cyber-accent/30">
        <Button 
          variant="outline"
          onClick={() => setCurrentPage(prev => prev > 0 ? prev - 1 : prev)}
          disabled={currentPage === 0}
          className="border-cyber-accent/30 text-cyber-accent"
        >
          <ChevronLeft size={16} className="mr-2" />
          Previous Page
        </Button>
        
        <div className="text-white text-sm">
          {currentPage + 1} / {images.length}
        </div>
        
        <Button 
          variant="outline"
          onClick={() => setCurrentPage(prev => prev < images.length - 1 ? prev + 1 : prev)}
          disabled={currentPage === images.length - 1}
          className="border-cyber-accent/30 text-cyber-accent"
        >
          Next Page
          <ChevronRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MangaReader;
