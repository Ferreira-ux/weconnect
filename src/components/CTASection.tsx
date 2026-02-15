import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary-foreground/5 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary-foreground/5 translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-6 max-w-3xl mx-auto leading-tight">
          Não espere pelo diploma. Comece agora.
        </h2>
        <p className="text-lg text-primary-foreground/70 mb-10 max-w-xl mx-auto">
          Empresas de médio e grande porte estão buscando pessoas com vontade de trabalhar. Cadastre-se gratuitamente.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/cadastro/candidato">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-8 h-12">
              Criar Conta Grátis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/vagas">
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8 h-12">
              Ver Vagas Disponíveis
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
