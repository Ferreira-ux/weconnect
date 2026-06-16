import {
  Sparkles, FileSearch, BarChart3, Filter, Bell, MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    title: "Triagem com IA",
    description: "Nosso assistente de RH lê cada currículo, compara com a vaga e gera uma pontuação de aderência de 0 a 100.",
  },
  {
    icon: FileSearch,
    title: "Leitura automática de currículos",
    description: "Extraímos experiências, habilidades e formações de PDFs e imagens — sem precisar abrir um por um.",
  },
  {
    icon: BarChart3,
    title: "Ranking de candidatos",
    description: "Veja pontos fortes, lacunas e um resumo objetivo por candidato. Ordene pelos que mais combinam com a vaga.",
  },
  {
    icon: Filter,
    title: "Filtros por expectativa",
    description: "Defina requisitos e perfil ideal. A IA destaca os candidatos que atendem ao que sua empresa procura.",
  },
  {
    icon: Bell,
    title: "Notificações em tempo real",
    description: "Avisos automáticos para candidaturas, aprovações e novas mensagens — nada se perde no caminho.",
  },
  {
    icon: MessageSquare,
    title: "Chat direto com o candidato",
    description: "Aprovou um perfil? Inicie a conversa em um clique e acompanhe tudo dentro da plataforma.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Funcionalidades
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4">
            Feito para quem quer{" "}
            <span className="text-primary">começar</span>{" "}
            ou recomeçar
          </h2>
          <p className="text-muted-foreground text-lg">
            Sem burocracia. Cadastre suas habilidades e encontre vagas que combinam com você.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group p-8 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-shadow duration-300"
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
