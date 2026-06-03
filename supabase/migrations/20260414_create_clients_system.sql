-- ============================================================================
-- CLIENTS SYSTEM TABLES
-- Created: 2026-04-14
-- ============================================================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- TABLE: clients
-- ============================================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) UNIQUE NOT NULL, -- e.g., "JASI-001"
  nom_marque VARCHAR(255) NOT NULL,
  nom_responsable VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- SHA256 hash of password
  password_temp VARCHAR(255), -- Temporary password for first login (plain text, should be hashed client-side)
  password_changed BOOLEAN DEFAULT false, -- Has client changed their password?
  pack VARCHAR(50) NOT NULL CHECK (pack IN ('kpevi', 'eya', 'jago')),
  numero_contrat VARCHAR(100) NOT NULL,
  date_debut DATE NOT NULL,
  duree_mois INTEGER NOT NULL,
  est_periode_test BOOLEAN DEFAULT false,
  statut VARCHAR(50) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'suspendu')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: client_infos
-- ============================================================================
CREATE TABLE IF NOT EXISTS client_infos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) UNIQUE NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  description_activite TEXT,
  produits_phares TEXT,
  couleurs_marque TEXT,
  lien_logo TEXT,
  ton_souhaite TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array: luxe, accessible, familial, professionnel
  lien_facebook TEXT,
  lien_tiktok TEXT,
  acces_facebook_login VARCHAR(255),
  acces_facebook_password VARCHAR(255), -- Encrypted
  acces_tiktok_login VARCHAR(255),
  acces_tiktok_password VARCHAR(255), -- Encrypted
  acces_facebook_admin_envoye BOOLEAN DEFAULT false,
  promotions_evenements TEXT,
  contact_urgence_nom VARCHAR(255),
  contact_urgence_tel VARCHAR(20),
  soumis_le TIMESTAMP WITH TIME ZONE,
  modifie_le TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- TABLE: kpis
-- ============================================================================
CREATE TABLE IF NOT EXISTS kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  mois DATE NOT NULL, -- First day of month
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

-- ============================================================================
-- TABLE: calendrier_editorial
-- ============================================================================
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

