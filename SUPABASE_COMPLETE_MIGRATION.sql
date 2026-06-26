-- ============================================================================
-- MIDEESSI v3 - Complete Database Setup
-- Apply migrations in order to Supabase SQL Editor
-- ============================================================================

-- Step 1: Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Step 2: Create clients system tables
-- ============================================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) UNIQUE NOT NULL,
  nom_marque VARCHAR(255) NOT NULL,
  nom_responsable VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  password_temp VARCHAR(255),
  password_changed BOOLEAN DEFAULT false,
  pack VARCHAR(50) NOT NULL CHECK (pack IN ('kpevi', 'eya', 'jago')),
  numero_contrat VARCHAR(100) NOT NULL,
  date_debut DATE NOT NULL,
  duree_mois INTEGER NOT NULL,
  est_periode_test BOOLEAN DEFAULT false,
  statut VARCHAR(50) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'suspendu')),
  auth_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_infos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) UNIQUE NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  description_activite TEXT,
  produits_phares TEXT,
  couleurs_marque TEXT,
  lien_logo TEXT,
  ton_souhaite TEXT[] DEFAULT ARRAY[]::TEXT[],
  lien_facebook TEXT,
  lien_tiktok TEXT,
  acces_facebook_login VARCHAR(255),
  acces_facebook_password VARCHAR(255),
  acces_tiktok_login VARCHAR(255),
  acces_tiktok_password VARCHAR(255),
  acces_facebook_admin_envoye BOOLEAN DEFAULT false,
  promotions_evenements TEXT,
  contact_urgence_nom VARCHAR(255),
  contact_urgence_tel VARCHAR(20),
  soumis_le TIMESTAMP WITH TIME ZONE,
  modifie_le TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  mois DATE NOT NULL,
  publications_livrees INTEGER DEFAULT 0,
  publications_prevues INTEGER DEFAULT 16,
  taux_engagement FLOAT DEFAULT 0,
  croissance_abonnes INTEGER DEFAULT 0,
  messages_generes INTEGER DEFAULT 0,
  budget_pub_depense INTEGER DEFAULT 0,
  budget_pub_alloue INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id, mois)
);

