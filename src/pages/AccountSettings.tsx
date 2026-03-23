import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import {
  Settings, Mail, Key, Trash2, Loader2, AlertTriangle, Eye, EyeOff,
} from "lucide-react";

const AccountSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login"); return; }
      setUser(user);
      setLoading(false);
    };
    init();
  }, []);

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      toast({ title: "A nova senha deve ter no mínimo 8 caracteres", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Senha atualizada com sucesso!" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast({ title: "Erro ao alterar senha", description: err.message, variant: "destructive" });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "EXCLUIR") {
      toast({ title: "Digite EXCLUIR para confirmar", variant: "destructive" });
      return;
    }
    setDeleting(true);
    try {
      // Sign out and inform user
      await supabase.auth.signOut();
      toast({
        title: "Solicitação enviada",
        description: "Sua conta será excluída permanentemente. Entre em contato com o suporte caso mude de ideia.",
      });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-2xl space-y-6">
        <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" /> Configurações da Conta
        </h1>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="w-5 h-5 text-primary" /> Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs">E-mail</Label>
              <p className="font-semibold text-foreground">{user?.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Conta criada em</Label>
              <p className="text-sm text-foreground">
                {new Date(user?.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Key className="w-5 h-5 text-primary" /> Alterar Senha
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nova senha</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-11 pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button onClick={handleChangePassword} disabled={changingPassword} className="bg-gradient-hero text-primary-foreground hover:opacity-90 gap-2">
              {changingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
              Alterar senha
            </Button>
          </CardContent>
        </Card>

        {/* Delete Account */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <Trash2 className="w-5 h-5" /> Excluir Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Atenção: esta ação é irreversível</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Ao excluir sua conta, todos os seus dados serão permanentemente removidos, incluindo perfil, candidaturas, conversas e notificações.
                  </p>
                </div>
              </div>
            </div>
            {showDeleteConfirm ? (
              <div className="space-y-3">
                <Label>Digite <strong>EXCLUIR</strong> para confirmar</Label>
                <Input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="EXCLUIR" className="h-11" />
                <div className="flex gap-3">
                  <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting || deleteConfirmText !== "EXCLUIR"} className="gap-2">
                    {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Excluir permanentemente
                  </Button>
                  <Button variant="outline" onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="text-destructive hover:text-destructive gap-2" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 className="w-4 h-4" /> Excluir minha conta
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettings;
