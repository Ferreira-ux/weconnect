import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Eye, EyeOff } from "lucide-react";

const sectors = [
  "Tecnologia",
  "Saúde",
  "Educação",
  "Varejo",
  "Indústria",
  "Serviços Financeiros",
  "Marketing e Publicidade",
  "Consultoria",
  "Logística",
  "Outros",
];

const RegisterCompany = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/5 translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-8">
            <Building2 className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-3xl font-extrabold text-primary-foreground mb-4">
            Encontre os melhores talentos
          </h2>
          <p className="text-primary-foreground/60 text-lg">
            Publique vagas e conecte-se com candidatos qualificados.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Empreg<span className="text-primary">aí</span>
            </span>
          </Link>

          <h1 className="text-2xl font-extrabold text-foreground mb-2">Cadastro de Empresa</h1>
          <p className="text-muted-foreground mb-8">
            Já tem conta?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Faça login
            </Link>
          </p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input id="companyName" placeholder="Empresa LTDA" className="h-11" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Área de Atuação</Label>
              <Select>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="contato@empresa.com" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(11) 3333-4444" className="h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 bg-gradient-hero text-primary-foreground hover:opacity-90 font-semibold">
              Cadastrar Empresa
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            É um candidato?{" "}
            <Link to="/cadastro/candidato" className="text-primary font-semibold hover:underline">
              Cadastre-se como candidato →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCompany;
