import {
  Search, FileText, Bell, Shield, Zap, MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Busca Inteligente",
    description: "Encontre vagas por área, cidade, tipo de contrato e mais. Filtros avançados para resultados precisos.",
  },
  {
    icon: FileText,
    title: "Currículo Online",
    description: "Faça upload do seu currículo e mantenha seu perfil sempre atualizado para as empresas.",
  },
  {
    icon: Bell,
    title: "Notificações em Tempo Real",
    description: "Receba alertas por e-mail sobre novas vagas, candidaturas e atualizações de status.",
  },
  {
    icon: Shield,
    title: "Segurança Garantida",
    description: "Dados criptografados, autenticação segura e proteção contra fraudes.",
  },
  {
    icon: Zap,
    title: "Vagas Impulsionadas",
    description: "Empresas podem destacar vagas para alcançar mais candidatos qualificados.",
  },
  {
    icon: MessageSquare,
    title: "Chat Direto",
    description: "Comunicação direta entre candidatos e empresas para agilizar o processo.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Funcionalidades
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4">
            Tudo que você precisa para{" "}
            <span className="text-primary">encontrar ou oferecer</span>{" "}
            empregos
          </h2>
          <p className="text-muted-foreground text-lg">
            Ferramentas poderosas para candidatos e empresas, tudo em um só lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:bg-gradient-hero transition-all duration-300">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
