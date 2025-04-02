
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
        
        {/* New stub routes for navbar and footer links */}
        <Route path="/anime" element={<StubPage title="All Anime" />} />
        <Route path="/seasonal" element={<StubPage title="Seasonal Anime" />} />
        <Route path="/genre" element={<GenrePage />} />
        <Route path="/bookmark" element={<StubPage title="Bookmarks" />} />
        <Route path="/terms" element={<StubPage title="Terms of Service" />} />
        <Route path="/privacy" element={<StubPage title="Privacy Policy" />} />
        <Route path="/about" element={<StubPage title="About Us" />} />
        <Route path="/contact" element={<StubPage title="Contact Us" />} />
        <Route path="/top" element={<StubPage title="Top Anime" />} />
        <Route path="/upcoming" element={<StubPage title="Upcoming Anime" />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
