import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-accent flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold">
                WeConnect<span className="text-accent">+</span>
              </span>
            </Link>
            <p className="text-sm opacity-70 leading-relaxed">
              Conectando talentos às melhores oportunidades do mercado.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-50">
              Para Candidatos
            </h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link to="/vagas" className="hover:opacity-100 transition-opacity">Buscar Vagas</Link></li>
              <li><Link to="/cadastro/candidato" className="hover:opacity-100 transition-opacity">Criar Conta</Link></li>
              <li><Link to="/planos" className="hover:opacity-100 transition-opacity">Plano Vaga+</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-50">
              Para Empresas
            </h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link to="/cadastro/empresa" className="hover:opacity-100 transition-opacity">Cadastrar Empresa</Link></li>
              <li><Link to="/planos" className="hover:opacity-100 transition-opacity">Impulsionar Vagas</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-50">
              Suporte
            </h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Central de Ajuda</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Termos de Uso</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Privacidade</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm opacity-50">
          © {new Date().getFullYear()} WeConnect+. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
