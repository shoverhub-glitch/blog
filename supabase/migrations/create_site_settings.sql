-- 004_create_site_settings.sql
-- Site settings table for feature toggles

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('admin_contact_messages_enabled', 'false')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read site settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin write access
CREATE POLICY "Admin can manage site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM admin_users));