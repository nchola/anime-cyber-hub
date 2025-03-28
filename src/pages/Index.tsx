
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TabNavigation from "@/components/TabNavigation";
import GenreCloud from "@/components/GenreCloud";
import Footer from "@/components/Footer";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch top anime
        const topResponse = await getTopAnime(1, 12);
        setTopAnime(topResponse.data);
        setLoading(prev => ({ ...prev, top: false }));
      } catch (err) {
        console.error("Failed to fetch top anime:", err);
        setError(prev => ({ ...prev, top: "Failed to load top anime" }));
        setLoading(prev => ({ ...prev, top: false }));
      }

      try {
        // Fetch seasonal anime
        const seasonalResponse = await getSeasonalAnime();
        setSeasonalAnime(seasonalResponse.data);
        setLoading(prev => ({ ...prev, seasonal: false }));
      } catch (err) {
        console.error("Failed to fetch seasonal anime:", err);
        setError(prev => ({ ...prev, seasonal: "Failed to load seasonal anime" }));
        setLoading(prev => ({ ...prev, seasonal: false }));
      }

      try {
        // Fetch upcoming anime
        const upcomingResponse = await getUpcomingAnime(1, 12);
        setUpcomingAnime(upcomingResponse.data);
        setLoading(prev => ({ ...prev, upcoming: false }));
      } catch (err) {
        console.error("Failed to fetch upcoming anime:", err);
        setError(prev => ({ ...prev, upcoming: "Failed to load upcoming anime" }));
        setLoading(prev => ({ ...prev, upcoming: false }));
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-cyber-background noise-bg">
      <Navbar />
      
      <div className="pt-16"> {/* Padding top for navbar */}
        <HeroSection />
        
        <div className="container mx-auto px-4 py-4">
          <h2 className="text-xl font-orbitron text-cyber-accent text-center mb-2">
            Explore By Genre
          </h2>
          <GenreCloud />
        </div>
        
        <TabNavigation
          topAnime={topAnime}
          seasonalAnime={seasonalAnime}
          upcomingAnime={upcomingAnime}
          loading={loading}
          error={error}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
