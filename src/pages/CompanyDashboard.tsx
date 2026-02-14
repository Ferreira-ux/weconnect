import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import {
  Plus, Briefcase, MapPin, Trash2, Pencil, Loader2, Building2, Eye, EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";

interface Job {
  id: string;
  title: string;
  area: string;
  location: string;
  type: string;
  remote: boolean;
  salary_range: string | null;
  description: string | null;
  requirements: string | null;
  is_active: boolean;
  boosted: boolean;
  created_at: string;
}

const jobTypes = ["CLT", "PJ", "Estágio", "Freelancer", "Temporário"];
const jobAreas = [
  "Tecnologia", "Marketing", "Vendas", "Financeiro", "RH",
  "Operações", "Design", "Jurídico", "Saúde", "Educação", "Outros",
];

const CompanyDashboard = () => {
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("CLT");
  const [remote, setRemote] = useState(false);
  const [salaryRange, setSalaryRange] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/login"); return; }

    const { data: companyData } = await supabase
      .from("companies")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!companyData) { navigate("/"); return; }

    setCompany(companyData);

    const { data: jobsData } = await supabase
      .from("jobs")
      .select("*")
      .eq("company_id", companyData.id)
      .order("created_at", { ascending: false });

    setJobs(jobsData || []);
    setLoading(false);
  };

  const resetForm = () => {
    setTitle(""); setArea(""); setLocation(""); setType("CLT");
    setRemote(false); setSalaryRange(""); setDescription(""); setRequirements("");
    setEditingJob(null); setShowForm(false);
  };

  const openEditForm = (job: Job) => {
    setTitle(job.title); setArea(job.area); setLocation(job.location);
    setType(job.type); setRemote(job.remote); setSalaryRange(job.salary_range || "");
    setDescription(job.description || ""); setRequirements(job.requirements || "");
    setEditingJob(job); setShowForm(true);
  };

  const handleSave = async () => {
    if (!title || !area || !location) {
      toast({ title: "Preencha título, área e localização", variant: "destructive" });
      return;
    }
    setSaving(true);

    const payload = {
      title, area, location, type, remote,
      salary_range: salaryRange || null,
      description: description || null,
      requirements: requirements || null,
      company_id: company.id,
    };

    try {
      if (editingJob) {
        const { error } = await supabase.from("jobs").update(payload).eq("id", editingJob.id);
        if (error) throw error;
        toast({ title: "Vaga atualizada!" });
      } else {
        const { error } = await supabase.from("jobs").insert(payload);
        if (error) throw error;
        toast({ title: "Vaga publicada!" });
      }
      resetForm();
      loadData();
    } catch (err: any) {
      toast({ title: "Erro ao salvar vaga", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (job: Job) => {
    await supabase.from("jobs").update({ is_active: !job.is_active }).eq("id", job.id);
    loadData();
  };

  const deleteJob = async (id: string) => {
    await supabase.from("jobs").delete().eq("id", id);
    toast({ title: "Vaga removida" });
    loadData();
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
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground flex items-center gap-3">
              <Building2 className="w-7 h-7 text-primary" />
              {company?.company_name}
            </h1>
            <p className="text-muted-foreground mt-1">Gerencie suas vagas publicadas</p>
          </div>
          <Button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-gradient-hero text-primary-foreground hover:opacity-90 gap-2"
          >
            <Plus className="w-4 h-4" /> Nova Vaga
          </Button>
        </motion.div>

        {/* Job Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-8"
          >
            <h2 className="text-lg font-bold text-foreground mb-6">
              {editingJob ? "Editar Vaga" : "Publicar Nova Vaga"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título da Vaga *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Desenvolvedor Front-end" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>Área *</Label>
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {jobAreas.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Localização *</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="São Paulo, SP" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Contrato</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Faixa Salarial</Label>
                <Input value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} placeholder="R$ 3.000 - R$ 5.000" className="h-11" />
              </div>
              <div className="flex items-center gap-3 pt-7">
                <Switch checked={remote} onCheckedChange={setRemote} />
                <Label>Vaga remota</Label>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Descrição</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva a vaga..." rows={4} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Requisitos</Label>
                <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Requisitos para a vaga..." rows={3} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleSave} disabled={saving} className="bg-gradient-hero text-primary-foreground hover:opacity-90 gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingJob ? "Salvar Alterações" : "Publicar Vaga"}
              </Button>
              <Button variant="outline" onClick={resetForm}>Cancelar</Button>
            </div>
          </motion.div>
        )}

        {/* Jobs List */}
        {jobs.length === 0 && !showForm ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma vaga publicada</h3>
            <p className="text-muted-foreground mb-6">Comece publicando sua primeira vaga para atrair candidatos.</p>
            <Button onClick={() => setShowForm(true)} className="bg-gradient-hero text-primary-foreground hover:opacity-90 gap-2">
              <Plus className="w-4 h-4" /> Publicar Primeira Vaga
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-card border rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  job.is_active ? "border-border" : "border-border opacity-60"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground truncate">{job.title}</h3>
                    {!job.is_active && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Inativa</span>
                    )}
                    {job.boosted && (
                      <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">Impulsionada</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.area}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                    <span>{job.type}</span>
                    {job.remote && <span className="text-primary font-medium">Remoto</span>}
                    {job.salary_range && <span>{job.salary_range}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => toggleActive(job)} title={job.is_active ? "Desativar" : "Ativar"}>
                    {job.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openEditForm(job)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteJob(job.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
