-- Fix user profile creation for Supabase auth signups
CREATE OR REPLACE FUNCTION public.ensure_user_profile(
  p_user_id UUID,
  p_email TEXT,
  p_username TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.users (id, email, username)
  VALUES (
    p_user_id,
    COALESCE(NULLIF(TRIM(p_email), ''), ''),
    COALESCE(NULLIF(TRIM(p_username), ''), 'user')
  )
  ON CONFLICT (id) DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_user_profile(UUID, TEXT, TEXT) TO authenticated;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'users'
      AND policyname = 'Users can read their own data'
  ) THEN
    DROP POLICY "Users can read their own data" ON public.users;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'users'
      AND policyname = 'Users can create their own profile'
  ) THEN
    DROP POLICY "Users can create their own profile" ON public.users;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'users'
      AND policyname = 'Users can update their own data'
  ) THEN
    DROP POLICY "Users can update their own data" ON public.users;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'users'
      AND policyname = 'Anyone can view profiles'
  ) THEN
    DROP POLICY "Anyone can view profiles" ON public.users;
  END IF;
END $$;

CREATE POLICY "Users can read their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Anyone can view profiles"
  ON public.users FOR SELECT
  USING (true);
