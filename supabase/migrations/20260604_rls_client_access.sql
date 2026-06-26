-- RLS: allow clients (authenticated users) to access their own data

-- clients: allow select where auth.uid() matches auth_user_id
DROP POLICY IF EXISTS "Allow client to select own record" ON clients;
CREATE POLICY "Allow client to select own record" ON clients
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = auth_user_id);

-- client_infos: allow select/update where clients.client_id matches and auth.uid matches
DROP POLICY IF EXISTS "Allow client to select own infos" ON client_infos;
CREATE POLICY "Allow client to select own infos" ON client_infos
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM clients WHERE clients.client_id = client_infos.client_id AND clients.auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Allow client to update own infos" ON client_infos;
CREATE POLICY "Allow client to update own infos" ON client_infos
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM clients WHERE clients.client_id = client_infos.client_id AND clients.auth_user_id = auth.uid()))
  WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM clients WHERE clients.client_id = client_infos.client_id AND clients.auth_user_id = auth.uid()));

-- messages: allow clients to select/insert their own messages
DROP POLICY IF EXISTS "Allow client to select own messages" ON messages;
CREATE POLICY "Allow client to select own messages" ON messages
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM clients WHERE clients.client_id = messages.client_id AND clients.auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Allow client to insert messages" ON messages;
CREATE POLICY "Allow client to insert messages" ON messages
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM clients WHERE clients.client_id = messages.client_id AND clients.auth_user_id = auth.uid()));

-- rapports: clients can select their own rapports
DROP POLICY IF EXISTS "Allow client to select own rapports" ON rapports;
CREATE POLICY "Allow client to select own rapports" ON rapports
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM clients WHERE clients.client_id = rapports.client_id AND clients.auth_user_id = auth.uid()));
