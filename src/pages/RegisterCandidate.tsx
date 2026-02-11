import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Eye, EyeOff, Upload } from "lucide-react";

const areas = [
  "Tecnologia da Informação",
  "Marketing",
  "Vendas",
  "Recursos Humanos",
  "Financeiro",
  "Engenharia",
  "Design",
  "Administração",
  "Saúde",
  "Educação",
  "Outros",
];

const RegisterCandidate = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/10 -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-8">
            <Briefcase className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-3xl font-extrabold text-primary-foreground mb-4">
            Encontre o emprego dos seus sonhos
          </h2>
          <p className="text-primary-foreground/60 text-lg">
            Crie sua conta gratuita e tenha acesso a milhares de oportunidades.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              WeConnect<span className="text-primary">+</span>
            </span>
          </Link>

          <h1 className="text-2xl font-extrabold text-foreground mb-2">Cadastro de Candidato</h1>
          <p className="text-muted-foreground mb-8">
            Já tem conta?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Faça login
            </Link>
          </p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" placeholder="João Silva" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(11) 99999-9999" className="h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" className="h-11" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área de Interesse</Label>
              <Select>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecione uma área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <div className="space-y-2">
              <Label>Currículo (PDF ou Word)</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Arraste seu arquivo ou <span className="text-primary font-semibold">clique para enviar</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC até 10MB</p>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 bg-gradient-hero text-primary-foreground hover:opacity-90 font-semibold">
              Criar Conta
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            É uma empresa?{" "}
            <Link to="/cadastro/empresa" className="text-primary font-semibold hover:underline">
              Cadastre sua empresa →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCandidate;
