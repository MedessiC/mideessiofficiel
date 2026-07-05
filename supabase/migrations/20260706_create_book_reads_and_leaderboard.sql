-- =============================================================================
-- MIGRATION: book_reads + public leaderboard view
-- Date: 20260706
-- Description:
--   1. Create table `book_reads` to store per-visit read events (anonymous or authed)
--   2. Enable RLS and allow inserts from anonymous users for logging reads
--   3. Create view `book_leaderboard` aggregating quiz scores per book (public)
-- =============================================================================

CREATE TABLE IF NOT EXISTS book_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_key TEXT,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE book_reads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a read (we only log the event)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'book_reads' AND policyname = 'Anyone can log book reads'
  ) THEN
    CREATE POLICY "Anyone can log book reads" ON book_reads FOR INSERT WITH CHECK (true);
  END IF;
END $$;

GRANT SELECT, INSERT ON book_reads TO anon, authenticated;

-- Leaderboard: aggregate quiz attempt scores per book + user info
CREATE OR REPLACE VIEW book_leaderboard AS
SELECT
  q.book_id,
  a.user_id,
  u.username,
  u.avatar_url,
  SUM(a.score) AS total_score,
  SUM(a.total_questions) AS total_questions
FROM user_quiz_attempts a
JOIN book_quizzes q ON q.id = a.quiz_id
JOIN users u ON u.id = a.user_id
GROUP BY q.book_id, a.user_id, u.username, u.avatar_url;

GRANT SELECT ON book_leaderboard TO anon, authenticated;
