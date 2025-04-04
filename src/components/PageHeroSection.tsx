
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Anime } from '@/types/anime';
import { Manga } from '@/types/manga';

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
}

const PageHeroSection: React.FC<PageHeroSectionProps> = ({
  title,
  subtitle,
  backgroundImage,
  actionButton,
  items,
  type = 'anime',
}) => {
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
      
      <div className="container relative z-10 mx-auto px-4 text-center">
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
          <div className="mt-10 flex items-center justify-center space-x-4 overflow-x-auto py-4">
            {items.slice(0, 5).map((item, index) => (
              <Link 
                key={item.mal_id} 
                to={`/${type}/${item.mal_id}`}
                className="group flex-shrink-0 transition-transform duration-300 hover:scale-105"
              >
                <div 
                  className="relative h-24 w-16 overflow-hidden rounded-md border border-cyber-accent/30 md:h-32 md:w-24"
                >
                  <img 
                    src={item.images?.jpg?.image_url || '/placeholder.svg'} 
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-1 text-center text-xs text-white">
                    {item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeroSection;
