/*
  # Create Admin User System

  ## Overview
  Creates the admin user system with role-based access control using Supabase Auth.
  
  ## New Tables
  - `admin_users` - Maps Supabase auth users to admin role
  
  ## Security
  - Only admin users can perform admin operations
  - RLS policies enforce role-based access
  - Public users cannot access admin data
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Only their own admin user can update"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Update blogs table to allow admin writes
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users(id);

-- Update RLS for blogs to allow admin write access
CREATE POLICY "Admins can create blogs"
  ON blogs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update blogs"
  ON blogs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete blogs"
  ON blogs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = user_id
    AND admin_users.role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated, anon;