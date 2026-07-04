-- =============================================================================
-- MIGRATION: Système complet Livres — Likes, Commentaires, Sauvegardes, Partages
-- Date: 20260704
-- Description:
--   1. Crée les tables manquantes : book_saves, book_shares
--   2. Ajoute les colonnes manquantes sur book_comments (updated_at déjà là)
--   3. Fixe les politiques RLS sur book_comments et book_likes (UPDATE manquant)
--   4. Met en place les politiques RLS pour book_saves et book_shares
--   5. Ajoute les indexes de performance
--   6. Met à jour la contrainte user_id pour garantir la cohérence avec auth.uid()
--   7. Fonction compteur de vues sur les books
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. S'assurer que la table books existe (elle est gérée par AdminPdfs)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  description TEXT DEFAULT '',
  price NUMERIC DEFAULT 0,
  author TEXT DEFAULT 'MIDEESSI Team',
  cover_color TEXT DEFAULT 'from-blue-500 to-blue-700',
  cover_image TEXT DEFAULT '',
  article_url TEXT DEFAULT '',
  buy_url TEXT DEFAULT '',
  pdf_url TEXT DEFAULT '',
  week_added TEXT DEFAULT '',
  is_new BOOLEAN DEFAULT true,
  is_bestseller BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 4.5,
  students INTEGER DEFAULT 0,
  pages INTEGER DEFAULT 50,
  level TEXT DEFAULT 'Débutant',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Permettre à tout le monde de lire les livres
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'books' AND policyname = 'Anyone can view books'
  ) THEN
    CREATE POLICY "Anyone can view books" ON books FOR SELECT USING (true);
  END IF;
END $$;

-- Seuls les admins peuvent créer/modifier/supprimer des livres
-- (La gestion se fait via le panel admin avec Supabase Auth)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'books' AND policyname = 'Admins can manage books'
  ) THEN
    CREATE POLICY "Admins can manage books" ON books FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM admins WHERE id = auth.uid()
        )
      );
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. TABLE book_comments — Commentaires et notes sur les livres
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS book_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 3 AND char_length(content) <= 2000),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contrainte : un utilisateur ne peut laisser qu'un seul commentaire par livre
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'book_comments_book_user_unique'
  ) THEN
    ALTER TABLE book_comments ADD CONSTRAINT book_comments_book_user_unique UNIQUE (book_id, user_id);
  END IF;
END $$;

ALTER TABLE book_comments ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Anyone can view book comments" ON book_comments;
DROP POLICY IF EXISTS "Authenticated users can create book comments" ON book_comments;
DROP POLICY IF EXISTS "Users can delete their own book comments" ON book_comments;
DROP POLICY IF EXISTS "Users can update their own book comments" ON book_comments;

-- Recréer les politiques proprement
CREATE POLICY "Anyone can view book comments"
  ON book_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create book comments"
  ON book_comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = (SELECT id FROM users WHERE id = user_id LIMIT 1));

CREATE POLICY "Users can update their own book comments"
  ON book_comments FOR UPDATE
  USING (auth.uid() = (SELECT id FROM users WHERE id = user_id LIMIT 1));

CREATE POLICY "Users can delete their own book comments"
  ON book_comments FOR DELETE
  USING (auth.uid() = (SELECT id FROM users WHERE id = user_id LIMIT 1));

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_book_comment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_book_comment_updated_at ON book_comments;
CREATE TRIGGER trigger_book_comment_updated_at
  BEFORE UPDATE ON book_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_book_comment_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. TABLE book_likes — Likes sur les livres
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS book_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, user_id)
);

ALTER TABLE book_likes ENABLE ROW LEVEL SECURITY;

-- Supprimer et recréer les politiques
DROP POLICY IF EXISTS "Anyone can view book likes" ON book_likes;
DROP POLICY IF EXISTS "Authenticated users can create book likes" ON book_likes;
DROP POLICY IF EXISTS "Users can delete their own book likes" ON book_likes;

CREATE POLICY "Anyone can view book likes"
  ON book_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create book likes"
  ON book_likes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = (SELECT id FROM users WHERE id = user_id LIMIT 1));

