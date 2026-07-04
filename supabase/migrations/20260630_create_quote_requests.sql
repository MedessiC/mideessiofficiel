-- ============================================================================
-- CREATE TABLE: quote_requests
-- Created: 2026-06-30
-- ============================================================================

CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) REFERENCES clients(client_id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  nom VARCHAR(255) NOT NULL,
  entreprise VARCHAR(255),
  telephone VARCHAR(50),
  offre_type VARCHAR(50) NOT NULL CHECK (offre_type IN ('presence', 'tech')),
  offre_slug VARCHAR(100),
  offre_nom VARCHAR(255) NOT NULL,
  message TEXT,
  attachment_url TEXT,
  attachment_type VARCHAR(50),
  quote_pdf_url TEXT,
  admin_comment TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'in_review', 'quote_ready', 'confirmed', 'rejected')),
  progress INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_client_id ON quote_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at);
