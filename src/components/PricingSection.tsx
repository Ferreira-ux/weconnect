import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const plan = {
  name: "RH IA Pro",
  audience: "Para Empresas",
  price: "R$ 149,90",
  period: "/mês",
  description:
    "Receba os melhores candidatos já analisados pela IA, no topo da sua busca.",
  features: [
    "Top candidatos analisados pela IA no topo da busca",
    "Score de aderência (0-100) em cada currículo",
    "Resumo automático: pontos fortes e lacunas",
    "Filtros avançados por área, modelo e requisitos",
    "Vagas ilimitadas e em destaque",
    "Chat direto com candidatos",
    "Suporte prioritário",
  ],
  cta: "Assinar RH IA Pro",
  to: "/cadastro/empresa",
};

const PricingSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Plano
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4">
            Um plano. Os melhores talentos no topo.
          </h2>
          <p className="text-muted-foreground text-lg">
            Sua empresa contrata mais rápido com os currículos certos, ranqueados pela IA.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="relative rounded-2xl p-8 bg-gradient-hero text-primary-foreground shadow-glow animate-fade-in">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary-foreground text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Recomendado
            </div>

            <div className="text-xs font-semibold uppercase tracking-wider mb-3 text-primary-foreground/60">
              {plan.audience}
            </div>

            <h3 className="text-2xl font-bold mb-1 text-primary-foreground">
              {plan.name}
            </h3>

            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-4xl font-extrabold text-primary-foreground">
                {plan.price}
              </span>
              <span className="text-sm text-primary-foreground/60">
                {plan.period}
              </span>
            </div>

            <p className="text-sm mb-6 text-primary-foreground/80">
              {plan.description}
            </p>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-foreground" />
                  <span className="text-primary-foreground/90">{feature}</span>
                </li>
              ))}
            </ul>

            <Link to={plan.to}>
              <Button className="w-full h-11 font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                {plan.cta}
              </Button>
            </Link>

            <p className="text-xs text-primary-foreground/60 text-center mt-4">
              Candidatos usam a plataforma gratuitamente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
