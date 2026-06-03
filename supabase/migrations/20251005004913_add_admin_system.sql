/*
  # Admin System for Blog Management

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on admins table
    - Only authenticated admins can manage content
    - Link admins to auth.users table
  
  3. Functions
    - Helper function to check if user is admin
*/

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admins
CREATE POLICY "Admins can view their own data"
  ON admins FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can update their own data"
  ON admins FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update blog_posts policies to use is_admin
DROP POLICY IF EXISTS "Authenticated users can create posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete posts" ON blog_posts;

CREATE POLICY "Admins can create posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (is_admin());

-- Update blog_categories policies
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON blog_categories;

CREATE POLICY "Admins can manage categories"
  ON blog_categories FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Update analytics policies
DROP POLICY IF EXISTS "Authenticated users can view analytics" ON site_analytics;

CREATE POLICY "Admins can view analytics"
  ON site_analytics FOR SELECT
  TO authenticated
  USING (is_admin());
