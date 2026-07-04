-- =============================================================================
-- MIGRATION: Suivi de progression et marque-pages pour les livres
-- Date: 20260705
-- Description:
--   1. Crée la table book_progress pour sauvegarder l'avancement de la lecture
--   2. Configure les politiques de sécurité RLS (Row Level Security)
--   3. Crée des index de performance pour un chargement rapide
-- =============================================================================

CREATE TABLE IF NOT EXISTS book_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_page_read INTEGER DEFAULT 1 NOT NULL CHECK (last_page_read >= 1),
  progress_percent NUMERIC DEFAULT 0 NOT NULL CHECK (progress_percent >= 0 AND progress_percent <= 100),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  bookmarks JSONB DEFAULT '[]'::jsonb NOT NULL,
  UNIQUE(book_id, user_id)
);

-- RLS
ALTER TABLE book_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own book progress" ON book_progress;

CREATE POLICY "Users can manage their own book progress" ON book_progress
  FOR ALL
  USING (auth.uid() = (SELECT id FROM users WHERE id = user_id LIMIT 1))
  WITH CHECK (auth.uid() = (SELECT id FROM users WHERE id = user_id LIMIT 1));

-- Indexes de performance
CREATE INDEX IF NOT EXISTS idx_book_progress_user_book ON book_progress(user_id, book_id);
CREATE INDEX IF NOT EXISTS idx_book_progress_last_read ON book_progress(last_read_at DESC);
