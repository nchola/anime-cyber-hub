
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AnimeDetail from "./pages/AnimeDetail";
import NotFound from "./pages/NotFound";
import GenrePage from "./pages/GenrePage";
import SearchResults from "./pages/SearchResults";
import StubPage from "./pages/StubPage";
import AllAnime from "./pages/AllAnime";
import SeasonalAnime from "./pages/SeasonalAnime";
import UpcomingAnime from "./pages/UpcomingAnime";
import MangaPage from "./pages/MangaPage";
import MangaDetail from "./pages/MangaDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/genre/:id" element={<GenrePage />} />
        <Route path="/search/:query" element={<SearchResults />} />
        
        {/* Updated routes with proper pages */}
        <Route path="/anime" element={<AllAnime />} />
        <Route path="/seasonal" element={<SeasonalAnime />} />
        <Route path="/genre" element={<GenrePage />} />
        <Route path="/bookmark" element={<StubPage title="Bookmarks" />} />
        <Route path="/terms" element={<StubPage title="Terms of Service" />} />
        <Route path="/privacy" element={<StubPage title="Privacy Policy" />} />
        <Route path="/about" element={<StubPage title="About Us" />} />
        <Route path="/contact" element={<StubPage title="Contact Us" />} />
        <Route path="/top" element={<AllAnime />} />
        <Route path="/upcoming" element={<UpcomingAnime />} />
        <Route path="/manga" element={<MangaPage />} />
        <Route path="/manga/:id" element={<MangaDetail />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
