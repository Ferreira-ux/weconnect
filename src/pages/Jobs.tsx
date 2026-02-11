import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search, MapPin, Building2, Clock, Zap, Bookmark,
} from "lucide-react";

const mockJobs = [
  {
    id: 1, title: "Desenvolvedor Full Stack", company: "TechCorp", location: "São Paulo, SP",
    type: "CLT", remote: true, salary: "R$ 8.000 - R$ 12.000", area: "Tecnologia da Informação",
    boosted: true, posted: "2 horas atrás",
    requirements: "React, Node.js, TypeScript, PostgreSQL",
  },
  {
    id: 2, title: "Analista de Marketing Digital", company: "MarketPro", location: "Rio de Janeiro, RJ",
    type: "CLT", remote: false, salary: "R$ 5.000 - R$ 7.000", area: "Marketing",
    boosted: true, posted: "5 horas atrás",
    requirements: "Google Ads, Meta Ads, SEO, Analytics",
  },
  {
    id: 3, title: "Designer UX/UI", company: "DesignHub", location: "Remoto",
    type: "PJ", remote: true, salary: "R$ 6.000 - R$ 10.000", area: "Design",
    boosted: false, posted: "1 dia atrás",
    requirements: "Figma, Design System, Prototipação",
  },
  {
    id: 4, title: "Gerente de Projetos", company: "ConsultMax", location: "Curitiba, PR",
    type: "CLT", remote: false, salary: "R$ 10.000 - R$ 14.000", area: "Administração",
    boosted: false, posted: "2 dias atrás",
    requirements: "Scrum, PMP, Gestão de equipes",
  },
  {
    id: 5, title: "Enfermeiro(a)", company: "Hospital Vida", location: "Belo Horizonte, MG",
    type: "CLT", remote: false, salary: "R$ 4.500 - R$ 6.000", area: "Saúde",
    boosted: false, posted: "3 dias atrás",
    requirements: "COREN ativo, experiência em UTI",
  },
  {
    id: 6, title: "Engenheiro de Dados", company: "DataFlow", location: "Remoto",
    type: "PJ", remote: true, salary: "R$ 12.000 - R$ 18.000", area: "Tecnologia da Informação",
    boosted: false, posted: "4 dias atrás",
    requirements: "Python, Spark, AWS, SQL",
  },
];

const Jobs = () => {
  const [search, setSearch] = useState("");

  const filtered = mockJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
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

          {/* Job list */}
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
                        <Building2 className="w-3.5 h-3.5" /> {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {job.posted}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      <span className="font-medium text-foreground">Requisitos:</span> {job.requirements}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-lg font-bold text-foreground whitespace-nowrap">{job.salary}</span>
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

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">Nenhuma vaga encontrada</p>
              <p className="text-sm">Tente buscar com outros termos</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;
