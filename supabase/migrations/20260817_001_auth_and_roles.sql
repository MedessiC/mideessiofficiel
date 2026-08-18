-- ============================================================
-- MIDEESSI — Migration fondatrice
-- Auth, profils et système de rôles
-- ============================================================

-- ── 1. Types personnalisés ───────────────────────────────────
-- Rôle applicatif de chaque utilisateur
CREATE TYPE public.app_role AS ENUM (
  'admin',
  'cofondateur',
  'membre'
);

-- ── 2. Table profiles ────────────────────────────────────────
-- Miroir public de auth.users, enrichi des données métier.
-- Créé automatiquement à l'inscription via trigger.
CREATE TABLE public.profiles (
  -- Clé primaire = id de l'utilisateur Supabase Auth
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Infos de base
  username        TEXT UNIQUE,
  full_name       TEXT,
  avatar_url      TEXT,

  -- Coordonnées
  email           TEXT,
  phone           TEXT,

  -- Localisation & identité
  nationality     TEXT,
  location        TEXT,

  -- Rôle applicatif (admin, cofondateur, membre)
  role            public.app_role NOT NULL DEFAULT 'membre',

  -- Statut du compte
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  is_banned       BOOLEAN NOT NULL DEFAULT FALSE,
  ban_reason      TEXT,

  -- Horodatages
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index utiles
CREATE INDEX idx_profiles_role     ON public.profiles(role);
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_email    ON public.profiles(email);

-- ── 3. Trigger de mise à jour automatique de updated_at ──────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 4. Trigger d'auto-création du profil à l'inscription ─────
-- Se déclenche dès qu'un utilisateur est créé dans auth.users
-- (inscription classique ET OAuth Google).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _username  TEXT;
  _full_name TEXT;
BEGIN
  -- Récupère les métadonnées fournies lors de l'inscription
  _full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',  -- Google OAuth fournit "name"
    split_part(NEW.email, '@', 1)
  );

  -- Génère un username propre depuis le full_name ou l'email
  _username := lower(
    regexp_replace(
      unaccent(COALESCE(
        NEW.raw_user_meta_data->>'username',
        _full_name,
        split_part(NEW.email, '@', 1)
      )),
      '[^a-z0-9]', '_', 'g'
    )
  );
  -- Tronque à 30 caractères max
  _username := left(_username, 30);
  -- Évite les doublons en suffixant avec les 4 derniers chiffres de l'UUID
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = _username) THEN
    _username := _username || '_' || right(replace(NEW.id::TEXT, '-', ''), 4);
  END IF;

  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    email,
    phone,
    nationality,
    avatar_url,
    role
  ) VALUES (
    NEW.id,
    _username,
    _full_name,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE(NEW.raw_user_meta_data->>'nationality', NULL),
    -- Google OAuth fournit "avatar_url" ou "picture"
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      NULL
    ),
    'membre'  -- Tous les nouveaux inscrits sont "membre" par défaut
  )
  ON CONFLICT (id) DO NOTHING;  -- Sécurité : ne plante pas si déjà créé

  RETURN NEW;
END;
$$;

-- Attache le trigger sur auth.users
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 5. Fonction utilitaire : vérifier le rôle de l'appelant ─
-- Utilisée dans les politiques RLS de toutes les tables.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Fonction booléenne raccourcie pour "est admin ?"
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
      AND is_active = TRUE
      AND is_banned = FALSE
  );
$$;

-- ── 6. Activer Row Level Security ────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ── 7. Politiques RLS sur profiles ───────────────────────────

-- Lecture : tout utilisateur connecté peut lire tous les profils
-- (nécessaire pour afficher les noms, avatars, etc.)
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (TRUE);

-- Lecture publique des profils actifs (pour les visiteurs non connectés)
CREATE POLICY "profiles_select_public"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (is_active = TRUE AND is_banned = FALSE);

-- Modification : chaque utilisateur ne peut modifier que son propre profil
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    -- Un utilisateur ne peut PAS se changer son propre rôle
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- Admin : peut tout faire sur tous les profils (READ, UPDATE, DELETE)
CREATE POLICY "profiles_admin_all"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- INSERT : géré exclusivement par le trigger (SECURITY DEFINER)
-- On interdit l'insert direct depuis le client
CREATE POLICY "profiles_insert_trigger_only"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (FALSE);  -- Bloqué côté client, autorisé côté trigger (SECURITY DEFINER bypass RLS)

-- ── 8. Promotion des admins fondateurs ───────────────────────
-- Remplace les emails ci-dessous par les vrais comptes admin.
-- À exécuter UNE SEULE FOIS après la première connexion des fondateurs.
-- 
-- UPDATE public.profiles
--   SET role = 'admin'
--   WHERE email IN (
--     'admin@mideessi.com',
--     'fondateur@mideessi.com'
--   );
--
-- Ou pour promouvoir un cofondateur :
-- UPDATE public.profiles
--   SET role = 'cofondateur'
--   WHERE email = 'richy@mideessi.com';

-- ── 9. Extensions requises ────────────────────────────────────
-- unaccent : pour normaliser les noms avec accents en username
CREATE EXTENSION IF NOT EXISTS unaccent SCHEMA public;
