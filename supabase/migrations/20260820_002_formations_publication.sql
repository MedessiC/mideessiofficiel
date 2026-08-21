-- Catalogue MIDEESSI Learn : formations publiées et brouillons.
-- Les livres sont déjà gérés par la table `books` et l'éditeur /admin/pdfs.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT,
  level TEXT,
  duration TEXT,
  price NUMERIC NOT NULL DEFAULT 0 CHECK (price >= 0),
  cover TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Rend la migration compatible avec une éventuelle table déjà créée manuellement.
ALTER TABLE public.formations ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.formations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
UPDATE public.formations SET is_published = TRUE WHERE is_published IS NULL;

CREATE INDEX IF NOT EXISTS idx_formations_public_catalog
  ON public.formations (created_at DESC)
  WHERE is_published = TRUE;

ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "formations_public_read_published" ON public.formations;
CREATE POLICY "formations_public_read_published"
  ON public.formations FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "formations_admin_manage" ON public.formations;
CREATE POLICY "formations_admin_manage"
  ON public.formations FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS trg_formations_updated_at ON public.formations;
CREATE TRIGGER trg_formations_updated_at
  BEFORE UPDATE ON public.formations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
