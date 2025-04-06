
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TabNavigation from "@/components/TabNavigation";
import GenreCloud from "@/components/GenreCloud";
import RetroGameAnimation from "@/components/RetroGameAnimation";
import Footer from "@/components/Footer";
import RetroLoader from "@/components/RetroLoader";
import { getTopAnime, getSeasonalAnime, getUpcomingAnime } from "@/services/animeService";
import { Anime } from "@/types/anime";

const Index = () => {
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [seasonalAnime, setSeasonalAnime] = useState<Anime[]>([]);
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([]);
  
  const [loading, setLoading] = useState({
    top: true,
    seasonal: true,
    upcoming: true
  });
  
  const [error, setError] = useState({
    top: null as string | null,
    seasonal: null as string | null,
    upcoming: null as string | null
  });

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time (min 1.5 seconds for loader visibility)
    const minLoadTime = 1500;
    const startTime = Date.now();

    const fetchData = async () => {
      try {
        // Fetch top anime
        const topResponse = await getTopAnime(1, 12);
        // Make sure we have a valid array
        setTopAnime(topResponse?.data || []);
        setLoading(prev => ({ ...prev, top: false }));
      } catch (err) {
        console.error("Failed to fetch top anime:", err);
        setError(prev => ({ ...prev, top: "Failed to load top anime" }));
        setLoading(prev => ({ ...prev, top: false }));
        // Initialize with empty array to prevent undefined
        setTopAnime([]);
      }

      try {
        // Fetch seasonal anime
        const seasonalResponse = await getSeasonalAnime();
        // Make sure we have a valid array
        setSeasonalAnime(seasonalResponse?.data || []);
        setLoading(prev => ({ ...prev, seasonal: false }));
      } catch (err) {
        console.error("Failed to fetch seasonal anime:", err);
        setError(prev => ({ ...prev, seasonal: "Failed to load seasonal anime" }));
        setLoading(prev => ({ ...prev, seasonal: false }));
        // Initialize with empty array to prevent undefined
        setSeasonalAnime([]);
      }

      try {
        // Fetch upcoming anime
        const upcomingResponse = await getUpcomingAnime(1, 12);
        // Make sure we have a valid array
        setUpcomingAnime(upcomingResponse?.data || []);
        setLoading(prev => ({ ...prev, upcoming: false }));
      } catch (err) {
        console.error("Failed to fetch upcoming anime:", err);
        setError(prev => ({ ...prev, upcoming: "Failed to load upcoming anime" }));
        setLoading(prev => ({ ...prev, upcoming: false }));
        // Initialize with empty array to prevent undefined
        setUpcomingAnime([]);
      }

      // Ensure minimum loading time for better UX
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);
      
      setTimeout(() => {
        setPageLoading(false);
      }, remainingTime);
    };

    fetchData();
  }, []);

  // Show retro loader while page is loading
  if (pageLoading) {
    return <RetroLoader />;
  }

  return (
    <div className="min-h-screen bg-cyber-background noise-bg">
      <Navbar />
      
      {/* Full viewport hero section with no extra padding */}
      <HeroSection />
      
      {/* Tabbed content - moved below hero section with no padding-top */}
      <div className="container mx-auto px-4">
        <TabNavigation
          topAnime={topAnime}
          seasonalAnime={seasonalAnime}
          upcomingAnime={upcomingAnime}
          loading={loading}
          error={error}
        />
        
        {/* Genre Cloud section */}
        <div className="container mx-auto px-4 py-8 mb-4">
          <h2 className="text-2xl font-orbitron text-cyber-accent text-center mb-4">
            Explore By Genre
          </h2>
          <GenreCloud />
        </div>
        
        {/* Retro Game Animation section */}
        <div className="container mx-auto px-4 mb-8">
          <h2 className="text-2xl font-orbitron text-cyber-accent text-center mb-4">
            Retro Arcade Zone
          </h2>
          <RetroGameAnimation />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
