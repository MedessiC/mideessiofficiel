-- ============================================================================
-- OBJECTIVES & WEEKLY TARGETS SYSTEM
-- Created: 2026-04-14
-- ============================================================================

-- ============================================================================
-- TABLE: weekly_objectives
-- ============================================================================
CREATE TABLE IF NOT EXISTS weekly_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_value INTEGER,
  unit VARCHAR(100), -- ex: "publications", "followers", "engagement_rate", etc
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'achieved', 'failed', 'cancelled')),
  actual_value INTEGER,
  progress_percentage INTEGER DEFAULT 0,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  category VARCHAR(50), -- ex: "content", "engagement", "growth", "roi"
  validated_by_admin BOOLEAN DEFAULT false,
  validated_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: global_objectives
-- ============================================================================
CREATE TABLE IF NOT EXISTS global_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  service_start_date DATE NOT NULL,
  service_end_date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_value INTEGER,
  unit VARCHAR(100),
  current_value INTEGER DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  category VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: client_reports
-- ============================================================================
CREATE TABLE IF NOT EXISTS client_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  period_month DATE NOT NULL, -- First day of the month
  title VARCHAR(255) NOT NULL,
  description TEXT,
  metrics_data JSONB, -- Flexible storage for various metrics
  summary TEXT,
  file_url TEXT,
  generated_by_admin VARCHAR(255),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id, period_month)
);

-- ============================================================================
-- TABLE: editorial_calendar_items
-- ============================================================================
CREATE TABLE IF NOT EXISTS editorial_calendar_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(20) NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('facebook', 'tiktok', 'instagram', 'linkedin')),
  content_type VARCHAR(100), -- ex: "post", "story", "reel", "video"
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_brief TEXT,
  status VARCHAR(50) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'published', 'cancelled', 'postponed')),
  content_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_weekly_objectives_client_id ON weekly_objectives(client_id);
CREATE INDEX IF NOT EXISTS idx_weekly_objectives_week_start ON weekly_objectives(week_start);
CREATE INDEX IF NOT EXISTS idx_weekly_objectives_status ON weekly_objectives(status);
CREATE INDEX IF NOT EXISTS idx_global_objectives_client_id ON global_objectives(client_id);
CREATE INDEX IF NOT EXISTS idx_global_objectives_status ON global_objectives(status);
CREATE INDEX IF NOT EXISTS idx_client_reports_client_id ON client_reports(client_id);
CREATE INDEX IF NOT EXISTS idx_client_reports_period_month ON client_reports(period_month);
CREATE INDEX IF NOT EXISTS idx_editorial_calendar_client_id ON editorial_calendar_items(client_id);
CREATE INDEX IF NOT EXISTS idx_editorial_calendar_date ON editorial_calendar_items(date);
CREATE INDEX IF NOT EXISTS idx_editorial_calendar_platform ON editorial_calendar_items(platform);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE weekly_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE editorial_calendar_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow admin to manage weekly objectives" ON weekly_objectives;
DROP POLICY IF EXISTS "Allow clients to view their weekly objectives" ON weekly_objectives;
DROP POLICY IF EXISTS "Allow admin to manage global objectives" ON global_objectives;
DROP POLICY IF EXISTS "Allow clients to view their global objectives" ON global_objectives;
DROP POLICY IF EXISTS "Allow admin to manage reports" ON client_reports;
DROP POLICY IF EXISTS "Allow clients to view their reports" ON client_reports;
DROP POLICY IF EXISTS "Allow admin to manage editorial calendar" ON editorial_calendar_items;
DROP POLICY IF EXISTS "Allow clients to view their editorial calendar" ON editorial_calendar_items;

-- Weekly Objectives Policies
CREATE POLICY "Allow admin to manage weekly objectives" ON weekly_objectives
  FOR ALL WITH CHECK (true);

CREATE POLICY "Allow clients to view their weekly objectives" ON weekly_objectives
  FOR SELECT USING (true);

-- Global Objectives Policies
CREATE POLICY "Allow admin to manage global objectives" ON global_objectives
  FOR ALL WITH CHECK (true);

CREATE POLICY "Allow clients to view their global objectives" ON global_objectives
  FOR SELECT USING (true);

-- Client Reports Policies
CREATE POLICY "Allow admin to manage reports" ON client_reports
  FOR ALL WITH CHECK (true);

CREATE POLICY "Allow clients to view their reports" ON client_reports
  FOR SELECT USING (true);

-- Editorial Calendar Policies
CREATE POLICY "Allow admin to manage editorial calendar" ON editorial_calendar_items
  FOR ALL WITH CHECK (true);

CREATE POLICY "Allow clients to view their editorial calendar" ON editorial_calendar_items
  FOR SELECT USING (true);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate progress based on achieved weekly objectives
CREATE OR REPLACE FUNCTION calculate_global_progress(client_id_param VARCHAR(20))
RETURNS VOID AS $$
DECLARE
  global_objs RECORD;
  achieved_count INTEGER;
  total_count INTEGER;
  new_progress INTEGER;
BEGIN
  FOR global_objs IN
    SELECT id, target_value FROM global_objectives 
    WHERE client_id = client_id_param AND status = 'active'
  LOOP
    -- Count achieved weekly objectives for this category
    SELECT 
      COUNT(CASE WHEN status = 'achieved' THEN 1 END) as achieved,
      COUNT(*) as total
    INTO achieved_count, total_count
    FROM weekly_objectives
    WHERE client_id = client_id_param AND status IN ('achieved', 'failed');

    -- Calculate progress percentage
    IF total_count > 0 THEN
      new_progress := (achieved_count * 100) / total_count;
    ELSE
      new_progress := 0;
    END IF;

    -- Update the global objective
    UPDATE global_objectives
    SET progress_percentage = new_progress,
        updated_at = NOW(),
        current_value = CASE 
          WHEN current_value IS NULL THEN 0 
          ELSE current_value + achieved_count 
        END
    WHERE id = global_objs.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
