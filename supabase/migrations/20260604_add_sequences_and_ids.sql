-- ==========================================================================
-- Sequences table and next_client_id function
-- Created: 2026-06-04
-- Purpose: provide atomic, per-pole client_id generation (PD-/DT-)
-- ==========================================================================

-- Table to keep counters per pole
CREATE TABLE IF NOT EXISTS sequences (
  pole TEXT PRIMARY KEY,
  dernier_num INTEGER DEFAULT 0 NOT NULL
);

-- Initialize rows for known poles (idempotent)
INSERT INTO sequences(pole, dernier_num) VALUES
  ('presence_digitale', 0)
ON CONFLICT (pole) DO NOTHING;

INSERT INTO sequences(pole, dernier_num) VALUES
  ('dev_tech', 0)
ON CONFLICT (pole) DO NOTHING;

-- Function to atomically get next client id for a pole
-- SECURITY DEFINER allows the function to run with elevated privileges (owner permissions)
-- This is necessary for the function to work even when called by the anon key
CREATE OR REPLACE FUNCTION next_client_id(pole_input TEXT)
RETURNS TEXT 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_num INTEGER;
  prefix TEXT;
BEGIN
  WITH upsert AS (
    INSERT INTO sequences(pole, dernier_num)
    VALUES (pole_input, 1)
    ON CONFLICT (pole) DO UPDATE SET dernier_num = sequences.dernier_num + 1
    RETURNING dernier_num
  )
  SELECT dernier_num INTO new_num FROM upsert;

  IF new_num IS NULL THEN
    -- Fallback: select current and increment safely
    UPDATE sequences SET dernier_num = dernier_num + 1 WHERE pole = pole_input RETURNING dernier_num INTO new_num;
  END IF;

  IF pole_input = 'presence_digitale' THEN
    prefix := 'PD-';
  ELSIF pole_input = 'dev_tech' THEN
    prefix := 'DT-';
  ELSE
    RAISE EXCEPTION 'Unknown pole: %', pole_input;
  END IF;

  RETURN prefix || LPAD(new_num::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Safety index
CREATE INDEX IF NOT EXISTS idx_sequences_pole ON sequences(pole);

-- ============================================================================
-- RLS CONFIGURATION FOR SEQUENCES TABLE
-- ============================================================================

-- Enable RLS on sequences table (system table, limited access)
ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to call next_client_id via RPC" ON sequences;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON sequences;

-- Allow authenticated users and public to read sequences (needed for the RPC function)
CREATE POLICY "Allow authenticated and service role access" ON sequences
  FOR ALL
  USING (true);

-- Grant execute permission on the function to the anon role (public access)
GRANT EXECUTE ON FUNCTION next_client_id(TEXT) TO anon, authenticated, service_role;
