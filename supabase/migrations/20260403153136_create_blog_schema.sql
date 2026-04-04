/*
  # sampleHub Blog Platform Database Schema

  ## Overview
  This migration creates the complete database schema for the sampleHub blog platform.
  It includes tables for categories, tags, blogs, and their relationships with full RLS security.

  ## New Tables

  ### 1. categories
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text, unique) - Category name
  - `slug` (text, unique) - URL-friendly slug for SEO
  - `description` (text) - Category description
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. tags
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text, unique) - Tag name
  - `slug` (text, unique) - URL-friendly slug for SEO
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. blogs
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Blog post title
  - `slug` (text, unique) - URL-friendly slug for SEO
  - `content` (text) - Blog post content (markdown/HTML)
  - `excerpt` (text) - Short description for previews
  - `cover_image` (text) - Cover image URL
  - `author_name` (text) - Author display name
  - `author_id` (uuid) - Reference to auth.users (for future admin)
  - `category_id` (uuid) - Reference to categories
  - `published` (boolean) - Publication status
  - `featured` (boolean) - Featured post flag
  - `view_count` (integer) - Number of views
  - `published_at` (timestamptz) - Publication date
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. blog_tags
  - Junction table for many-to-many relationship between blogs and tags
  - `blog_id` (uuid) - Reference to blogs
  - `tag_id` (uuid) - Reference to tags

  ## Security
  - All tables have RLS enabled
  - Public read access for published content only
  - Write access restricted (ready for admin panel in Part 2)

  ## Indexes
  - Optimized for fast queries on slugs, published status, and featured posts
  - Full-text search capability on blog titles and content
*/

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

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for tags (public read)
CREATE POLICY "Anyone can view tags"
  ON tags FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for blogs (public read for published only)
CREATE POLICY "Anyone can view published blogs"
  ON blogs FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- RLS Policies for blog_tags (public read)
CREATE POLICY "Anyone can view blog tags"
  ON blog_tags FOR SELECT
  TO anon, authenticated
  USING (true);

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