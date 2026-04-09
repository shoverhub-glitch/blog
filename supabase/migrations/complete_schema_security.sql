-- Corrective migration (lean): only adds/fixes missing or inconsistent objects.
-- Existing base schema remains in earlier migrations.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Ensure admin_users can support robust admin checks.
ALTER TABLE public.admin_users
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_users_email_unique
  ON public.admin_users (lower(email));

-- Missing table used by app services/pages.
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read
  ON public.contact_messages(is_read);

-- Keep timestamp updates consistent.
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_contact_messages_touch_updated_at ON public.contact_messages;
CREATE TRIGGER trg_contact_messages_touch_updated_at
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Normalize admin helper used by policies.
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE lower(au.email) = lower(coalesce(auth.email(), ''))
      AND coalesce(au.is_active, true) = true
  );
$$;

-- Ensure setting exists for contact form feature toggle.
INSERT INTO public.site_settings (key, value)
VALUES ('admin_contact_messages_enabled', 'false')
ON CONFLICT (key) DO NOTHING;

-- RLS for contact_messages.
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS contact_messages_public_insert ON public.contact_messages;
DROP POLICY IF EXISTS contact_messages_admin_read ON public.contact_messages;
DROP POLICY IF EXISTS contact_messages_admin_update ON public.contact_messages;
DROP POLICY IF EXISTS contact_messages_admin_delete ON public.contact_messages;

CREATE POLICY contact_messages_public_insert
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY contact_messages_admin_read
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.is_admin_user());

CREATE POLICY contact_messages_admin_update
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY contact_messages_admin_delete
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (public.is_admin_user());

-- Keep storage policy naming consistent with existing setup.
DROP POLICY IF EXISTS storage_blog_images_public_read ON storage.objects;
DROP POLICY IF EXISTS storage_blog_images_admin_manage ON storage.objects;
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can manage blog images" ON storage.objects;

CREATE POLICY storage_blog_images_public_read
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'blog-images');

CREATE POLICY storage_blog_images_admin_manage
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'blog-images' AND public.is_admin_user())
  WITH CHECK (bucket_id = 'blog-images' AND public.is_admin_user());

GRANT EXECUTE ON FUNCTION public.is_admin_user()
  TO anon, authenticated, service_role;
