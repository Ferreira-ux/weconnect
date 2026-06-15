// Analyze candidate applications for a job using Lovable AI Gateway (Gemini).
// Returns a fit score (0-100), summary, strengths and gaps per candidate, and caches in DB.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function fetchResumeAsDataUrl(admin: any, path: string | null): Promise<{ dataUrl: string; mime: string } | null> {
  if (!path) return null;
  const { data, error } = await admin.storage.from("resumes").download(path);
  if (error || !data) return null;
  const buf = new Uint8Array(await data.arrayBuffer());
  let mime = data.type || "application/octet-stream";
  const lower = path.toLowerCase();
  if (lower.endsWith(".pdf")) mime = "application/pdf";
  else if (lower.endsWith(".png")) mime = "image/png";
  else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) mime = "image/jpeg";
  // Convert to base64
  let binary = "";
  for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]);
  const b64 = btoa(binary);
  return { dataUrl: `data:${mime};base64,${b64}`, mime };
}

async function analyzeOne(job: any, candidate: any, resume: { dataUrl: string; mime: string } | null) {
  const profileText = `Nome: ${candidate.name}
Email: ${candidate.email}
Telefone: ${candidate.phone || "-"}
Habilidades declaradas: ${candidate.skills || "-"}

Experiências:
${(candidate.experiences || []).map((e: any) => `- ${e.role} @ ${e.company} (${e.start_date} → ${e.end_date || "Atual"}) — ${e.description || ""}`).join("\n") || "(nenhuma)"}

Certificações:
${(candidate.certifications || []).map((c: any) => `- ${c.title} — ${c.institution}${c.year ? ` (${c.year})` : ""}`).join("\n") || "(nenhuma)"}`;

  const jobText = `Vaga: ${job.title}
Área: ${job.area}
Localização: ${job.location}
Tipo: ${job.type} • Modelo: ${job.work_model}
Faixa salarial: ${job.salary_range || "-"}

Descrição:
${job.description || "-"}

Requisitos:
${job.requirements || "-"}`;

  const userParts: any[] = [
    {
      type: "text",
      text: `Você é um assistente de RH. Avalie a aderência deste candidato à vaga.

=== VAGA ===
${jobText}

=== PERFIL DO CANDIDATO ===
${profileText}

${resume ? "O currículo em anexo (PDF/imagem) tem prioridade sobre as informações declaradas. Extraia experiências, habilidades, formação e certificações dele." : "(Candidato não enviou currículo em arquivo.)"}

Devolva APENAS um JSON válido neste formato exato, sem texto antes ou depois:
{
  "score": <inteiro de 0 a 100, aderência geral>,
  "summary": "<resumo em 2-3 frases sobre o fit com a vaga, em português>",
  "strengths": ["<ponto forte 1>", "<ponto forte 2>", "<ponto forte 3>"],
  "gaps": ["<lacuna 1>", "<lacuna 2>"]
}`,
    },
  ];

  if (resume) {
    if (resume.mime === "application/pdf") {
      userParts.push({ type: "file", data: resume.dataUrl, mediaType: "application/pdf" });
    } else if (resume.mime.startsWith("image/")) {
      userParts.push({ type: "image_url", image_url: { url: resume.dataUrl } });
    }
  }

  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": LOVABLE_API_KEY,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "Você é um assistente de RH conciso, objetivo e justo. Responde sempre em português do Brasil em JSON válido." },
        { role: "user", content: userParts },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`AI error ${resp.status}: ${txt}`);
  }
  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content || "{}";
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    parsed = m ? JSON.parse(m[0]) : { score: 0, summary: "Não foi possível analisar.", strengths: [], gaps: [] };
  }
  return {
    score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
    summary: String(parsed.summary || ""),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 5) : [],
    gaps: Array.isArray(parsed.gaps) ? parsed.gaps.slice(0, 5) : [],
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { job_id } = await req.json();
    if (!job_id) throw new Error("job_id required");

    // Verify caller owns the job's company
    const { data: job } = await admin
      .from("jobs")
      .select("*, companies!inner(user_id)")
      .eq("id", job_id)
      .maybeSingle();
    if (!job) throw new Error("Job not found");
    if ((job as any).companies.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get applications + candidate details
    const { data: apps } = await admin.from("applications").select("*").eq("job_id", job_id);
    if (!apps || apps.length === 0) {
      return new Response(JSON.stringify({ results: [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const results: any[] = [];
    for (const app of apps) {
      try {
        const { data: cand } = await admin
          .from("candidates")
          .select("id, user_id, skills, resume_url")
          .eq("id", app.candidate_id)
          .maybeSingle();
        const [profileRes, certs, exps] = await Promise.all([
          cand?.user_id ? admin.from("profiles").select("name, email, phone").eq("user_id", cand.user_id).maybeSingle() : Promise.resolve({ data: null }),
          cand?.id ? admin.from("certifications").select("title, institution, year").eq("candidate_id", cand.id) : Promise.resolve({ data: [] }),
          cand?.id ? admin.from("experiences").select("company, role, start_date, end_date, description").eq("candidate_id", cand.id) : Promise.resolve({ data: [] }),
        ]);
        const candidate = {
          name: (profileRes as any).data?.name || "Candidato",
          email: (profileRes as any).data?.email || "",
          phone: (profileRes as any).data?.phone || "",
          skills: cand?.skills || "",
          certifications: (certs as any).data || [],
          experiences: (exps as any).data || [],
        };
        const resume = await fetchResumeAsDataUrl(admin, cand?.resume_url || null);
        const analysis = await analyzeOne(job, candidate, resume);

        await admin.from("applications").update({
          ai_score: analysis.score,
          ai_summary: analysis.summary,
          ai_strengths: analysis.strengths,
          ai_gaps: analysis.gaps,
          ai_analyzed_at: new Date().toISOString(),
        }).eq("id", app.id);

        results.push({ application_id: app.id, ...analysis });
      } catch (err) {
        console.error("Analysis failed for", app.id, err);
        results.push({ application_id: app.id, error: String((err as Error).message || err) });
      }
    }

    return new Response(JSON.stringify({ results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String((err as Error).message || err) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
