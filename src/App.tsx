
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AddWordForm } from "@/components/vocabulary/AddWordForm";
import { WordDetails } from "@/components/vocabulary/WordDetails";
import Dashboard from "@/pages/Dashboard";
import Vocabulary from "@/pages/Vocabulary";
import Games from "@/pages/Games";
import { WordQuizGame } from "@/components/games/WordQuizGame";
import { FlashCardsGame } from "@/components/games/FlashCardsGame";
import { WordMatchGame } from "@/components/games/WordMatchGame";
import { FillBlanksGame } from "@/components/games/FillBlanksGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="vocabulary" element={<Vocabulary />} />
              <Route path="vocabulary/add" element={<AddWordForm />} />
              <Route path="vocabulary/word/:id" element={<WordDetails />} />
              <Route path="games" element={<Games />} />
              <Route path="games/word-quiz" element={<WordQuizGame />} />
              <Route path="games/flash-cards" element={<FlashCardsGame />} />
              <Route path="games/word-match" element={<WordMatchGame />} />
              <Route path="games/fill-blanks" element={<FillBlanksGame />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
