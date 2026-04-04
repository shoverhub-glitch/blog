/*
  # Add Admin Write Policies for Categories and Blog Tags

  ## Why
  - Admin UI performs INSERT/UPDATE/DELETE on `categories`.
  - Blog editor updates `blog_tags` via DELETE + INSERT.
  - Existing schema only grants public SELECT on these tables.

  ## What
  - Add admin-only write policies for categories and blog_tags.
  - Keep existing public read policies unchanged.
*/

DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can create categories" ON categories;
  DROP POLICY IF EXISTS "Admins can update categories" ON categories;
  DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

  DROP POLICY IF EXISTS "Admins can create blog tags" ON blog_tags;
  DROP POLICY IF EXISTS "Admins can update blog tags" ON blog_tags;
  DROP POLICY IF EXISTS "Admins can delete blog tags" ON blog_tags;
END $$;

CREATE POLICY "Admins can create categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can create blog tags"
  ON blog_tags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update blog tags"
  ON blog_tags FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete blog tags"
  ON blog_tags FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );
