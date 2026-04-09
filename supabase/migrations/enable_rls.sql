-- enable_rls.sql
-- Enable Row Level Security and create policies

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Categories: public read
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin: full access to categories
CREATE POLICY "Admin can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (auth.email() IN (SELECT email FROM admin_users));

-- Tags: public read
CREATE POLICY "Anyone can view tags"
  ON tags FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin: full access to tags
CREATE POLICY "Admin can manage tags"
  ON tags FOR ALL
  TO authenticated
  USING (auth.email() IN (SELECT email FROM admin_users));

-- Blogs: public read for published only
CREATE POLICY "Anyone can view published blogs"
  ON blogs FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Admin: full access to blogs
CREATE POLICY "Admin can manage blogs"
  ON blogs FOR ALL
  TO authenticated
  USING (auth.email() IN (SELECT email FROM admin_users));

-- Blog_tags: public read
CREATE POLICY "Anyone can view blog tags"
  ON blog_tags FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin: full access to blog_tags
CREATE POLICY "Admin can manage blog tags"
  ON blog_tags FOR ALL
  TO authenticated
  USING (auth.email() IN (SELECT email FROM admin_users));

-- Comments: public read approved
CREATE POLICY "Anyone can view approved comments"
  ON comments FOR SELECT
  TO anon, authenticated
  USING (approved = true);

-- Comments: public insert
CREATE POLICY "Anyone can insert comments"
  ON comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin: full access to comments
CREATE POLICY "Admin can manage comments"
  ON comments FOR ALL
  TO authenticated
  USING (auth.email() IN (SELECT email FROM admin_users));

-- Comment likes: public read
CREATE POLICY "Anyone can view comment likes"
  ON comment_likes FOR SELECT
  TO anon, authenticated
  USING (true);

-- Comment likes: public insert
CREATE POLICY "Anyone can insert comment likes"
  ON comment_likes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin: full access to comment_likes
CREATE POLICY "Admin can manage comment likes"
  ON comment_likes FOR ALL
  TO authenticated
  USING (auth.email() IN (SELECT email FROM admin_users));