CREATE POLICY "Users can delete their own book likes"
  ON book_likes FOR DELETE
  USING (auth.uid() = (SELECT id FROM users WHERE id = user_id LIMIT 1));

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. TABLE book_saves — Sauvegardes / Favoris de livres
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS book_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, user_id)
);

ALTER TABLE book_saves ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour book_saves
DROP POLICY IF EXISTS "Users can view their own saves" ON book_saves;
DROP POLICY IF EXISTS "Authenticated users can save books" ON book_saves;
DROP POLICY IF EXISTS "Users can delete their own saves" ON book_saves;

-- Un utilisateur ne voit que ses propres sauvegardes
CREATE POLICY "Users can view their own saves"
  ON book_saves FOR SELECT
  USING (auth.uid() = (SELECT id FROM users WHERE id = user_id LIMIT 1));

CREATE POLICY "Authenticated users can save books"
  ON book_saves FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = (SELECT id FROM users WHERE id = user_id LIMIT 1));

CREATE POLICY "Users can delete their own saves"
  ON book_saves FOR DELETE
  USING (auth.uid() = (SELECT id FROM users WHERE id = user_id LIMIT 1));

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. TABLE book_shares — Historique des partages
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS book_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  -- user_id peut être NULL pour les partages anonymes
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  -- Type de partage : 'clipboard', 'native', 'whatsapp', 'twitter', etc.
  share_type TEXT DEFAULT 'clipboard' CHECK (share_type IN ('clipboard', 'native', 'whatsapp', 'twitter', 'facebook', 'email', 'other')),
  -- Timestamp UTC du partage
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE book_shares ENABLE ROW LEVEL SECURITY;

-- Politiques pour book_shares
DROP POLICY IF EXISTS "Anyone can log a share" ON book_shares;
DROP POLICY IF EXISTS "Admins can view all shares" ON book_shares;
DROP POLICY IF EXISTS "Users can view their own shares" ON book_shares;

-- Tout le monde peut enregistrer un partage (y compris anonyme)
CREATE POLICY "Anyone can log a share"
  ON book_shares FOR INSERT
  WITH CHECK (true);

-- Les utilisateurs connectés voient leur historique de partages
CREATE POLICY "Users can view their own shares"
  ON book_shares FOR SELECT
  USING (
    user_id IS NULL -- partages anonymes non visibles
    OR auth.uid() = (SELECT id FROM users WHERE id = user_id LIMIT 1)
  );

-- Les admins voient tout
CREATE POLICY "Admins can view all shares"
  ON book_shares FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Compteur de vues sur les books (incrémenté à chaque visite de la page)
-- ─────────────────────────────────────────────────────────────────────────────

-- Ajouter la colonne views si elle n'existe pas encore
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'views'
  ) THEN
    ALTER TABLE books ADD COLUMN views INTEGER DEFAULT 0;
  END IF;
END $$;

-- Ajouter les colonnes manquantes si la table books existait déjà avant cette migration
ALTER TABLE books ADD COLUMN IF NOT EXISTS cover_color TEXT DEFAULT 'from-blue-500 to-blue-700';
ALTER TABLE books ADD COLUMN IF NOT EXISTS cover_image TEXT DEFAULT '';
ALTER TABLE books ADD COLUMN IF NOT EXISTS article_url TEXT DEFAULT '';
ALTER TABLE books ADD COLUMN IF NOT EXISTS buy_url TEXT DEFAULT '';
ALTER TABLE books ADD COLUMN IF NOT EXISTS pdf_url TEXT DEFAULT '';
ALTER TABLE books ADD COLUMN IF NOT EXISTS week_added TEXT DEFAULT '';
ALTER TABLE books ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT true;
ALTER TABLE books ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false;
ALTER TABLE books ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.5;
ALTER TABLE books ADD COLUMN IF NOT EXISTS students INTEGER DEFAULT 0;
ALTER TABLE books ADD COLUMN IF NOT EXISTS pages INTEGER DEFAULT 50;
ALTER TABLE books ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Débutant';

