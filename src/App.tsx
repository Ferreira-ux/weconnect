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
import JobDetails from "./pages/JobDetails";
import Plans from "./pages/Plans";
import CandidateProfile from "./pages/CandidateProfile";
import CompanyDashboard from "./pages/CompanyDashboard";
import Chat from "./pages/Chat";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AccountSettings from "./pages/AccountSettings";
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
          <Route path="/vaga/:id" element={<JobDetails />} />
          <Route path="/planos" element={<Plans />} />
          <Route path="/perfil/candidato" element={<CandidateProfile />} />
          <Route path="/dashboard/empresa" element={<CompanyDashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/esqueci-senha" element={<ForgotPassword />} />
          <Route path="/redefinir-senha" element={<ResetPassword />} />
          <Route path="/configuracoes" element={<AccountSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
