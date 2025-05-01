import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAnimeById } from "@/services/animeService";
import { Anime } from "@/types/anime";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, Calendar, Clock, BarChart, Users, Tv } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import BookmarkButton from "@/components/BookmarkButton";

const AnimeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getAnimeById(parseInt(id));
        setAnime(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch anime details:", err);
        setError("Failed to load anime details");
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

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

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-cyber-background noise-bg">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="bg-cyber-background/50 rounded-lg p-8 border border-cyber-accent/20 max-w-md mx-auto">
            <h2 className="text-2xl font-orbitron text-cyber-accent mb-4">
              {error || "Anime not found"}
            </h2>
            <p className="text-gray-400 mb-6">
              We couldn't find the anime you're looking for. It might not exist or there was an error loading the data.
            </p>
            <Link to="/">
              <Button className="bg-cyber-accent text-cyber-background">
                Return to Home
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
      
      {/* Background image with overlay */}
      <div className="relative pt-16">
        <div 
          className="absolute top-0 left-0 right-0 h-[400px] bg-cover bg-center opacity-20 blur-sm"
          style={{ backgroundImage: `url(${anime.images.jpg.large_image_url})` }}
        />
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-cyber-background/50 via-cyber-background/70 to-cyber-background" />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Anime Image */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="cyber-card p-1.5">
                <img 
                  src={anime.images.jpg.large_image_url} 
                  alt={anime.title}
                  className="w-full rounded aspect-[3/4] object-cover" 
                />
              </div>
              
              <div className="mt-6 space-y-3">
                <BookmarkButton
                  itemId={anime.mal_id}
                  itemType="anime"
                  itemData={anime}
                  variant="button"
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Anime Details */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-2">
                {anime.title_english || anime.title}
              </h1>
              
              <h2 className="text-lg text-gray-400 mb-4">
                {anime.title_japanese}
              </h2>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {anime.genres.map((genre) => (
                  <span 
                    key={genre.mal_id}
                    className="text-sm font-medium py-1 px-3 rounded-full bg-gradient-to-r from-cyber-purple/30 to-cyber-background/60 text-cyber-accent border border-cyber-accent/30"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {anime.score > 0 && (
                  <div className="bg-cyber-background/50 p-3 rounded-md border border-cyber-accent/20 flex items-center gap-2">
                    <Star size={18} className="text-cyber-accent" />
                    <div>
                      <p className="text-xs text-gray-400">Score</p>
                      <p className="text-white font-orbitron">{anime.score.toFixed(1)}</p>
                    </div>
                  </div>
                )}
                
                <div className="bg-cyber-background/50 p-3 rounded-md border border-cyber-accent/20 flex items-center gap-2">
                  <Tv size={18} className="text-cyber-accent" />
                  <div>
                    <p className="text-xs text-gray-400">Episodes</p>
                    <p className="text-white font-orbitron">{anime.episodes || "Unknown"}</p>
                  </div>
                </div>
                
                <div className="bg-cyber-background/50 p-3 rounded-md border border-cyber-accent/20 flex items-center gap-2">
                  <BarChart size={18} className="text-cyber-accent" />
                  <div>
                    <p className="text-xs text-gray-400">Rank</p>
                    <p className="text-white font-orbitron">#{anime.rank || "N/A"}</p>
                  </div>
                </div>
                
                <div className="bg-cyber-background/50 p-3 rounded-md border border-cyber-accent/20 flex items-center gap-2">
                  <Users size={18} className="text-cyber-accent" />
                  <div>
                    <p className="text-xs text-gray-400">Popularity</p>
                    <p className="text-white font-orbitron">#{anime.popularity || "N/A"}</p>
                  </div>
                </div>
                
                <div className="bg-cyber-background/50 p-3 rounded-md border border-cyber-accent/20 flex items-center gap-2">
                  <Clock size={18} className="text-cyber-accent" />
                  <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-white font-orbitron">{anime.duration || "Unknown"}</p>
                  </div>
                </div>
                
                <div className="bg-cyber-background/50 p-3 rounded-md border border-cyber-accent/20 flex items-center gap-2">
                  <Calendar size={18} className="text-cyber-accent" />
                  <div>
                    <p className="text-xs text-gray-400">Season</p>
                    <p className="text-white font-orbitron">
                      {anime.season ? `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year || ""}` : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Synopsis */}
              <div className="mb-8">
                <h3 className="text-xl font-orbitron text-cyber-accent mb-3">Synopsis</h3>
                <p className="text-gray-300 leading-relaxed">
                  {anime.synopsis ? anime.synopsis.replace(/\[Written by MAL Rewrite\]$/g, "") : "No description found for this anime series."}
                </p>
              </div>
              {anime.studios && anime.studios.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-orbitron text-cyber-accent mb-3">Studios</h3>
                  <div className="flex gap-2">
                    {anime.studios.map((studio) => (
                      <span key={studio.mal_id} className="text-white bg-cyber-background/70 px-3 py-1 rounded-md border border-cyber-accent/20">
                        {studio.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Trailer */}
              {anime.trailer && anime.trailer.youtube_id && (
                <div className="mb-8">
                  <h3 className="text-xl font-orbitron text-cyber-accent mb-3">Trailer</h3>
                  <div className="cyber-card p-1">
                    <div className="aspect-video rounded overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                        title={`${anime.title} Trailer`}
                        className="w-full h-full"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
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

export default AnimeDetail;
