-- enable_rls.sql
-- Enable Row Level Security and create policies

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

-- Categories: public read
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin: full access to categories
CREATE POLICY "Admin can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Tags: public read
CREATE POLICY "Anyone can view tags"
  ON tags FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin: full access to tags
CREATE POLICY "Admin can manage tags"
  ON tags FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Blogs: public read for published only
CREATE POLICY "Anyone can view published blogs"
  ON blogs FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Admin: full access to blogs
CREATE POLICY "Admin can manage blogs"
  ON blogs FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Blog_tags: public read
CREATE POLICY "Anyone can view blog tags"
  ON blog_tags FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin: full access to blog_tags
CREATE POLICY "Admin can manage blog tags"
  ON blog_tags FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM admin_users));