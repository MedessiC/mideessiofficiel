-- ============================================================================
-- CREATE TABLES: livrables + factures
-- Created: 2026-06-04
-- ============================================================================

CREATE TABLE IF NOT EXISTS livrables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('link', 'file', 'report')),
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS factures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  periode VARCHAR(100) NOT NULL,
  montant INTEGER NOT NULL,
  statut VARCHAR(50) NOT NULL DEFAULT 'En attente' CHECK (statut IN ('En attente', 'Payée', 'Annulée')),
  emitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_livrables_client_id ON livrables(client_id);
CREATE INDEX IF NOT EXISTS idx_livrables_created_at ON livrables(created_at);
CREATE INDEX IF NOT EXISTS idx_factures_client_id ON factures(client_id);
CREATE INDEX IF NOT EXISTS idx_factures_emitted_at ON factures(emitted_at);

ALTER TABLE livrables ENABLE ROW LEVEL SECURITY;
ALTER TABLE factures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow admin to insert livrables" ON livrables;
DROP POLICY IF EXISTS "Allow admin to select livrables" ON livrables;
DROP POLICY IF EXISTS "Allow admin to update livrables" ON livrables;
DROP POLICY IF EXISTS "Allow admin to delete livrables" ON livrables;

CREATE POLICY "Allow admin to insert livrables" ON livrables FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin to select livrables" ON livrables FOR SELECT USING (true);
CREATE POLICY "Allow admin to update livrables" ON livrables FOR UPDATE WITH CHECK (true);
CREATE POLICY "Allow admin to delete livrables" ON livrables FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow admin to insert factures" ON factures;
DROP POLICY IF EXISTS "Allow admin to select factures" ON factures;
DROP POLICY IF EXISTS "Allow admin to update factures" ON factures;
DROP POLICY IF EXISTS "Allow admin to delete factures" ON factures;

CREATE POLICY "Allow admin to insert factures" ON factures FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin to select factures" ON factures FOR SELECT USING (true);
CREATE POLICY "Allow admin to update factures" ON factures FOR UPDATE WITH CHECK (true);
CREATE POLICY "Allow admin to delete factures" ON factures FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow client to select own livrables" ON livrables;
CREATE POLICY "Allow client to select own livrables" ON livrables FOR SELECT USING (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM clients WHERE clients.client_id = livrables.client_id AND clients.auth_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Allow client to select own factures" ON factures;
CREATE POLICY "Allow client to select own factures" ON factures FOR SELECT USING (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM clients WHERE clients.client_id = factures.client_id AND clients.auth_user_id = auth.uid()
  )
);
