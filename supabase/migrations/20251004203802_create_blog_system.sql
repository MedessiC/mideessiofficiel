/*
  # Blog System Schema

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `slug` (text, unique, for URLs)
      - `excerpt` (text, short description)
      - `content` (text, full article content)
      - `image_url` (text, featured image)
      - `author` (text, author name)
      - `category` (text, article category)
      - `tags` (text array, for filtering)
      - `is_featured` (boolean, for featured articles)
      - `is_published` (boolean, publication status)
      - `views` (integer, view counter)
      - `published_at` (timestamptz, publication date)
      - `created_at` (timestamptz, creation date)
      - `updated_at` (timestamptz, last update)
    
    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `description` (text)
      - `created_at` (timestamptz)
    
    - `site_analytics`
      - `id` (uuid, primary key)
      - `page_url` (text)
      - `visitor_id` (text)
      - `visited_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public can read published posts
    - Authenticated users can manage posts
    - Track analytics anonymously

  3. Indexes
    - Fast lookup by slug
    - Featured posts ordering
    - Category filtering
*/

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  image_url text DEFAULT '',
  author text NOT NULL DEFAULT 'MIDEESSI Team',
  category text DEFAULT 'Général',
  tags text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT false,
  views integer DEFAULT 0,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Site analytics table
CREATE TABLE IF NOT EXISTS site_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url text NOT NULL,
  visitor_id text NOT NULL,
  visited_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can create posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for blog_categories
CREATE POLICY "Anyone can view categories"
  ON blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON blog_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for site_analytics
CREATE POLICY "Anyone can insert analytics"
  ON site_analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view analytics"
  ON site_analytics FOR SELECT
  TO authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_analytics_page ON site_analytics(page_url, visited_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Intelligence Artificielle', 'ia', 'Articles sur l''IA et le machine learning'),
  ('Automatisation', 'automatisation', 'Solutions d''automatisation et productivité'),
  ('Technologie', 'technologie', 'Actualités et tendances technologiques'),
  ('Innovation', 'innovation', 'Innovation et transformation digitale'),
  ('Tutoriels', 'tutoriels', 'Guides et tutoriels techniques')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, image_url, author, category, tags, is_featured, is_published, published_at) VALUES
  (
    'L''avenir de l''Intelligence Artificielle en Afrique',
    'avenir-ia-afrique',
    'Découvrez comment l''IA transforme le continent africain et crée de nouvelles opportunités pour les startups technologiques.',
    'L''Intelligence Artificielle révolutionne le paysage technologique africain. De la santé à l''agriculture, en passant par la finance, l''IA ouvre des possibilités infinies pour résoudre les défis locaux avec des solutions innovantes. Les startups africaines sont à l''avant-garde de cette transformation, développant des solutions adaptées aux réalités du continent. MIDEESSI fait partie de cette nouvelle génération d''entrepreneurs qui croient au potentiel de l''IA pour transformer nos communautés. Dans cet article, nous explorons les tendances, les défis et les opportunités qui façonnent l''avenir de l''IA en Afrique.',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'Medessi Coovi',
    'Intelligence Artificielle',
    ARRAY['IA', 'Afrique', 'Innovation', 'Technologie'],
    true,
    true,
    now()
  ),
  (
    'Automatisation des processus : Guide complet pour les PME',
    'automatisation-processus-pme',
    'Un guide pratique pour les PME qui souhaitent automatiser leurs processus et améliorer leur productivité.',
    'L''automatisation n''est plus réservée aux grandes entreprises. Aujourd''hui, les PME peuvent tirer parti d''outils d''automatisation accessibles pour optimiser leurs opérations. Ce guide complet vous montre comment identifier les processus à automatiser, choisir les bons outils et mettre en œuvre des solutions d''automatisation efficaces. Nous partageons notre expérience avec TITO, notre outil d''organisation automatique de fichiers, et comment ce type de solution peut transformer votre quotidien professionnel.',
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'MIDEESSI Team',
    'Automatisation',
    ARRAY['Automatisation', 'PME', 'Productivité', 'Outils'],
    true,
    true,
    now() - interval '2 days'
  ),
  (
    'Les technologies émergentes qui façonnent 2025',
    'technologies-emergentes-2025',
    'Un aperçu des technologies qui domineront le paysage technologique en 2025 et comment vous pouvez vous y préparer.',
    'L''année 2025 s''annonce riche en innovations technologiques. De l''IA générative au edge computing, en passant par le web3 et les technologies quantiques, nous assistons à une convergence de technologies qui vont redéfinir la manière dont nous travaillons et vivons. Dans cet article, nous analysons les tendances majeures et leurs implications pour les entreprises et les développeurs.',
    'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'MIDEESSI Team',
    'Technologie',
    ARRAY['Tendances', '2025', 'Innovation', 'Futur'],
    false,
    true,
    now() - interval '5 days'
  ),
  (
    'Comment nous avons construit TITO : Notre parcours',
    'construction-tito-parcours',
    'L''histoire de la création de TITO, notre outil d''organisation automatique de fichiers, et les leçons apprises.',
    'TITO est né d''un besoin simple : organiser automatiquement des milliers de fichiers dispersés. Dans cet article, nous partageons notre parcours de développement, les défis techniques rencontrés, et comment nous avons créé une solution qui aide maintenant des centaines d''utilisateurs à gagner du temps chaque jour.',
    'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'Medessi Coovi',
    'Innovation',
    ARRAY['TITO', 'Startup', 'Développement', 'Histoire'],
    true,
    true,
    now() - interval '7 days'
  )
ON CONFLICT (slug) DO NOTHING;
