-- =============================================================================
-- MIGRATION: Système de Quiz Interactifs pour les Livres (Ebooks)
-- Date: 20260705
-- Description:
--   1. Crée les tables book_quizzes, quiz_questions et user_quiz_attempts
--   2. Configure les politiques RLS pour l'accès public/utilisateur
--   3. Index de performance
-- =============================================================================

-- Table des Quiz
CREATE TABLE IF NOT EXISTS book_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  trigger_page INTEGER NOT NULL CHECK (trigger_page >= 1), -- Page après laquelle le quiz apparaît
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des Questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES book_quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Tableau d'options ex: ["Option A", "Option B", "Option C"]
  correct_option_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des scores / tentatives utilisateurs
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES book_quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL, -- Nombre de bonnes réponses
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quiz_id)
);

-- Activation RLS
ALTER TABLE book_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique pour les quiz
CREATE POLICY "Anyone can view quizzes" ON book_quizzes FOR SELECT USING (true);
CREATE POLICY "Anyone can view quiz questions" ON quiz_questions FOR SELECT USING (true);

-- Politiques utilisateur pour les tentatives
CREATE POLICY "Users can manage their attempts" ON user_quiz_attempts
  FOR ALL
  USING (auth.uid() = (SELECT id FROM users WHERE id = user_id LIMIT 1))
  WITH CHECK (auth.uid() = (SELECT id FROM users WHERE id = user_id LIMIT 1));

-- Politiques administrateur pour l'édition des quiz
CREATE POLICY "Admins can manage quizzes" ON book_quizzes FOR ALL
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Admins can manage quiz questions" ON quiz_questions FOR ALL
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Indexation
CREATE INDEX IF NOT EXISTS idx_book_quizzes_book ON book_quizzes(book_id, trigger_page);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON user_quiz_attempts(user_id);
