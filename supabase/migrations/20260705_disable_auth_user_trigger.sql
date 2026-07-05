-- Disable auth.users trigger that automatically creates profiles in public.users.
-- This trigger can fail for OAuth provider signups due to auth/row-level-security context.
-- We now rely on client-side profile creation via the ensure_user_profile RPC after login.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