CREATE TABLE IF NOT EXISTS calendrier_editorial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  date_publication DATE NOT NULL,
  plateforme VARCHAR(50) NOT NULL CHECK (plateforme IN ('facebook', 'tiktok')),
  theme TEXT NOT NULL,
  statut VARCHAR(50) DEFAULT 'planifie' CHECK (statut IN ('planifie', 'publie', 'en_attente_validation')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rapports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  mois DATE NOT NULL,
  titre VARCHAR(255) NOT NULL,
  url_pdf TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  expediteur VARCHAR(50) NOT NULL CHECK (expediteur IN ('client', 'admin')),
  contenu TEXT NOT NULL,
  lu BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Create indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_client_id ON clients(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_statut ON clients(statut);
CREATE INDEX IF NOT EXISTS idx_clients_auth_user_id ON clients(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_client_infos_client_id ON client_infos(client_id);
CREATE INDEX IF NOT EXISTS idx_kpis_client_id ON kpis(client_id);
CREATE INDEX IF NOT EXISTS idx_kpis_mois ON kpis(mois);
CREATE INDEX IF NOT EXISTS idx_calendrier_client_id ON calendrier_editorial(client_id);
CREATE INDEX IF NOT EXISTS idx_calendrier_date ON calendrier_editorial(date_publication);
CREATE INDEX IF NOT EXISTS idx_rapports_client_id ON rapports(client_id);
CREATE INDEX IF NOT EXISTS idx_rapports_mois ON rapports(mois);
CREATE INDEX IF NOT EXISTS idx_livrables_client_id ON livrables(client_id);
CREATE INDEX IF NOT EXISTS idx_livrables_created_at ON livrables(created_at);
CREATE INDEX IF NOT EXISTS idx_factures_client_id ON factures(client_id);
CREATE INDEX IF NOT EXISTS idx_factures_emitted_at ON factures(emitted_at);
CREATE INDEX IF NOT EXISTS idx_messages_client_id ON messages(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_lu ON messages(lu);

-- Step 4: Enable RLS on all tables
-- ============================================================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_infos ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendrier_editorial ENABLE ROW LEVEL SECURITY;
ALTER TABLE rapports ENABLE ROW LEVEL SECURITY;
ALTER TABLE livrables ENABLE ROW LEVEL SECURITY;
ALTER TABLE factures ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Step 5: Admin policies (allow all for admin/service role)
-- ============================================================================
DROP POLICY IF EXISTS "Allow admin to insert clients" ON clients;
DROP POLICY IF EXISTS "Allow admin to select clients" ON clients;
DROP POLICY IF EXISTS "Allow admin to update clients" ON clients;

CREATE POLICY "Allow admin to insert clients" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin to select clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow admin to update clients" ON clients FOR UPDATE WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin to insert client infos" ON client_infos;
DROP POLICY IF EXISTS "Allow admin to select client infos" ON client_infos;
DROP POLICY IF EXISTS "Allow admin to update client infos" ON client_infos;

CREATE POLICY "Allow admin to insert client infos" ON client_infos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin to select client infos" ON client_infos FOR SELECT USING (true);
CREATE POLICY "Allow admin to update client infos" ON client_infos FOR UPDATE WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin to insert kpis" ON kpis;
DROP POLICY IF EXISTS "Allow admin to select kpis" ON kpis;
DROP POLICY IF EXISTS "Allow admin to update kpis" ON kpis;

CREATE POLICY "Allow admin to insert kpis" ON kpis FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin to select kpis" ON kpis FOR SELECT USING (true);
CREATE POLICY "Allow admin to update kpis" ON kpis FOR UPDATE WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin to insert calendar entries" ON calendrier_editorial;
DROP POLICY IF EXISTS "Allow admin to select calendar entries" ON calendrier_editorial;
DROP POLICY IF EXISTS "Allow admin to update calendar entries" ON calendrier_editorial;

CREATE POLICY "Allow admin to insert calendar entries" ON calendrier_editorial FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin to select calendar entries" ON calendrier_editorial FOR SELECT USING (true);
CREATE POLICY "Allow admin to update calendar entries" ON calendrier_editorial FOR UPDATE WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin to insert rapports" ON rapports;
DROP POLICY IF EXISTS "Allow admin to select rapports" ON rapports;
DROP POLICY IF EXISTS "Allow admin to update rapports" ON rapports;

CREATE POLICY "Allow admin to insert rapports" ON rapports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin to select rapports" ON rapports FOR SELECT USING (true);
CREATE POLICY "Allow admin to update rapports" ON rapports FOR UPDATE WITH CHECK (true);

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

DROP POLICY IF EXISTS "Allow admin to insert messages" ON messages;
DROP POLICY IF EXISTS "Allow admin to select messages" ON messages;
DROP POLICY IF EXISTS "Allow admin to update messages" ON messages;

CREATE POLICY "Allow admin to insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin to select messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow admin to update messages" ON messages FOR UPDATE WITH CHECK (true);

-- Step 6: Create sequences table for client ID generation
-- ============================================================================
CREATE TABLE IF NOT EXISTS sequences (
  pole TEXT PRIMARY KEY,
  dernier_num INTEGER DEFAULT 0 NOT NULL
);

INSERT INTO sequences(pole, dernier_num) VALUES
  ('presence_digitale', 0)
ON CONFLICT (pole) DO NOTHING;

INSERT INTO sequences(pole, dernier_num) VALUES
  ('dev_tech', 0)
ON CONFLICT (pole) DO NOTHING;

-- Step 7: Create next_client_id RPC function
-- ============================================================================
CREATE OR REPLACE FUNCTION next_client_id(pole_input TEXT)
RETURNS TEXT 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_num INTEGER;
  prefix TEXT;
BEGIN
  WITH upsert AS (
    INSERT INTO sequences(pole, dernier_num)
    VALUES (pole_input, 1)
    ON CONFLICT (pole) DO UPDATE SET dernier_num = sequences.dernier_num + 1
    RETURNING dernier_num
  )
  SELECT dernier_num INTO new_num FROM upsert;

  IF new_num IS NULL THEN
    UPDATE sequences SET dernier_num = dernier_num + 1 WHERE pole = pole_input RETURNING dernier_num INTO new_num;
  END IF;

  IF pole_input = 'presence_digitale' THEN
    prefix := 'PD-';
  ELSIF pole_input = 'dev_tech' THEN
    prefix := 'DT-';
  ELSE
    RAISE EXCEPTION 'Unknown pole: %', pole_input;
  END IF;

  RETURN prefix || LPAD(new_num::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Step 8: Configure RLS for sequences table
-- ============================================================================
ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public to call next_client_id via RPC" ON sequences;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON sequences;
DROP POLICY IF EXISTS "Allow authenticated and service role access" ON sequences;

CREATE POLICY "Allow authenticated and service role access" ON sequences
  FOR ALL
  USING (true);

GRANT EXECUTE ON FUNCTION next_client_id(TEXT) TO anon, authenticated, service_role;

-- Step 9: Create indexes for sequences
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_sequences_pole ON sequences(pole);

-- Step 10: Client-specific RLS policies
-- ============================================================================
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

DROP POLICY IF EXISTS "Allow client to select own livrables" ON livrables;
CREATE POLICY "Allow client to select own livrables" ON livrables
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM clients WHERE clients.client_id = livrables.client_id AND clients.auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Allow client to select own factures" ON factures;
CREATE POLICY "Allow client to select own factures" ON factures
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM clients WHERE clients.client_id = factures.client_id AND clients.auth_user_id = auth.uid()));

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- After applying this SQL, verify with:
-- SELECT COUNT(*) as sequences_count FROM sequences;
-- SELECT exists(SELECT 1 FROM pg_proc WHERE proname = 'next_client_id');
-- ============================================================================
