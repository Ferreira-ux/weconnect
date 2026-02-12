import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search, MapPin, Building2, Clock, Zap, Bookmark, Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  type: string;
  remote: boolean;
  salary_range: string | null;
  area: string;
  boosted: boolean;
  created_at: string;
  requirements: string | null;
}

const Jobs = () => {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, title, location, type, remote, salary_range, area, boosted, created_at, requirements, companies(company_name)")
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
    fetchJobs();
  }, []);

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company_name.toLowerCase().includes(search.toLowerCase())
  );

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
          <div className="flex flex-col md:flex-row gap-3 mb-8 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cargo ou empresa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-48 h-11">
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                <SelectItem value="ti">TI</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="saude">Saúde</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48 h-11">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="remote">Remoto</SelectItem>
                <SelectItem value="onsite">Presencial</SelectItem>
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
            <div className="max-w-4xl mx-auto space-y-4">
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
                      <div className="flex items-center gap-2 mb-2">
                        {job.boosted && (
                          <Badge className="bg-gradient-accent text-accent-foreground border-0 text-xs">
                            <Zap className="w-3 h-3 mr-1" /> Destaque
                          </Badge>
                        )}
                        {job.remote && (
                          <Badge variant="secondary" className="text-xs">Remoto</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">{job.type}</Badge>
                      </div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {job.title}
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
                        <p className="text-sm text-muted-foreground mt-2">
                          <span className="font-medium text-foreground">Requisitos:</span> {job.requirements}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {job.salary_range && (
                        <span className="text-lg font-bold text-foreground whitespace-nowrap">{job.salary_range}</span>
                      )}
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                          Candidatar-se
                        </Button>
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
