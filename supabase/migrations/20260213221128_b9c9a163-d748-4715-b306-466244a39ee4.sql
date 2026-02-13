
-- Add avatar_url to candidates
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create certifications table
CREATE TABLE public.certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  title text NOT NULL,
  institution text NOT NULL,
  year text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidate can view own certifications"
  ON public.certifications FOR SELECT
  USING (candidate_id = get_candidate_id(auth.uid()));

CREATE POLICY "Candidate can insert own certifications"
  ON public.certifications FOR INSERT
  WITH CHECK (candidate_id = get_candidate_id(auth.uid()));

CREATE POLICY "Candidate can update own certifications"
  ON public.certifications FOR UPDATE
  USING (candidate_id = get_candidate_id(auth.uid()));

CREATE POLICY "Candidate can delete own certifications"
  ON public.certifications FOR DELETE
  USING (candidate_id = get_candidate_id(auth.uid()));

-- Create experiences table
CREATE TABLE public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  company text NOT NULL,
  role text NOT NULL,
  start_date text NOT NULL,
  end_date text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidate can view own experiences"
  ON public.experiences FOR SELECT
  USING (candidate_id = get_candidate_id(auth.uid()));

CREATE POLICY "Candidate can insert own experiences"
  ON public.experiences FOR INSERT
  WITH CHECK (candidate_id = get_candidate_id(auth.uid()));

CREATE POLICY "Candidate can update own experiences"
  ON public.experiences FOR UPDATE
  USING (candidate_id = get_candidate_id(auth.uid()));

CREATE POLICY "Candidate can delete own experiences"
  ON public.experiences FOR DELETE
  USING (candidate_id = get_candidate_id(auth.uid()));

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
