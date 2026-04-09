-- 001_create_blog_schema.sql
-- Core tables: categories, tags, blogs, blog_tags

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text DEFAULT '',
  cover_image text DEFAULT '',
  author_name text DEFAULT 'ShoverHub',
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

-- Create blog_tags junction table
CREATE TABLE IF NOT EXISTS blog_tags (
  blog_id uuid REFERENCES blogs(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_id, tag_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
  ('Technology', 'technology', 'Latest tech news and tutorials'),
  ('Design', 'design', 'Design trends and best practices'),
  ('Business', 'business', 'Business insights and strategies'),
  ('Lifestyle', 'lifestyle', 'Lifestyle tips and inspiration')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample tags
INSERT INTO tags (name, slug) VALUES
  ('React', 'react'),
  ('TypeScript', 'typescript'),
  ('Web Development', 'web-development'),
  ('UI/UX', 'ui-ux'),
  ('Productivity', 'productivity'),
  ('SEO', 'seo')
ON CONFLICT (slug) DO NOTHING;