-- Tighten the medicos table for reliable signup/login.
-- Applied to the CardioPront Supabase project.

ALTER TABLE public.medicos
  ALTER COLUMN auth_user_id SET NOT NULL,
  ALTER COLUMN nome SET NOT NULL,
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN crm SET NOT NULL,
  ALTER COLUMN crm_uf SET NOT NULL,
  ALTER COLUMN senha_hash SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS medicos_email_lower_key
  ON public.medicos ((lower(email)));

CREATE INDEX IF NOT EXISTS medicos_email_idx
  ON public.medicos (email);
