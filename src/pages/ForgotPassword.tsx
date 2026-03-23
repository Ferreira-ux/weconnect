import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Loader2, ArrowLeft, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Digite seu e-mail", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });
      if (error) throw error;
      setSent(true);
      toast({ title: "E-mail enviado!", description: "Verifique sua caixa de entrada." });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md animate-fade-in">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            WeConnect<span className="text-primary">+</span>
          </span>
        </Link>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold text-foreground">E-mail enviado!</h1>
            <p className="text-muted-foreground">
              Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada e spam.
            </p>
            <Link to="/login">
              <Button variant="outline" className="gap-2 mt-4">
                <ArrowLeft className="w-4 h-4" /> Voltar ao login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold text-foreground mb-2">Recuperar senha</h1>
            <p className="text-muted-foreground mb-8">
              Digite seu e-mail e enviaremos um link para redefinir sua senha.
            </p>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu@email.com" className="h-11" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-hero text-primary-foreground hover:opacity-90 font-semibold">
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Enviar link de recuperação
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-primary font-semibold hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Voltar ao login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
