-- Add work_model column to jobs (remota, híbrida, presencial)
ALTER TABLE public.jobs ADD COLUMN work_model text NOT NULL DEFAULT 'presencial';

-- Add contract_type column (CLT, PJ, Estágio, Jovem Aprendiz, Freelancer, Temporário)
-- The existing 'type' column serves this purpose but let's ensure it has good defaults

-- Create trigger to handle company+role creation on signup
-- This replaces the client-side inserts that fail due to RLS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), NEW.email);
  
  -- If user signed up as company, create company record and role
  IF NEW.raw_user_meta_data->>'user_type' = 'company' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'company');
    INSERT INTO public.companies (user_id, company_name, sector, phone)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'sector', 'Outros'),
      NEW.raw_user_meta_data->>'phone'
    );
  ELSIF NEW.raw_user_meta_data->>'user_type' = 'candidate' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'candidate');
    INSERT INTO public.candidates (user_id) VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;