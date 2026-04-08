-- Create users table to store user profiles
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a trigger function to automatically create a user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'username')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create ebooks table
CREATE TABLE IF NOT EXISTS ebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT,
  cover_url TEXT,
  pdf_url TEXT NOT NULL,
  category TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ebook_likes table
CREATE TABLE IF NOT EXISTS ebook_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ebook_id UUID NOT NULL REFERENCES ebooks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ebook_id)
);

-- Create reading_stats table
CREATE TABLE IF NOT EXISTS reading_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_pages_read INTEGER DEFAULT 0,
  books_completed INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  last_read_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leaderboard_monthly table
CREATE TABLE IF NOT EXISTS leaderboard_monthly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- Format: YYYY-MM
  books_read INTEGER DEFAULT 0,
  pages_read INTEGER DEFAULT 0,
  badges TEXT[], -- Array of badge names
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_monthly ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can view profiles" ON users FOR SELECT USING (true);

-- Create policies for ebooks table
CREATE POLICY "Anyone can read ebooks" ON ebooks FOR SELECT USING (true);
CREATE POLICY "Users can create ebooks" ON ebooks FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update their ebooks" ON ebooks FOR UPDATE USING (auth.uid() = author_id);

-- Create policies for ebook_likes table
CREATE POLICY "Users can read likes" ON ebook_likes FOR SELECT USING (true);
CREATE POLICY "Users can create likes for themselves" ON ebook_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON ebook_likes FOR DELETE USING (auth.uid() = user_id);

-- Create policies for reading_stats table
CREATE POLICY "Users can read their own stats" ON reading_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own stats" ON reading_stats FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for leaderboard_monthly table
CREATE POLICY "Anyone can read leaderboard" ON leaderboard_monthly FOR SELECT USING (true);
CREATE POLICY "Users can update their own leaderboard" ON leaderboard_monthly FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_ebooks_author_id ON ebooks(author_id);
CREATE INDEX idx_ebook_likes_user_id ON ebook_likes(user_id);
CREATE INDEX idx_ebook_likes_ebook_id ON ebook_likes(ebook_id);
CREATE INDEX idx_reading_stats_user_id ON reading_stats(user_id);
CREATE INDEX idx_leaderboard_user_id ON leaderboard_monthly(user_id);
CREATE INDEX idx_leaderboard_month ON leaderboard_monthly(month);
