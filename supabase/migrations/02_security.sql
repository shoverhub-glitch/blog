-- ============================================================================
-- MIGRATION 02: ROW LEVEL SECURITY & FUNCTIONS
-- ============================================================================

-- Enable pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Function: Increment blog view count
CREATE OR REPLACE FUNCTION increment_view_count(blog_id uuid)
RETURNS void AS $$
  UPDATE blogs SET view_count = view_count + 1 WHERE id = blog_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Function: Admin check
CREATE OR REPLACE FUNCTION is_admin(user_email text)
RETURNS boolean AS $$
  SELECT EXISTS(SELECT 1 FROM admin_users WHERE lower(email) = lower(user_email));
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Categories: anyone can read
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);

-- Blogs: anyone can view published
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published blogs" ON blogs;
CREATE POLICY "Anyone can view published blogs" ON blogs FOR SELECT USING (published = true);

-- Contact messages: anyone can insert
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can contact" ON contact_messages;
CREATE POLICY "Anyone can contact" ON contact_messages FOR INSERT WITH CHECK (true);

-- Storage: anyone can view images
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
CREATE POLICY "Public can view blog images" ON storage.objects 
FOR SELECT USING (bucket_id = 'blog-images');

-- Grant execute
GRANT EXECUTE ON FUNCTION increment_view_count(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION is_admin(text) TO anon, authenticated;

-- ============================================================================
-- END 02_security.sql
-- ============================================================================