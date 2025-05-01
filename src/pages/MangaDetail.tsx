import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMangaById, getPopularMangaByGenre } from "@/services/mangaService";
import { Manga } from "@/types/manga";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, Calendar, Book, BarChart, Users, Bookmark, BookmarkCheck, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import MangaReader from "@/components/MangaReader";
import MangaGrid from "@/components/MangaGrid";
import BookmarkButton from "@/components/BookmarkButton";

const MangaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showReader, setShowReader] = useState(false);
  const [relatedManga, setRelatedManga] = useState<Manga[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMangaDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getMangaById(parseInt(id));
        setManga(response.data);
        
        // Check if manga is bookmarked
        const bookmarkedManga = JSON.parse(localStorage.getItem('bookmarkedManga') || '[]');
        const isFound = bookmarkedManga.some((item: Manga) => item.mal_id === response.data.mal_id);
        setIsBookmarked(isFound);
        
        // Fetch related manga if there's a genre
        if (response.data.genres && response.data.genres.length > 0) {
          fetchRelatedManga(response.data.genres[0].mal_id);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch manga details:", err);
        setError("Failed to load manga details");
        setLoading(false);
      }
    };

    const fetchRelatedManga = async (genreId: number) => {
      try {
        setRelatedLoading(true);
        const response = await getPopularMangaByGenre(genreId);
        // Filter out the current manga
        const filteredManga = response.data.filter((m: Manga) => m.mal_id !== parseInt(id || '0'));
        setRelatedManga(filteredManga.slice(0, 6));
        setRelatedLoading(false);
      } catch (err) {
        console.error("Failed to fetch related manga:", err);
        setRelatedLoading(false);
      }
    };

    fetchMangaDetails();
  }, [id]);

  const handleBookmark = () => {
    if (!manga) return;
    
    try {
      const bookmarkedManga = JSON.parse(localStorage.getItem('bookmarkedManga') || '[]');
      
      if (isBookmarked) {
        // Remove from bookmarks
        const updatedBookmarks = bookmarkedManga.filter((item: Manga) => item.mal_id !== manga.mal_id);
        localStorage.setItem('bookmarkedManga', JSON.stringify(updatedBookmarks));
        setIsBookmarked(false);
        toast({
          description: `${manga.title} removed from bookmarks`,
        });
      } else {
        // Add to bookmarks
        bookmarkedManga.push(manga);
        localStorage.setItem('bookmarkedManga', JSON.stringify(bookmarkedManga));
        setIsBookmarked(true);
        toast({
          description: `${manga.title} added to bookmarks`,
        });
      }
    } catch (error) {
      console.error('Error updating bookmarks:', error);
      toast({
        variant: "destructive",
        description: "Failed to update bookmarks",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-background noise-bg">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-full md:w-1/3 lg:w-1/4 aspect-[3/4] rounded-md bg-gray-800" />
            
            <div className="w-full md:w-2/3 lg:w-3/4">
              <Skeleton className="h-10 w-3/4 mb-4 bg-gray-800" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-20 rounded-full bg-gray-800" />
                <Skeleton className="h-6 w-20 rounded-full bg-gray-800" />
                <Skeleton className="h-6 w-20 rounded-full bg-gray-800" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Skeleton className="h-8 w-full bg-gray-800" />
                <Skeleton className="h-8 w-full bg-gray-800" />
                <Skeleton className="h-8 w-full bg-gray-800" />
                <Skeleton className="h-8 w-full bg-gray-800" />
              </div>
              <Skeleton className="h-32 w-full mb-6 bg-gray-800" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32 bg-gray-800" />
                <Skeleton className="h-10 w-32 bg-gray-800" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !manga) {
    return (
      <div className="min-h-screen bg-cyber-background noise-bg">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="bg-cyber-background/50 rounded-lg p-8 border border-cyber-accent/20 max-w-md mx-auto">
            <h2 className="text-2xl font-orbitron text-cyber-accent mb-4">
              {error || "Manga not found"}
            </h2>
            <p className="text-gray-400 mb-6">
              We couldn't find the manga you're looking for. It might not exist or there was an error loading the data.
            </p>
            <Link to="/manga">
              <Button className="bg-cyber-accent text-cyber-background">
                Return to Manga
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-background noise-bg">
      <Navbar />
      
      {/* Manga Reader Modal */}
      {showReader && manga && (
        <MangaReader manga={manga} onClose={() => setShowReader(false)} />
      )}
      
      {/* Background image with overlay */}
      <div className="relative pt-16">
        <div 
          className="absolute top-0 left-0 right-0 h-[400px] bg-cover bg-center opacity-20 blur-sm"
          style={{ backgroundImage: `url(${manga.images.jpg.large_image_url})` }}
        />
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-cyber-background/50 via-cyber-background/70 to-cyber-background" />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Quick Links Navigation */}
          <div className="mb-8 flex items-center text-sm text-gray-400">
            <Link to="/" className="hover:text-cyber-accent">Home</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to="/manga" className="hover:text-cyber-accent">Manga</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-cyber-accent truncate max-w-[200px]">
              {manga.title_english || manga.title}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Manga Image */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="cyber-card p-1.5">
                <img 
                  src={manga.images.jpg.large_image_url} 
                  alt={manga.title}
                  className="w-full rounded aspect-[3/4] object-cover" 
                />
              </div>
              
              <div className="mt-6 space-y-3">
                <BookmarkButton
                  itemId={manga.mal_id}
                  itemType="manga"
                  itemData={manga}
                  variant="button"
                  className="w-full"
                />

                <Button 
                  onClick={() => setShowReader(true)}
                  className="w-full bg-cyber-accent text-cyber-background font-orbitron flex gap-2 items-center justify-center"
                >
                  <Book size={16} />
                  Read Now
                </Button>
              </div>

              {/* Publication Info */}
              <div className="mt-6 bg-cyber-background/40 border border-cyber-accent/20 rounded-md p-4">
                <h3 className="text-cyber-accent font-orbitron text-sm mb-3">Publication Info</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white">{manga.type}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volumes:</span>
                    <span className="text-white">{manga.volumes || "?"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Chapters:</span>
                    <span className="text-white">{manga.chapters || "?"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white">{manga.status}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Published:</span>
                    <span className="text-white">{manga.published.string}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Manga Details */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-2">
                {manga.title_english || manga.title}
              </h1>
              
              {manga.title_japanese && (
                <h2 className="text-lg text-gray-400 mb-4">
                  {manga.title_japanese}
                </h2>
              )}
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {manga.genres.map((genre) => (
                  <Link
                    to={`/genre/${genre.mal_id}`}
                    key={genre.mal_id}
                    className="text-sm font-medium py-1 px-3 rounded-full bg-gradient-to-r from-cyber-purple/30 to-cyber-background/60 text-cyber-accent border border-cyber-accent/30 hover:from-cyber-purple/40 hover:border-cyber-accent/50 transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {manga.score > 0 && (
                  <div className="bg-cyber-background/50 p-3 rounded-md border border-cyber-accent/20 flex items-center gap-2">
                    <Star size={18} className="text-cyber-accent" />
                    <div>
                      <p className="text-xs text-gray-400">Score</p>
                      <p className="text-white font-orbitron">{manga.score.toFixed(1)}</p>
                    </div>
                  </div>
                )}
                
                <div className="bg-cyber-background/50 p-3 rounded-md border border-cyber-accent/20 flex items-center gap-2">
                  <Book size={18} className="text-cyber-accent" />
                  <div>
                    <p className="text-xs text-gray-400">Chapters</p>
                    <p className="text-white font-orbitron">{manga.chapters || "?"}</p>
                  </div>
                </div>
                
                <div className="bg-cyber-background/50 p-3 rounded-md border border-cyber-accent/20 flex items-center gap-2">
                  <BarChart size={18} className="text-cyber-accent" />
                  <div>
                    <p className="text-xs text-gray-400">Rank</p>
                    <p className="text-white font-orbitron">#{manga.rank || "N/A"}</p>
                  </div>
                </div>
                
                <div className="bg-cyber-background/50 p-3 rounded-md border border-cyber-accent/20 flex items-center gap-2">
                  <Users size={18} className="text-cyber-accent" />
                  <div>
                    <p className="text-xs text-gray-400">Popularity</p>
                    <p className="text-white font-orbitron">#{manga.popularity || "N/A"}</p>
                  </div>
                </div>
              </div>
              
              {/* Immersive Reading Preview */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-orbitron text-white">Immersive Reading Experience</h3>
                  <Button 
                    onClick={() => setShowReader(true)}
                    className="bg-cyber-accent text-cyber-background font-orbitron flex gap-2 items-center"
                  >
                    <Book size={16} /> Start Reading
                  </Button>
                </div>
                
                <div className="cyber-card p-1 mb-6">
                  <div 
                    className="relative aspect-[16/9] bg-cyber-background/50 border border-cyber-accent/20 rounded overflow-hidden bg-center bg-cover cursor-pointer"
                    onClick={() => setShowReader(true)}
                    style={{ backgroundImage: `url(${manga.images.jpg.large_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-cyber-background via-transparent to-transparent flex items-center justify-center">
                      <div className="absolute bottom-4 left-4 text-white">
                        <h4 className="text-lg font-orbitron">Dive into the story</h4>
                        <p className="text-sm text-gray-300">Click to start your reading journey</p>
                      </div>
                      <Button className="bg-cyber-accent/90 text-cyber-background">
                        Read Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tabbed Content */}
              <Tabs defaultValue="synopsis" className="mb-8">
                <TabsList className="bg-cyber-background/40 border-b border-cyber-accent/30">
                  <TabsTrigger value="synopsis" className="data-[state=active]:text-cyber-accent">Synopsis</TabsTrigger>
                  <TabsTrigger value="characters" className="data-[state=active]:text-cyber-accent">Characters</TabsTrigger>
                  <TabsTrigger value="chapters" className="data-[state=active]:text-cyber-accent">Chapters</TabsTrigger>
                </TabsList>
                
                <TabsContent value="synopsis" className="pt-4">
                  <p className="text-gray-300 leading-relaxed">
                    {manga.synopsis || "No synopsis available for this manga."}
                  </p>

                  {/* Authors & Publishers */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {manga.authors && manga.authors.length > 0 && (
                      <div className="bg-cyber-background/40 border border-cyber-accent/20 rounded-md p-4">
                        <h3 className="text-cyber-accent font-orbitron text-sm mb-3">Authors</h3>
                        <ul className="space-y-2">
                          {manga.authors.map((author) => (
                            <li key={author.mal_id} className="text-white">
                              {author.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {manga.serializations && manga.serializations.length > 0 && (
                      <div className="bg-cyber-background/40 border border-cyber-accent/20 rounded-md p-4">
                        <h3 className="text-cyber-accent font-orbitron text-sm mb-3">Publishers</h3>
                        <ul className="space-y-2">
                          {manga.serializations.map((publisher) => (
                            <li key={publisher.mal_id} className="text-white">
                              {publisher.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="characters" className="pt-4">
                  <p className="text-cyber-accent">Coming soon...</p>
                </TabsContent>
                
                <TabsContent value="chapters" className="pt-4">
                  <div className="bg-cyber-background/40 border border-cyber-accent/20 rounded-md p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-orbitron text-cyber-accent">Latest Chapters</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-cyber-accent/30 text-cyber-accent"
                        onClick={() => setShowReader(true)}
                      >
                        View All
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex justify-between items-center pb-3 border-b border-cyber-accent/10">
                          <div>
                            <button 
                              onClick={() => setShowReader(true)} 
                              className="text-white hover:text-cyber-accent"
                            >
                              Chapter {manga.chapters ? manga.chapters - index : 100 - index}
                            </button>
                            <p className="text-gray-400 text-sm">Released 2 days ago</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-cyber-accent/30 text-cyber-accent"
                            onClick={() => setShowReader(true)}
                          >
                            Read
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Related Manga */}
              {relatedManga.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-orbitron text-white mb-4">Related Manga</h3>
                  <MangaGrid 
                    mangaList={relatedManga}
                    loading={relatedLoading}
                    error={null}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MangaDetail;
