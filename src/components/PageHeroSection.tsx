import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Anime } from '@/types/anime';
import { Manga } from '@/types/manga';
import { useIsMobile } from '@/hooks/use-mobile';
import AnimatedCardCarousel from '@/components/AnimatedCardCarousel';

interface PageHeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  actionButton?: {
    label: string;
    link: string;
  };
  items?: Anime[] | Manga[];
  type?: 'anime' | 'manga';
  loading?: boolean;
  error?: string | null;
}

const PageHeroSection: React.FC<PageHeroSectionProps> = ({
  title,
  subtitle,
  backgroundImage,
  actionButton,
  items,
  type = 'anime',
  loading = false,
  error = null,
}) => {
  const isMobile = useIsMobile();

  // Render loading state
  if (loading) {
    return (
      <div className="relative bg-gradient-to-b from-cyber-background to-cyber-background/80 py-16 md:py-24">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <Skeleton className="mx-auto h-10 w-2/3 max-w-md rounded-md bg-gray-800" />
          <Skeleton className="mx-auto mt-4 h-6 w-1/2 max-w-sm rounded-md bg-gray-800" />
          <div className="mt-10 flex items-center justify-center space-x-4 overflow-x-auto py-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton 
                key={index}
                className="h-24 w-16 rounded-md bg-gray-800 flex-shrink-0 md:h-32 md:w-24" 
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="relative bg-gradient-to-b from-cyber-background to-cyber-background/80 py-16 md:py-24">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-cyber-accent mb-4" />
          <h2 className="mb-4 font-orbitron text-2xl font-bold text-cyber-accent md:text-3xl">
            {error}
          </h2>
          <p className="mx-auto max-w-md text-gray-400">
            Please try refreshing the page or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-b from-cyber-background to-cyber-background/80 py-16 md:py-24">
      {backgroundImage && (
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>
      )}
      
      <div className={`container relative z-10 mx-auto px-4 text-center ${isMobile ? 'scale-80' : ''}`}>
        <h1 className="mb-4 font-orbitron text-4xl font-bold text-cyber-accent md:text-5xl">
          {title}
        </h1>
        
        {subtitle && (
          <p className="mb-8 text-lg text-gray-300">
            {subtitle}
          </p>
        )}
        
        {actionButton && (
          <Button 
            asChild
            className="mt-4 bg-cyber-accent text-cyber-background hover:bg-cyber-accent/80"
          >
            <Link to={actionButton.link}>
              {actionButton.label}
            </Link>
          </Button>
        )}
        
        {items && items.length > 0 && (
          <div className="mt-10">
            <AnimatedCardCarousel 
              items={items as Anime[]} 
              type={type}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeroSection;
