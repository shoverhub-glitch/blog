-- 005_create_storage_bucket.sql
-- Storage bucket for blog images

-- Insert storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_file_types)
VALUES ('blog-images', 'blog-images', true, 5242880, '["image/jpeg", "image/png", "image/webp", "image/gif"]')
ON CONFLICT (id) DO NOTHING;

-- Storage policies
-- Public read access to blog-images
CREATE POLICY "Public can view blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Admin full access to blog-images
CREATE POLICY "Admin can manage blog images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'blog-images' 
    AND auth.email() IN (SELECT email FROM admin_users)
  );
