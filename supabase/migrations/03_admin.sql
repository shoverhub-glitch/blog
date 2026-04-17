-- ============================================================================
-- MIGRATION 03: ADMIN ACCESS POLICIES
-- Run AFTER setting up admin users
-- ============================================================================

-- Admin full access to categories
DROP POLICY IF EXISTS "Admin can manage categories" ON categories;
CREATE POLICY "Admin can manage categories" ON categories
  FOR ALL USING (auth.email() IN (SELECT email FROM admin_users));

-- Admin full access to blogs
DROP POLICY IF EXISTS "Admin can manage blogs" ON blogs;
CREATE POLICY "Admin can manage blogs" ON blogs
  FOR ALL USING (auth.email() IN (SELECT email FROM admin_users));

-- Admin full access to contact messages
DROP POLICY IF EXISTS "Admin can manage contact_messages" ON contact_messages;
CREATE POLICY "Admin can manage contact_messages" ON contact_messages
  FOR ALL USING (auth.email() IN (SELECT email FROM admin_users));

-- Admin full access to storage
DROP POLICY IF EXISTS "Admin can manage blog images" ON storage.objects;
CREATE POLICY "Admin can manage blog images" ON storage.objects
  FOR ALL 
  USING (bucket_id = 'blog-images' AND auth.email() IN (SELECT email FROM admin_users))
  WITH CHECK (bucket_id = 'blog-images' AND auth.email() IN (SELECT email FROM admin_users));

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION increment_view_count(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION is_admin(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_blogs(text, int, int) TO anon, authenticated;

-- ============================================================================
-- END 03_admin_policies.sql
-- ============================================================================