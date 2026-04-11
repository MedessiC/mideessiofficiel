/*
  # Hero Slides Management
  
  1. New Tables
    - `hero_slides`
      - `id` (uuid, primary key)
      - `page` (text, page name: home, offres, etc.)
      - `badge` (text, category/badge text)
      - `title` (text, main title)
      - `description` (text, main description)
      - `subtitle` (text, secondary description)
      - `image` (text, image URL)
      - `primary_cta_text` (text, primary button text)
      - `primary_cta_link` (text, primary button link)
      - `secondary_cta_text` (text, secondary button text)
      - `secondary_cta_link` (text, secondary button link)
      - `order` (integer, display order)
      - `is_active` (boolean)
      - `updated_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS: Public can read
    - Only admins can update
*/

-- Hero slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL DEFAULT 'home',
  badge text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  primary_cta_text text NOT NULL DEFAULT '',
  primary_cta_link text NOT NULL DEFAULT '',
  secondary_cta_text text NOT NULL DEFAULT '',
  secondary_cta_link text NOT NULL DEFAULT '',
  "order" integer DEFAULT 0,
  is_active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Public can read active hero slides
CREATE POLICY "Public can read hero slides"
  ON hero_slides FOR SELECT
  TO public
  USING (is_active = true);

-- Only admins can update
CREATE POLICY "Admins can update hero slides"
  ON hero_slides FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Admins can create
CREATE POLICY "Admins can create hero slides"
  ON hero_slides FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_hero_slides_page ON hero_slides(page);
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides(page, "order");

-- Seed default hero slides for home page
INSERT INTO hero_slides (page, badge, title, description, subtitle, image, primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link, "order")
VALUES 
  ('home', '100% Béninois', 'Nous sommes indépendants', 'MIDEESSI c''est le mouvement qui dit non à la dépendance technologique. On crée nos solutions, avec nos talents, notre vision.', 'Pas d''importation. Pas de dépendance. Juste de l''innovation qui vient du terrain.', '/hero1.webp', 'MIDEESSI Learn', '/learn', 'Nos projets', '/projects', 0),
  ('home', 'Innovation de terrain', 'Du problème à la solution', 'Chaque trimestre on se jette dans un secteur. On écoute. On observe. On crée. Les solutions MIDEESSI? Elles viennent de la vraie vie.', 'Agriculture, santé, commerce, éducation... On crée où c''est nécessaire.', '/hero2.webp', 'Découvrir nos solutions', '/solutions', 'En savoir plus', '/about', 1),
  ('home', 'Souveraineté technologique', 'Consommons béninois', 'Les talents béninois existent. Les idées béninoises font sens. Les solutions béninoises changeront l''Afrique.', 'C''est notre mission. Bâtir l''indépendance technologique du Bénin, ensemble.', '/hero3.webp', 'Nos offres', '/offres', '', '', 2)
ON CONFLICT DO NOTHING;
