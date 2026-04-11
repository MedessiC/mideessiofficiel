/*
  # Promo Codes Management System

  1. New Tables
    - `promo_codes`
      - `id` (uuid, primary key)
      - `code` (text unique, code to use)
      - `discount_percent` (integer, reduction %)
      - `applicable_services` (text array, which services)
      - `max_uses` (integer, nil = unlimited)
      - `current_uses` (integer, active count)
      - `start_date` (date)
      - `end_date` (date)
      - `is_active` (boolean)
      - `notes` (text, internal notes)
      - `created_at`, `updated_at` (timestamps)

  2. Security
    - Enable RLS: Public can read active codes
    - Only admins can CRUD

  3. Indexes
    - Fast lookup by code
    - Date ranges
    - Active status
*/

-- Promo codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_percent integer NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  applicable_services text[] DEFAULT '{vitrine,ecommerce,mobile,webapp,presence}',
  max_uses integer,
  current_uses integer DEFAULT 0,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  is_active boolean DEFAULT true,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Public can read active codes (within date range)
CREATE POLICY "Public can read active promo codes"
  ON promo_codes FOR SELECT
  TO public
  USING (
    is_active = true 
    AND start_date <= CURRENT_DATE 
    AND (end_date IS NULL OR end_date >= CURRENT_DATE)
    AND (max_uses IS NULL OR current_uses < max_uses)
  );

-- Admins can read all codes
CREATE POLICY "Admins can read all promo codes"
  ON promo_codes FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Admins can create codes
CREATE POLICY "Admins can create promo codes"
  ON promo_codes FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Admins can update codes
CREATE POLICY "Admins can update promo codes"
  ON promo_codes FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Admins can delete codes
CREATE POLICY "Admins can delete promo codes"
  ON promo_codes FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_promo_codes_dates ON promo_codes(start_date, end_date);

-- Seed sample promo code (optional, comment out if not needed)
INSERT INTO promo_codes (code, discount_percent, applicable_services, max_uses, start_date, end_date, notes)
VALUES 
  ('AVRIL25', 25, '{vitrine,ecommerce,mobile,webapp,presence}', NULL, CURRENT_DATE, CURRENT_DATE + INTERVAL '20 days', 'Offre Flash Avril 2026')
ON CONFLICT (code) DO NOTHING;
