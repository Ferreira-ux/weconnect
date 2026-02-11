import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";

const plans = [
  {
    name: "Gratuito",
    audience: "Para Candidatos",
    price: "R$ 0",
    period: "/mês",
    description: "Comece a buscar oportunidades agora mesmo.",
    features: [
      "Criar perfil completo",
      "Buscar vagas disponíveis",
      "Candidatar-se a vagas",
      "Notificações por e-mail",
    ],
    cta: "Começar Grátis",
    to: "/cadastro/candidato",
    highlighted: false,
    icon: null,
  },
  {
    name: "Vaga+",
    audience: "Para Candidatos",
    price: "R$ 19,90",
    period: "/mês",
    description: "Destaque-se e consiga emprego mais rápido.",
    features: [
      "Tudo do plano Gratuito",
      "Currículo no topo das buscas",
      "Vagas enviadas antes de todos",
      "Saiba quem viu seu perfil",
      "Suporte prioritário",
    ],
    cta: "Assinar Vaga+",
    to: "/planos",
    highlighted: true,
    icon: Star,
  },
  {
    name: "Impulsionar",
    audience: "Para Empresas",
    price: "R$ 49,90",
    period: "/vaga",
    description: "Suas vagas vistas por mais candidatos.",
    features: [
      "Publicar vagas ilimitadas",
      "Vaga no topo da lista",
      "Seção \"Vagas em Destaque\"",
      "Relatórios de visualizações",
      "Mais candidaturas qualificadas",
    ],
    cta: "Impulsionar Vaga",
    to: "/cadastro/empresa",
    highlighted: false,
    icon: Zap,
  },
];

const PricingSection = () => {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">
            Planos
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4">
            Escolha o plano ideal para você
          </h2>
          <p className="text-muted-foreground text-lg">
            Opções flexíveis para candidatos e empresas crescerem mais rápido.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all duration-300 animate-fade-in ${
                plan.highlighted
                  ? "bg-gradient-hero text-primary-foreground shadow-glow scale-[1.02]"
                  : "bg-card border border-border hover:border-primary/30 hover:shadow-lg"
              }`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-accent text-accent-foreground text-xs font-bold uppercase tracking-wider">
                  Mais Popular
                </div>
              )}

              <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                plan.highlighted ? "text-primary-foreground/60" : "text-muted-foreground"
              }`}>
                {plan.audience}
              </div>

              <h3 className={`text-xl font-bold mb-1 ${
                plan.highlighted ? "text-primary-foreground" : "text-foreground"
              }`}>
                {plan.name}
              </h3>

              <div className="flex items-baseline gap-1 mb-3">
                <span className={`text-4xl font-extrabold ${
                  plan.highlighted ? "text-primary-foreground" : "text-foreground"
                }`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${
                  plan.highlighted ? "text-primary-foreground/60" : "text-muted-foreground"
                }`}>
                  {plan.period}
                </span>
              </div>

              <p className={`text-sm mb-6 ${
                plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}>
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      plan.highlighted ? "text-accent" : "text-success"
                    }`} />
                    <span className={plan.highlighted ? "text-primary-foreground/90" : "text-foreground"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to={plan.to}>
                <Button
                  className={`w-full h-11 font-semibold ${
                    plan.highlighted
                      ? "bg-accent text-accent-foreground hover:opacity-90 shadow-accent-glow"
                      : "bg-gradient-hero text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
