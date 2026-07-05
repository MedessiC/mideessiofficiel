-- =============================================================================
-- MIGRATION: Marquer un livre comme terminé
-- Date: 20260707
-- Description:
--   1. Ajoute un indicateur explicite de lecture terminée au suivi de progression des livres.
-- =============================================================================

ALTER TABLE book_progress
  ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE NOT NULL;

COMMENT ON COLUMN book_progress.is_completed IS 'Indique si l’utilisateur a confirmé la lecture complète du livre.';
