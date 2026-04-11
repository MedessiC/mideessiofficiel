/*
  # Hero Sections Management

  1. New Tables
    - `hero_sections`
      - `id` (uuid, primary key)
      - `page` (text, page name: home, offres, etc.)
      - `title` (text, main title)
      - `subtitle` (text, sub title)
      - `cta_text` (text, button text)
      - `cta_link` (text, button link)
      - `image_url` (text, background image)
      - `is_active` (boolean)
      - `updated_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS: Public can read
    - Only admins can update
*/

-- Hero sections table
CREATE TABLE IF NOT EXISTS hero_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  cta_text text NOT NULL DEFAULT '',
  cta_link text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  is_active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hero_sections ENABLE ROW LEVEL SECURITY;

-- Public can read hero sections
CREATE POLICY "Public can read hero sections"
  ON hero_sections FOR SELECT
  TO public
  USING (true);

-- Only admins can update
CREATE POLICY "Admins can update hero sections"
  ON hero_sections FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_hero_sections_page ON hero_sections(page);

-- Seed default hero sections
INSERT INTO hero_sections (page, title, subtitle, cta_text, cta_link)
VALUES 
  ('home', 'MIDEESSI', 'Solutions technologiques pour le Bénin', 'Découvrir', '/offres'),
  ('offres', 'Nos Offres', 'Deux approches pour transformer votre business', 'Voir', '/offres')
ON CONFLICT (page) DO NOTHING;
