-- Add auth_user_id to clients to link to supabase auth.users when present
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS auth_user_id UUID;

-- Optional index
CREATE INDEX IF NOT EXISTS idx_clients_auth_user_id ON clients(auth_user_id);
