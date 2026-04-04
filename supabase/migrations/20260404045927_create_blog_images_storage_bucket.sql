/*
  # Create Blog Images Storage Bucket

  1. Storage Setup
    - Create `blog-images` bucket for storing blog cover images
    - Enable public access for published blog images
    - Set up RLS policies for admin-only uploads
    
  2. Security
    - Only authenticated admin users can upload images
    - Only authenticated admin users can delete images
    - Public users can view images (for published blogs)
    
  3. Storage Policies
    - Admin INSERT: Allow authenticated admins to upload
    - Admin DELETE: Allow authenticated admins to delete
    - Public SELECT: Allow anyone to view images
*/

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public users can view blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Admin users can upload blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Admin users can delete blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Admin users can update blog images" ON storage.objects;
END $$;

-- Allow public access to view images
CREATE POLICY "Public users can view blog images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'blog-images');

-- Allow authenticated admin users to upload images
CREATE POLICY "Admin users can upload blog images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'blog-images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Allow authenticated admin users to delete images
CREATE POLICY "Admin users can delete blog images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'blog-images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Allow authenticated admin users to update images
CREATE POLICY "Admin users can update blog images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'blog-images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    bucket_id = 'blog-images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );
