
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AnimeDetail from "./pages/AnimeDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// The correct way to use TooltipProvider is to wrap it inside BrowserRouter
// This prevents the hook usage error we're seeing
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
