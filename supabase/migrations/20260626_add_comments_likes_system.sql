-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_likes table
CREATE TABLE IF NOT EXISTS blog_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blog_id, user_id)
);

-- Ensure the blog_posts table exists for the blog_id reference pattern
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  author TEXT DEFAULT 'MIDEESSI Team',
  category TEXT DEFAULT 'Général',
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create book_comments table
CREATE TABLE IF NOT EXISTS book_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create book_likes table
CREATE TABLE IF NOT EXISTS book_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, user_id)
);

-- Enable RLS for new tables
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_likes ENABLE ROW LEVEL SECURITY;

-- Policies for blog_comments
CREATE POLICY "Anyone can view blog comments"
  ON blog_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create blog comments"
  ON blog_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog comments"
  ON blog_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for blog_likes
CREATE POLICY "Anyone can view blog likes"
  ON blog_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create blog likes"
  ON blog_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog likes"
  ON blog_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for book_comments
CREATE POLICY "Anyone can view book comments"
  ON book_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create book comments"
  ON book_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own book comments"
  ON book_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for book_likes
CREATE POLICY "Anyone can view book likes"
  ON book_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create book likes"
  ON book_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own book likes"
  ON book_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX idx_blog_comments_user_id ON blog_comments(user_id);
CREATE INDEX idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX idx_blog_likes_user_id ON blog_likes(user_id);
CREATE INDEX idx_book_comments_book_id ON book_comments(book_id);
CREATE INDEX idx_book_comments_user_id ON book_comments(user_id);
CREATE INDEX idx_book_likes_book_id ON book_likes(book_id);
CREATE INDEX idx_book_likes_user_id ON book_likes(user_id);