-- ============================================================================
-- TABLE: rapports
-- ============================================================================
CREATE TABLE IF NOT EXISTS rapports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  mois DATE NOT NULL,
  titre VARCHAR(255) NOT NULL,
  url_pdf TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: messages
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  expediteur VARCHAR(50) NOT NULL CHECK (expediteur IN ('client', 'admin')),
  contenu TEXT NOT NULL,
  lu BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_client_id ON clients(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_statut ON clients(statut);
CREATE INDEX IF NOT EXISTS idx_client_infos_client_id ON client_infos(client_id);
CREATE INDEX IF NOT EXISTS idx_kpis_client_id ON kpis(client_id);
CREATE INDEX IF NOT EXISTS idx_kpis_mois ON kpis(mois);
CREATE INDEX IF NOT EXISTS idx_calendrier_client_id ON calendrier_editorial(client_id);
CREATE INDEX IF NOT EXISTS idx_calendrier_date ON calendrier_editorial(date_publication);
CREATE INDEX IF NOT EXISTS idx_rapports_client_id ON rapports(client_id);
CREATE INDEX IF NOT EXISTS idx_rapports_mois ON rapports(mois);
CREATE INDEX IF NOT EXISTS idx_messages_client_id ON messages(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_lu ON messages(lu);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_infos ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendrier_editorial ENABLE ROW LEVEL SECURITY;
ALTER TABLE rapports ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CLIENTS TABLE POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow admin to insert clients" ON clients;
DROP POLICY IF EXISTS "Allow admin to select clients" ON clients;
DROP POLICY IF EXISTS "Allow admin to update clients" ON clients;
DROP POLICY IF EXISTS "Allow clients to select own record" ON clients;

-- Create new policies
CREATE POLICY "Allow admin to insert clients" ON clients
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admin to select clients" ON clients
  FOR SELECT
  USING (true);

CREATE POLICY "Allow admin to update clients" ON clients
  FOR UPDATE
  WITH CHECK (true);

-- ============================================================================
-- CLIENT_INFOS TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Allow admin to insert client infos" ON client_infos;
DROP POLICY IF EXISTS "Allow admin to select client infos" ON client_infos;
DROP POLICY IF EXISTS "Allow admin to update client infos" ON client_infos;

CREATE POLICY "Allow admin to insert client infos" ON client_infos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admin to select client infos" ON client_infos
  FOR SELECT
  USING (true);

CREATE POLICY "Allow admin to update client infos" ON client_infos
  FOR UPDATE
  WITH CHECK (true);

-- ============================================================================
-- KPIS TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Allow admin to insert kpis" ON kpis;
DROP POLICY IF EXISTS "Allow admin to select kpis" ON kpis;
DROP POLICY IF EXISTS "Allow admin to update kpis" ON kpis;

CREATE POLICY "Allow admin to insert kpis" ON kpis
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admin to select kpis" ON kpis
  FOR SELECT
  USING (true);

CREATE POLICY "Allow admin to update kpis" ON kpis
  FOR UPDATE
  WITH CHECK (true);

-- ============================================================================
-- CALENDRIER_EDITORIAL TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Allow admin to insert calendar entries" ON calendrier_editorial;
DROP POLICY IF EXISTS "Allow admin to select calendar entries" ON calendrier_editorial;
DROP POLICY IF EXISTS "Allow admin to update calendar entries" ON calendrier_editorial;

CREATE POLICY "Allow admin to insert calendar entries" ON calendrier_editorial
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admin to select calendar entries" ON calendrier_editorial
  FOR SELECT
  USING (true);

CREATE POLICY "Allow admin to update calendar entries" ON calendrier_editorial
  FOR UPDATE
  WITH CHECK (true);

-- ============================================================================
-- RAPPORTS TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Allow admin to insert rapports" ON rapports;
DROP POLICY IF EXISTS "Allow admin to select rapports" ON rapports;
DROP POLICY IF EXISTS "Allow admin to update rapports" ON rapports;

CREATE POLICY "Allow admin to insert rapports" ON rapports
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admin to select rapports" ON rapports
  FOR SELECT
  USING (true);

CREATE POLICY "Allow admin to update rapports" ON rapports
  FOR UPDATE
  WITH CHECK (true);

-- ============================================================================
-- MESSAGES TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Allow admin to insert messages" ON messages;
DROP POLICY IF EXISTS "Allow admin to select messages" ON messages;
DROP POLICY IF EXISTS "Allow admin to update messages" ON messages;

CREATE POLICY "Allow admin to insert messages" ON messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admin to select messages" ON messages
  FOR SELECT
  USING (true);

CREATE POLICY "Allow admin to update messages" ON messages
  FOR UPDATE
  WITH CHECK (true);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to generate client_id (JASI-XXX format)
CREATE OR REPLACE FUNCTION generate_client_id() 
RETURNS VARCHAR(20) AS $$
DECLARE
  new_id VARCHAR(20);
  max_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(client_id, 6) AS INTEGER)), 0) INTO max_num
  FROM clients
  WHERE client_id LIKE 'JASI-%';
  
  new_id := 'JASI-' || LPAD((max_num + 1)::TEXT, 3, '0');
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate temp password (12 alphanumeric characters)
CREATE OR REPLACE FUNCTION generate_temp_password() 
RETURNS VARCHAR(12) AS $$
BEGIN
  RETURN SUBSTRING(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    FLOOR(RANDOM() * 62)::INTEGER + 1,
    1
  ) || SUBSTRING(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    FLOOR(RANDOM() * 62)::INTEGER + 1,
    1
  ) || SUBSTRING(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    FLOOR(RANDOM() * 62)::INTEGER + 1,
    1
  ) || SUBSTRING(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    FLOOR(RANDOM() * 62)::INTEGER + 1,
    1
  ) || SUBSTRING(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    FLOOR(RANDOM() * 62)::INTEGER + 1,
    1
  ) || SUBSTRING(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    FLOOR(RANDOM() * 62)::INTEGER + 1,
    1
  ) || SUBSTRING(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    FLOOR(RANDOM() * 62)::INTEGER + 1,
    1
  ) || SUBSTRING(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    FLOOR(RANDOM() * 62)::INTEGER + 1,
    1
  ) || SUBSTRING(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    FLOOR(RANDOM() * 62)::INTEGER + 1,
    1
  ) || SUBSTRING(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    FLOOR(RANDOM() * 62)::INTEGER + 1,
    1
  ) || SUBSTRING(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    FLOOR(RANDOM() * 62)::INTEGER + 1,
    1
  ) || SUBSTRING(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    FLOOR(RANDOM() * 62)::INTEGER + 1,
    1
  );
END;
$$ LANGUAGE plpgsql;
