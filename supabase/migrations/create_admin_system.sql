-- 003_create_admin_system.sql
-- Admin users table and authentication function

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text DEFAULT '',
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on id
CREATE INDEX IF NOT EXISTS idx_admin_users_id ON admin_users(id);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(admin_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = admin_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Seed admin user (replace with actual admin user_id after setup)
-- INSERT INTO admin_users (user_id, email, role)
-- VALUES ('your-admin-user-uuid', 'admin@example.com', 'admin');