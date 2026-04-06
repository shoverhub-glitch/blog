-- 003_create_admin_system.sql
-- Admin users table and authentication function

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = is_admin.user_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Seed admin user (replace with actual admin user_id after setup)
-- INSERT INTO admin_users (user_id, email, role)
-- VALUES ('your-admin-user-uuid', 'admin@example.com', 'admin');