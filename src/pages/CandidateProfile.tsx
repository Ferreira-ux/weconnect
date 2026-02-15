import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Camera,
  Plus,
  Trash2,
  Pencil,
  Award,
  Building2,
  ArrowLeft,
  Loader2,
  Save,
  X,
  User,
  FileUp,
  FileText,
  Download,
} from "lucide-react";

interface Profile {
  name: string;
  email: string;
  phone: string | null;
}

interface Candidate {
  id: string;
  skills: string | null;
  avatar_url: string | null;
  resume_url: string | null;
}

interface Certification {
  id: string;
  title: string;
  institution: string;
  year: string | null;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
}

const CandidateProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [profile, setProfile] = useState<Profile>({ name: "", email: "", phone: "" });
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editSkills, setEditSkills] = useState("");

  // New certification form
  const [showCertForm, setShowCertForm] = useState(false);
  const [certTitle, setCertTitle] = useState("");
  const [certInstitution, setCertInstitution] = useState("");
  const [certYear, setCertYear] = useState("");

  // New experience form
  const [showExpForm, setShowExpForm] = useState(false);
  const [expCompany, setExpCompany] = useState("");
  const [expRole, setExpRole] = useState("");
  const [expStartDate, setExpStartDate] = useState("");
  const [expEndDate, setExpEndDate] = useState("");
  const [expDescription, setExpDescription] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    const [profileRes, candidateRes] = await Promise.all([
      supabase.from("profiles").select("name, email, phone").eq("user_id", user.id).single(),
      supabase.from("candidates").select("id, skills, avatar_url, resume_url").eq("user_id", user.id).single(),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (candidateRes.data) {
      setCandidate(candidateRes.data);
      const [certsRes, expsRes] = await Promise.all([
        supabase.from("certifications").select("*").eq("candidate_id", candidateRes.data.id).order("created_at", { ascending: false }),
        supabase.from("experiences").select("*").eq("candidate_id", candidateRes.data.id).order("created_at", { ascending: false }),
      ]);
      if (certsRes.data) setCertifications(certsRes.data);
      if (expsRes.data) setExperiences(expsRes.data);
    }
    setLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !candidate) return;

    const validTypes = ["image/png", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      toast({ title: "Formato inválido", description: "Use PNG ou JPEG.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Arquivo muito grande", description: "Máximo 5MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const filePath = `${user.id}/${Date.now()}.${file.type === "image/png" ? "png" : "jpg"}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast({ title: "Erro ao enviar foto", variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(filePath);
    await supabase.from("candidates").update({ avatar_url: publicUrl.publicUrl }).eq("id", candidate.id);
    setCandidate({ ...candidate, avatar_url: publicUrl.publicUrl });
    toast({ title: "Foto atualizada!" });
    setUploading(false);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !candidate) return;

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
    ];
    if (!validTypes.includes(file.type)) {
      toast({ title: "Formato inválido", description: "Use PDF, Word ou imagem (PNG/JPEG).", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Arquivo muito grande", description: "Máximo 10MB.", variant: "destructive" });
      return;
    }

    setUploadingResume(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const ext = file.name.split(".").pop() || "pdf";
    const filePath = `${user.id}/curriculo_${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("resumes").upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast({ title: "Erro ao enviar currículo", description: uploadError.message, variant: "destructive" });
      setUploadingResume(false);
      return;
    }

    // Store path reference in candidates table
    await supabase.from("candidates").update({ resume_url: filePath }).eq("id", candidate.id);
    setCandidate({ ...candidate, resume_url: filePath });
    toast({ title: "Currículo enviado com sucesso!" });
    setUploadingResume(false);
  };

  const deleteResume = async () => {
    if (!candidate?.resume_url) return;
    await supabase.storage.from("resumes").remove([candidate.resume_url]);
    await supabase.from("candidates").update({ resume_url: null }).eq("id", candidate.id);
    setCandidate({ ...candidate, resume_url: null });
    toast({ title: "Currículo removido" });
  };

  const downloadResume = async () => {
    if (!candidate?.resume_url) return;
    const { data, error } = await supabase.storage.from("resumes").download(candidate.resume_url);
    if (error || !data) {
      toast({ title: "Erro ao baixar currículo", variant: "destructive" });
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = candidate.resume_url.split("/").pop() || "curriculo";
    a.click();
    URL.revokeObjectURL(url);
  };

  const startEditing = () => {
    setEditName(profile.name);
    setEditPhone(profile.phone || "");
    setEditSkills(candidate?.skills || "");
    setEditingProfile(true);
  };

  const saveProfile = async () => {
    if (!editName.trim()) {
      toast({ title: "Nome é obrigatório", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await Promise.all([
      supabase.from("profiles").update({ name: editName.trim(), phone: editPhone.trim() || null }).eq("user_id", user.id),
      candidate ? supabase.from("candidates").update({ skills: editSkills.trim() || null }).eq("id", candidate.id) : Promise.resolve(),
    ]);

    setProfile({ ...profile, name: editName.trim(), phone: editPhone.trim() || null });
    if (candidate) setCandidate({ ...candidate, skills: editSkills.trim() || null });
    setEditingProfile(false);
    setSaving(false);
    toast({ title: "Perfil atualizado!" });
  };

  const addCertification = async () => {
    if (!certTitle.trim() || !certInstitution.trim() || !candidate) return;
    const { data, error } = await supabase.from("certifications").insert({
      candidate_id: candidate.id,
      title: certTitle.trim(),
      institution: certInstitution.trim(),
      year: certYear.trim() || null,
    }).select().single();

    if (error) {
      toast({ title: "Erro ao adicionar certificação", variant: "destructive" });
      return;
    }
    setCertifications([data, ...certifications]);
    setCertTitle(""); setCertInstitution(""); setCertYear("");
    setShowCertForm(false);
    toast({ title: "Certificação adicionada!" });
  };

  const deleteCertification = async (id: string) => {
    await supabase.from("certifications").delete().eq("id", id);
    setCertifications(certifications.filter(c => c.id !== id));
    toast({ title: "Certificação removida" });
  };

  const addExperience = async () => {
    if (!expCompany.trim() || !expRole.trim() || !expStartDate || !candidate) return;
    const { data, error } = await supabase.from("experiences").insert({
      candidate_id: candidate.id,
      company: expCompany.trim(),
      role: expRole.trim(),
      start_date: expStartDate,
      end_date: expEndDate || null,
      description: expDescription.trim() || null,
    }).select().single();

    if (error) {
      toast({ title: "Erro ao adicionar experiência", variant: "destructive" });
      return;
    }
    setExperiences([data, ...experiences]);
    setExpCompany(""); setExpRole(""); setExpStartDate(""); setExpEndDate(""); setExpDescription("");
    setShowExpForm(false);
    toast({ title: "Experiência adicionada!" });
  };

  const deleteExperience = async (id: string) => {
    await supabase.from("experiences").delete().eq("id", id);
    setExperiences(experiences.filter(ex => ex.id !== id));
    toast({ title: "Experiência removida" });
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
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/vagas")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            <span className="text-xl font-bold">Meu Perfil</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-primary/20">
                  {candidate?.avatar_url ? (
                    <img src={candidate.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleAvatarUpload} />
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                {editingProfile ? (
                  <div className="space-y-3">
                    <div>
                      <Label>Nome</Label>
                      <Input value={editName} onChange={e => setEditName(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="(00) 00000-0000" className="mt-1" />
                    </div>
                    <div>
                      <Label>Habilidades</Label>
                      <Input value={editSkills} onChange={e => setEditSkills(e.target.value)} placeholder="Ex: React, Node.js, Design" className="mt-1" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveProfile} disabled={saving} size="sm" className="bg-gradient-hero text-primary-foreground">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                        Salvar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingProfile(false)}>
                        <X className="w-4 h-4 mr-1" /> Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-extrabold text-foreground">{profile.name}</h2>
                    <p className="text-muted-foreground">{profile.email}</p>
                    {profile.phone && <p className="text-muted-foreground text-sm">{profile.phone}</p>}
                    {candidate?.skills && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {candidate.skills.split(",").map((s, i) => (
                          <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="mt-3" onClick={startEditing}>
                      <Pencil className="w-4 h-4 mr-1" /> Editar perfil
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Upload */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-primary" /> Currículo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {candidate?.resume_url ? (
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {candidate.resume_url.split("/").pop()}
                    </p>
                    <p className="text-xs text-muted-foreground">Currículo enviado</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={downloadResume}>
                    <Download className="w-4 h-4 mr-1" /> Baixar
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={deleteResume}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <FileUp className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm mb-4">
                  Envie seu currículo (PDF, Word ou imagem) para aumentar suas chances
                </p>
                <Button
                  variant="outline"
                  onClick={() => resumeInputRef.current?.click()}
                  disabled={uploadingResume}
                  className="gap-2"
                >
                  {uploadingResume ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
                  Enviar Currículo
                </Button>
              </div>
            )}
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleResumeUpload}
            />
            {candidate?.resume_url && (
              <div className="mt-3 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resumeInputRef.current?.click()}
                  disabled={uploadingResume}
                  className="text-primary gap-1"
                >
                  {uploadingResume ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
                  Substituir currículo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-accent" /> Certificações
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowCertForm(!showCertForm)}>
              {showCertForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
              {showCertForm ? "Cancelar" : "Adicionar"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {showCertForm && (
              <div className="p-4 border border-border rounded-lg space-y-3 bg-muted/30">
                <div>
                  <Label>Título da certificação *</Label>
                  <Input value={certTitle} onChange={e => setCertTitle(e.target.value)} placeholder="Ex: AWS Cloud Practitioner" className="mt-1" />
                </div>
                <div>
                  <Label>Instituição *</Label>
                  <Input value={certInstitution} onChange={e => setCertInstitution(e.target.value)} placeholder="Ex: Amazon Web Services" className="mt-1" />
                </div>
                <div>
                  <Label>Ano</Label>
                  <Input value={certYear} onChange={e => setCertYear(e.target.value)} placeholder="Ex: 2024" className="mt-1" />
                </div>
                <Button onClick={addCertification} size="sm" className="bg-gradient-hero text-primary-foreground">
                  <Plus className="w-4 h-4 mr-1" /> Salvar certificação
                </Button>
              </div>
            )}

            {certifications.length === 0 && !showCertForm && (
              <p className="text-muted-foreground text-sm text-center py-4">Nenhuma certificação adicionada ainda.</p>
            )}

            {certifications.map(cert => (
              <div key={cert.id} className="flex items-start justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">{cert.title}</p>
                  <p className="text-sm text-muted-foreground">{cert.institution}{cert.year ? ` • ${cert.year}` : ""}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteCertification(cert.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Experiences */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="w-5 h-5 text-primary" /> Experiências
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowExpForm(!showExpForm)}>
              {showExpForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
              {showExpForm ? "Cancelar" : "Adicionar"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {showExpForm && (
              <div className="p-4 border border-border rounded-lg space-y-3 bg-muted/30">
                <div>
                  <Label>Empresa *</Label>
                  <Input value={expCompany} onChange={e => setExpCompany(e.target.value)} placeholder="Nome da empresa" className="mt-1" />
                </div>
                <div>
                  <Label>Cargo *</Label>
                  <Input value={expRole} onChange={e => setExpRole(e.target.value)} placeholder="Ex: Desenvolvedor Front-End" className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Início *</Label>
                    <Input type="month" value={expStartDate} onChange={e => setExpStartDate(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Fim (vazio = atual)</Label>
                    <Input type="month" value={expEndDate} onChange={e => setExpEndDate(e.target.value)} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea value={expDescription} onChange={e => setExpDescription(e.target.value)} placeholder="Principais atividades e conquistas..." className="mt-1" rows={3} />
                </div>
                <Button onClick={addExperience} size="sm" className="bg-gradient-hero text-primary-foreground">
                  <Plus className="w-4 h-4 mr-1" /> Salvar experiência
                </Button>
              </div>
            )}

            {experiences.length === 0 && !showExpForm && (
              <p className="text-muted-foreground text-sm text-center py-4">Nenhuma experiência adicionada ainda.</p>
            )}

            {experiences.map(exp => (
              <div key={exp.id} className="flex items-start justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">{exp.role}</p>
                  <p className="text-sm text-primary font-medium">{exp.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {exp.start_date} — {exp.end_date || "Atual"}
                  </p>
                  {exp.description && <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>}
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteExperience(exp.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateProfile;
