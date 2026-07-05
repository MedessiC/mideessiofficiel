-- Add nested book comment replies and comment likes support

ALTER TABLE book_comments
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES book_comments(id) ON DELETE CASCADE;

-- Preserve one top-level review per user/book, allow multiple replies by the same user
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'book_comments_book_user_unique'
  ) THEN
    ALTER TABLE book_comments DROP CONSTRAINT book_comments_book_user_unique;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_book_comments_unique_root_review
  ON book_comments(book_id, user_id)
  WHERE parent_id IS NULL;

CREATE TABLE IF NOT EXISTS book_comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES book_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

ALTER TABLE book_comment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view book comment likes" ON book_comment_likes;
DROP POLICY IF EXISTS "Authenticated users can create book comment likes" ON book_comment_likes;
DROP POLICY IF EXISTS "Users can delete their own book comment likes" ON book_comment_likes;

CREATE POLICY "Anyone can view book comment likes"
  ON book_comment_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create book comment likes"
  ON book_comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own book comment likes"
  ON book_comment_likes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_book_comments_parent_id ON book_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_book_comment_likes_comment_id ON book_comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_book_comment_likes_user_id ON book_comment_likes(user_id);
