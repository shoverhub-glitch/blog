-- 004_create_comments_system.sql
-- Comments system for blogs

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id uuid NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text NOT NULL,
  content text NOT NULL,
  approved boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_blog_id ON comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Create comment replies junction (for likes on comments)
CREATE TABLE IF NOT EXISTS comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(comment_id, user_email)
);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);

-- Function to get approved comments count
CREATE OR REPLACE FUNCTION get_comments_count(blog_id uuid)
RETURNS integer AS $$
  SELECT COUNT(*)::integer FROM comments WHERE blog_id = $1 AND approved = true;
$$ LANGUAGE sql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Public can read approved comments
CREATE POLICY "comments_read_policy" ON comments
  FOR SELECT USING (approved = true);

-- Public can insert comments
CREATE POLICY "comments_insert_policy" ON comments
  FOR INSERT WITH CHECK (true);

-- Admin can do everything
CREATE POLICY "comments_admin_policy" ON comments
  FOR ALL USING (auth.email() IN (SELECT email FROM admin_users));

-- Comment likes policies
CREATE POLICY "comment_likes_read_policy" ON comment_likes
  FOR SELECT USING (true);

CREATE POLICY "comment_likes_insert_policy" ON comment_likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "comment_likes_admin_policy" ON comment_likes
  FOR ALL USING (auth.email() IN (SELECT email FROM admin_users));
