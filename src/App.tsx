import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import RegisterCandidate from "./pages/RegisterCandidate";
import RegisterCompany from "./pages/RegisterCompany";
import Jobs from "./pages/Jobs";
import Plans from "./pages/Plans";
import CandidateProfile from "./pages/CandidateProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro/candidato" element={<RegisterCandidate />} />
          <Route path="/cadastro/empresa" element={<RegisterCompany />} />
          <Route path="/vagas" element={<Jobs />} />
          <Route path="/planos" element={<Plans />} />
          <Route path="/perfil/candidato" element={<CandidateProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
