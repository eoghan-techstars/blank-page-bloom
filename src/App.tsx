import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MentorDetail from "./pages/MentorDetail";
import NotFound from "./pages/NotFound";
import AdditionalMentors from "./pages/AdditionalMentors";
import Companies from "./pages/Companies";
import FounderDetail from "./pages/FounderDetail";
import CompanyDetail from "./pages/CompanyDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/mentor/:slug" element={<MentorDetail />} />
          <Route path="/additional-mentors" element={<AdditionalMentors />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/founders/:slug" element={<FounderDetail />} />
          <Route path="/companies/:slug" element={<CompanyDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
