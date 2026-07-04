-- =============================================================================
-- MIGRATION: Notes d'études synchronisées et extension de book_progress
-- Date: 20260705
-- Description:
--   1. Ajoute la colonne study_notes à la table book_progress si non existante
-- =============================================================================

ALTER TABLE book_progress ADD COLUMN IF NOT EXISTS study_notes TEXT DEFAULT '';
