-- Blog interactions: real likes and comments for published blog posts
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blog_id, user_id)
);

CREATE TABLE IF NOT EXISTS blog_comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES blog_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE;
ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view blog comments" ON blog_comments;
DROP POLICY IF EXISTS "Authenticated users can create blog comments" ON blog_comments;
DROP POLICY IF EXISTS "Users can delete their own blog comments" ON blog_comments;
DROP POLICY IF EXISTS "Anyone can view blog likes" ON blog_likes;
DROP POLICY IF EXISTS "Authenticated users can create blog likes" ON blog_likes;
DROP POLICY IF EXISTS "Users can delete their own blog likes" ON blog_likes;
DROP POLICY IF EXISTS "Anyone can view blog comment likes" ON blog_comment_likes;
DROP POLICY IF EXISTS "Authenticated users can create blog comment likes" ON blog_comment_likes;
DROP POLICY IF EXISTS "Users can delete their own blog comment likes" ON blog_comment_likes;

CREATE POLICY "Anyone can view blog comments"
  ON blog_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create blog comments"
  ON blog_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blog comments"
  ON blog_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog comments"
  ON blog_comments FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view blog likes"
  ON blog_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create blog likes"
  ON blog_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog likes"
  ON blog_likes FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view blog comment likes"
  ON blog_comment_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create blog comment likes"
  ON blog_comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog comment likes"
  ON blog_comment_likes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON blog_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON blog_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comment_likes_comment_id ON blog_comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_blog_comment_likes_user_id ON blog_comment_likes(user_id);
