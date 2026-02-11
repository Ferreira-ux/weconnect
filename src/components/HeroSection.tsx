import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const stats = [
  { icon: Users, value: "10.000+", label: "Candidatos" },
  { icon: Building2, value: "2.500+", label: "Empresas" },
  { icon: TrendingUp, value: "8.000+", label: "Contratações" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Profissionais colaborando"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6 animate-fade-in">
            <TrendingUp className="w-4 h-4" />
            Plataforma #1 de empregos do Brasil
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Conectamos você ao{" "}
            <span className="text-accent">emprego ideal</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/70 mb-8 leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Seja candidato buscando oportunidades ou empresa procurando talentos,
            o Empregaí simplifica a conexão perfeita.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/cadastro/candidato">
              <Button size="lg" className="bg-gradient-accent text-accent-foreground hover:opacity-90 shadow-accent-glow text-base px-8 h-12 w-full sm:w-auto">
                Sou Candidato
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/cadastro/empresa">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8 h-12 w-full sm:w-auto">
                Sou Empresa
                <Building2 className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 md:gap-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</div>
                <div className="text-sm text-primary-foreground/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
