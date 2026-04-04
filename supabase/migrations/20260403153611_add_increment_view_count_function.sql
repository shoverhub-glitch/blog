/*
  # Add increment view count function

  ## Overview
  Creates a database function to safely increment blog view counts.

  ## New Functions
  - `increment_view_count(blog_id uuid)` - Increments the view_count for a specific blog

  ## Security
  - Function is accessible to anonymous users (public blogs)
  - Uses atomic update to prevent race conditions
*/

CREATE OR REPLACE FUNCTION increment_view_count(blog_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blogs
  SET view_count = view_count + 1
  WHERE id = blog_id AND published = true;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_view_count(uuid) TO anon, authenticated;