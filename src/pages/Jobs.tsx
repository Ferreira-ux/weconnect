import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search, MapPin, Building2, Clock, Zap, Bookmark, Loader2, Briefcase,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  type: string;
  work_model: string;
  remote: boolean;
  salary_range: string | null;
  area: string;
  boosted: boolean;
  created_at: string;
  requirements: string | null;
}

const Jobs = () => {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [workModelFilter, setWorkModelFilter] = useState("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();
        setUserRole(roleData?.role || null);

        // Load already-applied jobs
        if (roleData?.role === "candidate") {
          const { data: candidateData } = await supabase
            .from("candidates")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();
          if (candidateData) {
            const { data: apps } = await supabase
              .from("applications")
              .select("job_id")
              .eq("candidate_id", candidateData.id);
            if (apps) {
              setAppliedJobs(new Set(apps.map((a) => a.job_id)));
            }
          }
        }
      }

      const { data, error } = await supabase
        .from("jobs")
        .select("id, title, location, type, work_model, remote, salary_range, area, boosted, created_at, requirements, companies(company_name)")
        .eq("is_active", true)
        .order("boosted", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error && data) {
        setJobs(
          data.map((j: any) => ({
            ...j,
            company_name: j.companies?.company_name || "Empresa",
          }))
        );
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleApply = async (jobId: string) => {
    if (!userId) {
      toast({ title: "Faça login para se candidatar", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (userRole !== "candidate") {
      toast({ title: "Apenas candidatos podem se candidatar", variant: "destructive" });
      return;
    }

    setApplyingJobId(jobId);
    try {
      const { data: candidateData } = await supabase
        .from("candidates")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (!candidateData) {
        toast({ title: "Complete seu perfil de candidato primeiro", variant: "destructive" });
        navigate("/perfil/candidato");
        return;
      }

      const { data: inserted, error } = await supabase
        .from("applications")
        .insert({ job_id: jobId, candidate_id: candidateData.id })
        .select("id")
        .single();

      if (error) throw error;

      setAppliedJobs((prev) => new Set(prev).add(jobId));
      toast({ title: "Candidatura enviada com sucesso!" });

      // Fire-and-forget AI analysis for this application
      if (inserted?.id) {
        supabase.functions.invoke("analyze-applications", { body: { application_id: inserted.id } }).catch(() => {});
      }

      // Notify company
      const job = jobs.find((j) => j.id === jobId);
      if (job) {
        const { data: jobData } = await supabase
          .from("jobs")
          .select("company_id, companies(user_id)")
          .eq("id", jobId)
          .maybeSingle();
        if (jobData?.companies?.user_id) {
          await supabase.from("notifications").insert({
            user_id: (jobData.companies as any).user_id,
            type: "application_received",
            title: "Nova candidatura",
            message: `Um candidato se inscreveu para a vaga "${job.title}".`,
            reference_id: jobId,
          });
        }
      }
    } catch (err: any) {
      toast({ title: "Erro ao se candidatar", description: err.message, variant: "destructive" });
    } finally {
      setApplyingJobId(null);
    }
  };

  const filtered = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company_name.toLowerCase().includes(search.toLowerCase());
    const matchesArea = areaFilter === "all" || j.area.toLowerCase() === areaFilter.toLowerCase();
    const matchesType = typeFilter === "all" || j.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesWorkModel = workModelFilter === "all" || j.work_model?.toLowerCase() === workModelFilter.toLowerCase();
    return matchesSearch && matchesArea && matchesType && matchesWorkModel;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              Vagas Disponíveis
            </h1>
            <p className="text-muted-foreground text-lg">
              Encontre a oportunidade perfeita para sua carreira.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-8 max-w-5xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cargo ou empresa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-full md:w-40 h-11">
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                <SelectItem value="tecnologia">Tecnologia</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="saúde">Saúde</SelectItem>
                <SelectItem value="vendas">Vendas</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="rh">RH</SelectItem>
                <SelectItem value="educação">Educação</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40 h-11">
                <SelectValue placeholder="Contrato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="clt">CLT</SelectItem>
                <SelectItem value="pj">PJ</SelectItem>
                <SelectItem value="estágio">Estágio</SelectItem>
                <SelectItem value="jovem aprendiz">Jovem Aprendiz</SelectItem>
                <SelectItem value="freelancer">Freelancer</SelectItem>
                <SelectItem value="temporário">Temporário</SelectItem>
              </SelectContent>
            </Select>
            <Select value={workModelFilter} onValueChange={setWorkModelFilter}>
              <SelectTrigger className="w-full md:w-40 h-11">
                <SelectValue placeholder="Modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="remoto">Remoto</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="híbrido">Híbrido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Job list */}
          {!loading && (
            <div className="max-w-5xl mx-auto space-y-4">
              {filtered.map((job, i) => (
                <div
                  key={job.id}
                  className={`group p-6 rounded-2xl border transition-all duration-300 animate-fade-in ${
                    job.boosted
                      ? "bg-accent/5 border-accent/30 shadow-accent-glow/20"
                      : "bg-card border-border hover:border-primary/30 hover:shadow-lg"
                  }`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {job.boosted && (
                          <Badge className="bg-gradient-accent text-accent-foreground border-0 text-xs">
                            <Zap className="w-3 h-3 mr-1" /> Destaque
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">{job.type}</Badge>
                        <Badge variant="secondary" className="text-xs">
                          {job.work_model || "Presencial"}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        <Link to={`/vaga/${job.id}`} className="hover:underline">{job.title}</Link>
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" /> {job.company_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: ptBR })}
                        </span>
                      </div>
                      {job.requirements && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          <span className="font-medium text-foreground">Requisitos:</span> {job.requirements}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {job.salary_range && (
                        <span className="text-lg font-bold text-foreground whitespace-nowrap">{job.salary_range}</span>
                      )}
                      <div className="flex gap-2">
                         <Link to={`/vaga/${job.id}`}>
                           <Button variant="ghost" size="sm" className="text-primary hover:underline">
                             Ver detalhes
                           </Button>
                         </Link>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        {appliedJobs.has(job.id) ? (
                          <Button disabled variant="outline" className="text-muted-foreground">
                            Candidatado ✓
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleApply(job.id)}
                            disabled={applyingJobId === job.id}
                            className="bg-gradient-hero text-primary-foreground hover:opacity-90"
                          >
                            {applyingJobId === job.id && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
                            Candidatar-se
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">Nenhuma vaga encontrada</p>
              <p className="text-sm">Tente buscar com outros termos ou aguarde empresas publicarem novas vagas.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;
