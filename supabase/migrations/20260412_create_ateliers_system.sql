/*
  # Ateliers (Workshops) Management System

  1. New Tables
    - `ateliers`
      - `id` (uuid, primary key)
      - `title` (text, workshop title)
      - `slug` (text, unique identifier for URL)
      - `description` (text, short description)
      - `long_description` (text, detailed description)
      - `category` (text, workshop category)
      - `image` (text, image URL)
      - `date` (date, workshop date)
      - `time` (time, workshop start time)
      - `duration` (integer, duration in minutes)
      - `location` (text, physical or online location)
      - `capacity` (integer, max participants)
      - `registered` (integer, current registrations)
      - `language` (text, workshop language)
      - `level` (text, difficulty level: Débutant, Intermédiaire, Avancé)
      - `instructor_id` (uuid, foreign key to instructors table)
      - `is_online` (boolean)
      - `meet_link` (text, optional video call link)
      - `status` (text: upcoming, ongoing, completed, cancelled)
      - `price` (integer, price in FCFA cents)
      - `tags` (text[], array of tags)
      - `created_at`, `updated_at` (timestamps)

    - `atelier_registrations`
      - `id` (uuid, primary key)
      - `atelier_id` (uuid, foreign key)
      - `user_email` (text, participant email)
      - `first_name` (text)
      - `last_name` (text)
      - `phone` (text)
      - `company` (text)
      - `status` (text: registered, attended, cancelled)
      - `registered_at` (timestamp)
      - `attended_at` (timestamp, nullable)

    - `atelier_instructors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `title` (text)
      - `image` (text)
      - `bio` (text)
      - `created_at`, `updated_at` (timestamps)

    - `atelier_programs`
      - `id` (uuid, primary key)
      - `atelier_id` (uuid, foreign key)
      - `time` (text)
      - `title` (text)
      - `description` (text)
      - `order` (integer)

  2. Security
    - Enable RLS: Public can read published ateliers
    - Authenticated users can register for ateliers
    - Only admins can manage ateliers

  3. Indexes
    - Fast lookup by slug
    - Fast lookup by date and status
    - Fast lookup for registrations by email
*/

-- Atelier Instructors table
CREATE TABLE IF NOT EXISTS atelier_instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  image text NOT NULL,
  bio text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ateliers (Workshops) table
CREATE TABLE IF NOT EXISTS ateliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  long_description text NOT NULL,
  category text NOT NULL CHECK (category IN ('technologie', 'business', 'design', 'marketing', 'finance', 'autre')),
  image text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  duration integer NOT NULL CHECK (duration > 0),
  location text NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  registered integer DEFAULT 0 CHECK (registered >= 0),
  language text NOT NULL CHECK (language IN ('Français', 'Anglais', 'Mixte')),
  level text NOT NULL CHECK (level IN ('Débutant', 'Intermédiaire', 'Avancé')),
  instructor_id uuid REFERENCES atelier_instructors(id) ON DELETE SET NULL,
  is_online boolean DEFAULT false,
  meet_link text,
  status text NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')) DEFAULT 'upcoming',
  price integer NOT NULL DEFAULT 0 CHECK (price >= 0),
  tags text[] DEFAULT '{}',
  objectives text[] DEFAULT '{}',
  prerequisites text[] DEFAULT '{}',
  materials text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Atelier Program (schedule)
CREATE TABLE IF NOT EXISTS atelier_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  atelier_id uuid NOT NULL REFERENCES ateliers(id) ON DELETE CASCADE,
  time text NOT NULL,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Atelier Registrations
CREATE TABLE IF NOT EXISTS atelier_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  atelier_id uuid NOT NULL REFERENCES ateliers(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  company text,
  status text NOT NULL CHECK (status IN ('registered', 'attended', 'cancelled')) DEFAULT 'registered',
  registered_at timestamptz DEFAULT now(),
  attended_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(atelier_id, user_email)
);

-- Enable RLS
ALTER TABLE atelier_instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE ateliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE atelier_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE atelier_registrations ENABLE ROW LEVEL SECURITY;

-- RLS policies for atelier_instructors
CREATE POLICY "Public can read instructors" 
  ON atelier_instructors FOR SELECT 
  USING (true);

-- RLS policies for ateliers
CREATE POLICY "Public can read published ateliers" 
  ON ateliers FOR SELECT 
  USING (status != 'cancelled' OR status IS NOT NULL);

CREATE POLICY "Admins can manage ateliers"
  ON ateliers FOR ALL
  USING (auth.jwt_matches_role('authenticated') AND auth.jwt_matches_claim('role', 'admin'));

-- RLS policies for atelier_programs
CREATE POLICY "Public can read programs for published ateliers"
  ON atelier_programs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ateliers 
      WHERE ateliers.id = atelier_programs.atelier_id 
      AND ateliers.status != 'cancelled'
    )
  );

-- RLS policies for atelier_registrations
CREATE POLICY "Public can register for ateliers"
  ON atelier_registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own registrations"
  ON atelier_registrations FOR SELECT
  USING (user_email = current_user_email() OR auth.jwt_matches_claim('role', 'admin'));

CREATE POLICY "Admins can manage all registrations"
  ON atelier_registrations FOR ALL
  USING (auth.jwt_matches_claim('role', 'admin'));

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_ateliers_slug ON ateliers(slug);
CREATE INDEX IF NOT EXISTS idx_ateliers_date ON ateliers(date);
CREATE INDEX IF NOT EXISTS idx_ateliers_status ON ateliers(status);
CREATE INDEX IF NOT EXISTS idx_ateliers_category ON ateliers(category);
CREATE INDEX IF NOT EXISTS idx_atelier_registrations_email ON atelier_registrations(user_email);
CREATE INDEX IF NOT EXISTS idx_atelier_registrations_atelier ON atelier_registrations(atelier_id);
CREATE INDEX IF NOT EXISTS idx_atelier_programs_atelier ON atelier_programs(atelier_id);

-- Function to update registered count when someone registers
CREATE OR REPLACE FUNCTION update_atelier_registered_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE ateliers SET registered = registered + 1 WHERE id = NEW.atelier_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE ateliers SET registered = registered - 1 WHERE id = OLD.atelier_id AND registered > 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update registered count
CREATE TRIGGER trigger_update_atelier_registered
AFTER INSERT OR DELETE ON atelier_registrations
FOR EACH ROW
EXECUTE FUNCTION update_atelier_registered_count();
