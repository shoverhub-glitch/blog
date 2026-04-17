-- ============================================================================
-- MIGRATION 01: CORE SCHEMA
-- ============================================================================

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create blogs table (tags stored as text field)
CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text DEFAULT '',
  cover_image text DEFAULT '',
  author_name text DEFAULT 'SoverHub',
  author_id uuid REFERENCES auth.users(id),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  published boolean DEFAULT false,
  featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  tags text DEFAULT '',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category_id);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text DEFAULT '',
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_messages table (optional)
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
