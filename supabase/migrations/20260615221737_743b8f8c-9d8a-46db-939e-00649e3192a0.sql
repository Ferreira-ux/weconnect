ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS cnpj TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT false;
CREATE UNIQUE INDEX IF NOT EXISTS companies_cnpj_unique ON public.companies(cnpj) WHERE cnpj IS NOT NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), NEW.email);

  IF NEW.raw_user_meta_data->>'user_type' = 'company' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'company');
    INSERT INTO public.companies (user_id, company_name, sector, phone, cnpj)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'sector', 'Outros'),
      NEW.raw_user_meta_data->>'phone',
      NEW.raw_user_meta_data->>'cnpj'
    );
  ELSIF NEW.raw_user_meta_data->>'user_type' = 'candidate' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'candidate');
    INSERT INTO public.candidates (user_id) VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$function$;