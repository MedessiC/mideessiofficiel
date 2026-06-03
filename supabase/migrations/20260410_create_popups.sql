/*
  # Pop-ups Management System

  1. New Tables
    - `popups`
      - `id` (uuid, primary key)
      - `title` (text, popup title)
      - `description` (text, popup content)
      - `type` (text: modal, slide-in, banner)
      - `trigger` (text: page_load, exit_intent, scroll, time_delay)
      - `promo_code` (text, code affiché)
      - `discount_percent` (integer, %)
      - `start_date` (date, quand afficher)
      - `end_date` (date, quand arrêter - compte à rebours automatique)
      - `is_active` (boolean)
      - `created_at`, `updated_at` (timestamps)

  2. Security
    - Enable RLS: Public can read active popups
    - Only admins can CRUD

  3. Indexes
    - Fast lookup by is_active
    - Date range queries
*/

-- Popups table
CREATE TABLE IF NOT EXISTS popups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  type text NOT NULL CHECK (type IN ('modal', 'slide-in', 'banner')) DEFAULT 'modal',
  trigger text NOT NULL CHECK (trigger IN ('page_load', 'exit_intent', 'scroll', 'time_delay')) DEFAULT 'page_load',
  pages text[] DEFAULT '{home,offres,learn}',
  image_url text DEFAULT '',
  promo_code text DEFAULT '',
  discount_percent integer DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  cta_link text DEFAULT '',
  cta_text text DEFAULT 'Je profite de cette offre',
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE popups ENABLE ROW LEVEL SECURITY;

-- Public can read active popups (within date range)
CREATE POLICY "Public can read active popups"
  ON popups FOR SELECT
  TO public
  USING (
    is_active = true 
    AND start_date <= CURRENT_DATE 
    AND (end_date IS NULL OR end_date >= CURRENT_DATE)
  );

-- Admins can CRUD all popups
CREATE POLICY "Admins can read all popups"
  ON popups FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Admins can create popups"
  ON popups FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Admins can update popups"
  ON popups FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Admins can delete popups"
  ON popups FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_popups_active ON popups(is_active);
CREATE INDEX IF NOT EXISTS idx_popups_dates ON popups(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_popups_type ON popups(type);

-- Seed sample popup
INSERT INTO popups (title, description, type, trigger, pages, image_url, promo_code, discount_percent, cta_link, cta_text, start_date, end_date)
VALUES 
  ('Offre Spéciale Avril', 'Profitez de 25% de réduction sur tous nos services - Nous sommes indépendants et fiers!', 'modal', 'page_load', '{home,offres}', '', 'AVRIL25', 25, '/offres', 'Découvrir les offres', CURRENT_DATE, CURRENT_DATE + INTERVAL '20 days')
ON CONFLICT DO NOTHING;
