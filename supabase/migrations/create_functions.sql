-- 006_create_functions.sql
-- Database functions

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(blog_id uuid)
RETURNS void AS $$
  UPDATE blogs
  SET view_count = view_count + 1
  WHERE id = blog_id;
$$ LANGUAGE sql SECURITY DEFINER;