-- ============================================================================
-- FIX RLS POLICIES - Fix permissions for clients
-- Created: 2026-04-15
-- Purpose: Allow clients to save their information without destroying existing data
-- ============================================================================

-- ============================================================================
-- CLIENT_INFOS TABLE POLICIES - Fix for upsert operations
-- ============================================================================

-- Drop only the restrictive policies (won't affect data)
DROP POLICY IF EXISTS "Allow admin to insert client infos" ON client_infos;
DROP POLICY IF EXISTS "Allow admin to select client infos" ON client_infos;
DROP POLICY IF EXISTS "Allow admin to update client infos" ON client_infos;

-- Recreate with proper permissions for both clients and admin
CREATE POLICY "Allow all to insert client infos" ON client_infos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to select client infos" ON client_infos
  FOR SELECT
  USING (true);

CREATE POLICY "Allow all to update client infos" ON client_infos
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Add delete policy for admin if needed
CREATE POLICY "Allow all to delete client infos" ON client_infos
  FOR DELETE
  USING (true);

-- ============================================================================
-- KPIS TABLE POLICIES - Fix for client operations
-- ============================================================================

DROP POLICY IF EXISTS "Allow admin to insert kpis" ON kpis;
DROP POLICY IF EXISTS "Allow admin to select kpis" ON kpis;
DROP POLICY IF EXISTS "Allow admin to update kpis" ON kpis;

CREATE POLICY "Allow all to insert kpis" ON kpis
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to select kpis" ON kpis
  FOR SELECT
  USING (true);

CREATE POLICY "Allow all to update kpis" ON kpis
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all to delete kpis" ON kpis
  FOR DELETE
  USING (true);

-- ============================================================================
-- CALENDRIER_EDITORIAL TABLE POLICIES - Fix for client operations
-- ============================================================================

DROP POLICY IF EXISTS "Allow admin to insert calendar entries" ON calendrier_editorial;
DROP POLICY IF EXISTS "Allow admin to select calendar entries" ON calendrier_editorial;
DROP POLICY IF EXISTS "Allow admin to update calendar entries" ON calendrier_editorial;

CREATE POLICY "Allow all to insert calendar entries" ON calendrier_editorial
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to select calendar entries" ON calendrier_editorial
  FOR SELECT
  USING (true);

CREATE POLICY "Allow all to update calendar entries" ON calendrier_editorial
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all to delete calendar entries" ON calendrier_editorial
  FOR DELETE
  USING (true);

-- ============================================================================
-- RAPPORTS TABLE POLICIES - Fix for client operations
-- ============================================================================

DROP POLICY IF EXISTS "Allow admin to insert rapports" ON rapports;
DROP POLICY IF EXISTS "Allow admin to select rapports" ON rapports;
DROP POLICY IF EXISTS "Allow admin to update rapports" ON rapports;

CREATE POLICY "Allow all to insert rapports" ON rapports
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to select rapports" ON rapports
  FOR SELECT
  USING (true);

CREATE POLICY "Allow all to update rapports" ON rapports
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all to delete rapports" ON rapports
  FOR DELETE
  USING (true);

-- ============================================================================
-- MESSAGES TABLE POLICIES - Fix for client operations
-- ============================================================================

DROP POLICY IF EXISTS "Allow admin to insert messages" ON messages;
DROP POLICY IF EXISTS "Allow admin to select messages" ON messages;
DROP POLICY IF EXISTS "Allow admin to update messages" ON messages;

CREATE POLICY "Allow all to insert messages" ON messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to select messages" ON messages
  FOR SELECT
  USING (true);

CREATE POLICY "Allow all to update messages" ON messages
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all to delete messages" ON messages
  FOR DELETE
  USING (true);

-- ============================================================================
-- Note: This migration only modifies RLS policies
-- No data is created, modified, or deleted
-- All existing data in all tables is preserved
-- ============================================================================
