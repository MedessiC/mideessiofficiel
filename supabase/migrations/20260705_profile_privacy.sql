-- =============================================================================
-- MIGRATION: Confidentialité de la Bibliothèque & Profil Public
-- Date: 20260705
-- Description:
--   1. Ajoute la colonne is_library_public à la table users
-- =============================================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_library_public BOOLEAN DEFAULT true NOT NULL;