-- Fonction RPC pour incrémenter les vues de manière sécurisée (pas de RLS bypass nécessaire)
CREATE OR REPLACE FUNCTION increment_book_views(p_book_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE books SET views = COALESCE(views, 0) + 1 WHERE id = p_book_id;
END;
$$;

-- Autoriser tout utilisateur (même anonyme) à appeler cette fonction
REVOKE ALL ON FUNCTION increment_book_views(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_book_views(UUID) TO anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Fonction RPC pour basculer un like (toggle) de manière atomique
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION toggle_book_like(p_book_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_liked BOOLEAN;
  v_count INTEGER;
BEGIN
  -- Récupérer l'ID de l'utilisateur public depuis auth.uid()
  SELECT id INTO v_user_id FROM users WHERE id = auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  -- Vérifier si le like existe déjà
  SELECT EXISTS (
    SELECT 1 FROM book_likes
    WHERE book_id = p_book_id AND user_id = v_user_id
  ) INTO v_liked;

  IF v_liked THEN
    -- Supprimer le like
    DELETE FROM book_likes WHERE book_id = p_book_id AND user_id = v_user_id;
    v_liked := false;
  ELSE
    -- Ajouter le like
    INSERT INTO book_likes (book_id, user_id) VALUES (p_book_id, v_user_id)
    ON CONFLICT (book_id, user_id) DO NOTHING;
    v_liked := true;
  END IF;

  -- Compter le nombre de likes
  SELECT COUNT(*) INTO v_count FROM book_likes WHERE book_id = p_book_id;

  RETURN json_build_object('liked', v_liked, 'count', v_count);
END;
$$;

REVOKE ALL ON FUNCTION toggle_book_like(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION toggle_book_like(UUID) TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Fonction RPC pour basculer une sauvegarde (toggle) de manière atomique
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION toggle_book_save(p_book_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_saved BOOLEAN;
BEGIN
  SELECT id INTO v_user_id FROM users WHERE id = auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM book_saves
    WHERE book_id = p_book_id AND user_id = v_user_id
  ) INTO v_saved;

  IF v_saved THEN
    DELETE FROM book_saves WHERE book_id = p_book_id AND user_id = v_user_id;
    v_saved := false;
  ELSE
    INSERT INTO book_saves (book_id, user_id) VALUES (p_book_id, v_user_id)
    ON CONFLICT (book_id, user_id) DO NOTHING;
    v_saved := true;
  END IF;

  RETURN json_build_object('saved', v_saved);
END;
$$;

REVOKE ALL ON FUNCTION toggle_book_save(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION toggle_book_save(UUID) TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. Vue agrégée pour les statistiques d'un livre (utilisée par l'admin & la page détail)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW book_stats AS
SELECT
  b.id AS book_id,
  b.title,
  b.category,
  COALESCE(b.views, 0) AS views,
  COUNT(DISTINCT bl.id) AS likes_count,
  COUNT(DISTINCT bc.id) AS comments_count,
  COUNT(DISTINCT bs.id) AS saves_count,
  COUNT(DISTINCT bsh.id) AS shares_count,
  ROUND(AVG(bc.rating), 1) AS avg_rating
FROM books b
LEFT JOIN book_likes bl ON bl.book_id = b.id
LEFT JOIN book_comments bc ON bc.book_id = b.id
LEFT JOIN book_saves bs ON bs.book_id = b.id
LEFT JOIN book_shares bsh ON bsh.book_id = b.id
GROUP BY b.id, b.title, b.category, b.views;

-- Autoriser la lecture de la vue à tous
GRANT SELECT ON book_stats TO anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. Indexes de performance
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_book_comments_book_id    ON book_comments(book_id);
CREATE INDEX IF NOT EXISTS idx_book_comments_user_id    ON book_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_book_comments_created_at ON book_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_book_likes_book_id       ON book_likes(book_id);
CREATE INDEX IF NOT EXISTS idx_book_likes_user_id       ON book_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_book_saves_book_id       ON book_saves(book_id);
CREATE INDEX IF NOT EXISTS idx_book_saves_user_id       ON book_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_book_shares_book_id      ON book_shares(book_id);
CREATE INDEX IF NOT EXISTS idx_book_shares_user_id      ON book_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_book_shares_shared_at    ON book_shares(shared_at DESC);
CREATE INDEX IF NOT EXISTS idx_books_category           ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_created_at         ON books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_books_is_bestseller      ON books(is_bestseller) WHERE is_bestseller = true;
