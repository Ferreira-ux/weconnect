import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft, MapPin, Building2, Clock, Briefcase, Zap, Loader2, CheckCircle, DollarSign,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
        setUserRole(roleData?.role || null);

        if (roleData?.role === "candidate") {
          const { data: cand } = await supabase.from("candidates").select("id").eq("user_id", user.id).maybeSingle();
          if (cand) {
            const { data: app } = await supabase.from("applications").select("id").eq("job_id", id!).eq("candidate_id", cand.id).maybeSingle();
            if (app) setApplied(true);
          }
        }
      }

      const { data, error } = await supabase
        .from("jobs")
        .select("*, companies(company_name, sector)")
        .eq("id", id!)
        .maybeSingle();

      if (error || !data) {
        navigate("/vagas");
        return;
      }
      setJob(data);
      setLoading(false);
    };
    init();
  }, [id]);

  const handleApply = async () => {
    if (!userId) { navigate("/login"); return; }
    if (userRole !== "candidate") {
      toast({ title: "Apenas candidatos podem se candidatar", variant: "destructive" });
      return;
    }

    setApplying(true);
    try {
      const { data: cand } = await supabase.from("candidates").select("id").eq("user_id", userId).maybeSingle();
      if (!cand) { navigate("/perfil/candidato"); return; }

      const { error } = await supabase.from("applications").insert({ job_id: id!, candidate_id: cand.id });
      if (error) throw error;

      setApplied(true);
      toast({ title: "Candidatura enviada com sucesso!" });

      // Notify company
      if (job?.companies?.user_id) {
        await supabase.from("notifications").insert({
          user_id: job.companies.user_id,
          type: "application_received",
          title: "Nova candidatura",
          message: `Um candidato se inscreveu para "${job.title}".`,
          reference_id: id!,
        });
      }
    } catch (err: any) {
      toast({ title: "Erro ao se candidatar", description: err.message, variant: "destructive" });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/vagas" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" /> Voltar às vagas
          </Link>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {job.boosted && (
                    <Badge className="bg-gradient-accent text-accent-foreground border-0 text-xs">
                      <Zap className="w-3 h-3 mr-1" /> Destaque
                    </Badge>
                  )}
                  <Badge variant="outline">{job.type}</Badge>
                  <Badge variant="secondary">{job.work_model || "Presencial"}</Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" /> {job.companies?.company_name || "Empresa"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" /> {job.area}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                {job.salary_range && (
                  <span className="flex items-center gap-1 text-xl font-bold text-foreground">
                    <DollarSign className="w-5 h-5 text-primary" /> {job.salary_range}
                  </span>
                )}
                {applied ? (
                  <Button disabled variant="outline" className="gap-2">
                    <CheckCircle className="w-4 h-4" /> Candidatado
                  </Button>
                ) : (
                  <Button onClick={handleApply} disabled={applying} className="bg-gradient-hero text-primary-foreground hover:opacity-90 gap-2">
                    {applying && <Loader2 className="w-4 h-4 animate-spin" />}
                    Candidatar-se
                  </Button>
                )}
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-foreground mb-3">Descrição da vaga</h2>
                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {job.description}
                </div>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-foreground mb-3">Requisitos</h2>
                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* Info cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border">
              <div className="p-4 rounded-xl bg-muted/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">Contrato</p>
                <p className="font-bold text-foreground">{job.type}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">Modelo</p>
                <p className="font-bold text-foreground">{job.work_model || "Presencial"}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">Área</p>
                <p className="font-bold text-foreground">{job.area}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">Local</p>
                <p className="font-bold text-foreground">{job.location}</p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 pt-6 border-t border-border text-center">
              {applied ? (
                <p className="text-muted-foreground flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" /> Você já se candidatou a esta vaga
                </p>
              ) : (
                <Button onClick={handleApply} disabled={applying} size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90 gap-2">
                  {applying && <Loader2 className="w-4 h-4 animate-spin" />}
                  Candidatar-se agora
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDetails;
