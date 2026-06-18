import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Star } from "lucide-react";

const plans = [
  {
    name: "Candidato+",
    audience: "Para Candidatos",
    price: "R$ 29,90",
    period: "/mês",
    description:
      "A IA analisa seu currículo e te coloca no topo da busca das empresas.",
    features: [
      "Análise IA do seu currículo para cada vaga",
      "Sugestões para melhorar e aumentar seu score",
      "Currículo no topo da busca das empresas",
      "Destaque como candidato recomendado pela IA",
      "Alertas de vagas compatíveis em primeira mão",
      "Saiba quem viu seu perfil",
    ],
    cta: "Assinar Candidato+",
    to: "/cadastro/candidato",
    icon: Star,
    highlighted: false,
  },
  {
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
    icon: Sparkles,
    highlighted: true,
  },
];

const PricingSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Planos
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4">
            IA que coloca os melhores no topo
          </h2>
          <p className="text-muted-foreground text-lg">
            Um plano para candidatos se destacarem e outro para empresas
            contratarem mais rápido.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 animate-fade-in ${
                  plan.highlighted
                    ? "bg-gradient-hero text-primary-foreground shadow-glow md:scale-[1.02]"
                    : "bg-card border border-border hover:border-primary/30 hover:shadow-lg"
                }`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary-foreground text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Icon className="w-3 h-3" /> Recomendado
                  </div>
                )}

                <div
                  className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                    plan.highlighted
                      ? "text-primary-foreground/60"
                      : "text-muted-foreground"
                  }`}
                >
                  {plan.audience}
                </div>

                <h3
                  className={`text-2xl font-bold mb-1 ${
                    plan.highlighted
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {plan.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-3">
                  <span
                    className={`text-4xl font-extrabold ${
                      plan.highlighted
                        ? "text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.highlighted
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>

                <p
                  className={`text-sm mb-6 ${
                    plan.highlighted
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.highlighted
                            ? "text-primary-foreground"
                            : "text-primary"
                        }`}
                      />
                      <span
                        className={
                          plan.highlighted
                            ? "text-primary-foreground/90"
                            : "text-foreground"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to={plan.to}>
                  <Button
                    className={`w-full h-11 font-semibold ${
                      plan.highlighted
                        ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                        : "bg-gradient-hero text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
