import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-background overflow-hidden">
      {/* Subtle decorative shapes */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/3 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10 pt-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            A plataforma que conecta talentos a oportunidades
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Encontre o{" "}
            <span className="text-primary">emprego ideal</span>{" "}
            para sua carreira
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Seja candidato buscando oportunidades ou empresa procurando talentos,
            o WeConnect+ simplifica a conexão perfeita.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/cadastro/candidato">
              <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90 shadow-glow text-base px-8 h-12 w-full sm:w-auto">
                Sou Candidato
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/cadastro/empresa">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-accent text-base px-8 h-12 w-full sm:w-auto">
                Sou Empresa
                <Building2 className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
