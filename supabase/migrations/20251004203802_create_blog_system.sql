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



-- 1. AJOUTER DES COLONNES SEO À LA TABLE blog_posts

ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(60),  -- Titre SEO optimisé (60 car max)
ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160),  -- Meta description (160 max)
ADD COLUMN IF NOT EXISTS focus_keyword VARCHAR(100),  -- Mot-clé principal
ADD COLUMN IF NOT EXISTS reading_time INTEGER,  -- Temps de lecture en minutes
ADD COLUMN IF NOT EXISTS word_count INTEGER;  -- Nombre de mots

-- 2. CRÉER UN TRIGGER POUR METTRE À JOUR updated_at AUTOMATIQUEMENT

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at 
BEFORE UPDATE ON blog_posts 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 3. CRÉER UN TRIGGER POUR CALCULER AUTOMATIQUEMENT word_count ET reading_time

CREATE OR REPLACE FUNCTION calculate_reading_stats()
RETURNS TRIGGER AS $$
DECLARE
    word_count_val INTEGER;
BEGIN
    -- Compter les mots (approximatif)
    word_count_val := array_length(regexp_split_to_array(trim(NEW.content), '\s+'), 1);
    
    -- Mettre à jour les stats
    NEW.word_count := word_count_val;
    NEW.reading_time := CEIL(word_count_val / 200.0);  -- 200 mots par minute
    
    -- Générer meta_title si vide (limité à 60 caractères)
    IF NEW.meta_title IS NULL OR NEW.meta_title = '' THEN
        NEW.meta_title := SUBSTRING(NEW.title FROM 1 FOR 57) || 
            CASE WHEN LENGTH(NEW.title) > 57 THEN '...' ELSE '' END;
    END IF;
    
    -- Générer meta_description si vide (limité à 160 caractères)
    IF NEW.meta_description IS NULL OR NEW.meta_description = '' THEN
        NEW.meta_description := SUBSTRING(NEW.excerpt FROM 1 FOR 157) || 
            CASE WHEN LENGTH(NEW.excerpt) > 157 THEN '...' ELSE '' END;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_blog_posts_reading_stats
BEFORE INSERT OR UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION calculate_reading_stats();

-- 4. CRÉER UNE TABLE POUR TRACKER LES PERFORMANCES SEO

CREATE TABLE IF NOT EXISTS blog_seo_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    ctr DECIMAL(5,2) DEFAULT 0,  -- Click-through rate
    avg_position DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, date)
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_blog_seo_metrics_post_date ON blog_seo_metrics(post_id, date DESC);

-- 5. VUE POUR LES ARTICLES OPTIMISÉS SEO (facilite les requêtes)

CREATE OR REPLACE VIEW blog_posts_seo AS
SELECT 
    bp.*,
    COALESCE(bp.meta_title, SUBSTRING(bp.title FROM 1 FOR 60)) as seo_title,
    COALESCE(bp.meta_description, SUBSTRING(bp.excerpt FROM 1 FOR 160)) as seo_description,
    COALESCE(bp.reading_time, CEIL(bp.word_count / 200.0)) as calculated_reading_time,
    -- Score SEO basique (0-100)
    (
        CASE WHEN bp.meta_title IS NOT NULL AND LENGTH(bp.meta_title) BETWEEN 50 AND 60 THEN 20 ELSE 0 END +
        CASE WHEN bp.meta_description IS NOT NULL AND LENGTH(bp.meta_description) BETWEEN 150 AND 160 THEN 20 ELSE 0 END +
        CASE WHEN bp.word_count >= 300 THEN 20 ELSE (bp.word_count / 300.0 * 20) END +
        CASE WHEN array_length(bp.tags, 1) >= 3 THEN 20 ELSE (COALESCE(array_length(bp.tags, 1), 0) / 3.0 * 20) END +
        CASE WHEN bp.image_url IS NOT NULL THEN 20 ELSE 0 END
    )::INTEGER as seo_score
FROM blog_posts bp;

-- 6. FONCTION POUR GÉNÉRER UN SITEMAP XML

CREATE OR REPLACE FUNCTION generate_sitemap_xml()
RETURNS TABLE(sitemap_entry TEXT) AS $
BEGIN
    RETURN QUERY
    SELECT 
        '<url>' ||
        '<loc>https://mideessi.com/blog/' || slug || '</loc>' ||
        '<lastmod>' || TO_CHAR(COALESCE(updated_at, published_at), 'YYYY-MM-DD') || '</lastmod>' ||
        '<changefreq>weekly</changefreq>' ||
        '<priority>0.8</priority>' ||
        '</url>' as sitemap_entry
    FROM blog_posts
    WHERE is_published = true
    ORDER BY published_at DESC;
END;
$ LANGUAGE plpgsql;

-- 7. TABLE POUR LES REDIRECTIONS 301 (important pour SEO)

CREATE TABLE IF NOT EXISTS seo_redirects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    old_url VARCHAR(500) NOT NULL UNIQUE,
    new_url VARCHAR(500) NOT NULL,
    redirect_type INTEGER DEFAULT 301,  -- 301 permanent, 302 temporaire
    is_active BOOLEAN DEFAULT true,
    hit_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_redirects_old_url ON seo_redirects(old_url) WHERE is_active = true;

-- 8. FONCTION POUR ANALYSER LE CONTENU SEO

CREATE OR REPLACE FUNCTION analyze_post_seo(post_id_param UUID)
RETURNS JSON AS $
DECLARE
    post_record blog_posts%ROWTYPE;
    seo_analysis JSON;
    issues TEXT[] := ARRAY[]::TEXT[];
    warnings TEXT[] := ARRAY[]::TEXT[];
    success TEXT[] := ARRAY[]::TEXT[];
BEGIN
    SELECT * INTO post_record FROM blog_posts WHERE id = post_id_param;
    
    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Article non trouvé');
    END IF;
    
    -- Analyser le titre
    IF LENGTH(post_record.title) < 30 THEN
        issues := array_append(issues, 'Titre trop court (< 30 caractères)');
    ELSIF LENGTH(post_record.title) > 60 THEN
        warnings := array_append(warnings, 'Titre long (> 60 caractères) - sera tronqué dans Google');
    ELSE
        success := array_append(success, 'Titre optimisé (' || LENGTH(post_record.title) || ' caractères)');
    END IF;
    
    -- Analyser la description
    IF LENGTH(post_record.excerpt) < 120 THEN
        issues := array_append(issues, 'Description trop courte (< 120 caractères)');
    ELSIF LENGTH(post_record.excerpt) > 160 THEN
        warnings := array_append(warnings, 'Description longue (> 160 caractères) - sera tronquée');
    ELSE
        success := array_append(success, 'Description optimisée (' || LENGTH(post_record.excerpt) || ' caractères)');
    END IF;
    
    -- Analyser le contenu
    IF post_record.word_count < 300 THEN
        issues := array_append(issues, 'Contenu trop court (< 300 mots) - minimum recommandé');
    ELSIF post_record.word_count < 500 THEN
        warnings := array_append(warnings, 'Contenu court (' || post_record.word_count || ' mots) - 500+ recommandé');
    ELSE
        success := array_append(success, 'Contenu substantiel (' || post_record.word_count || ' mots)');
    END IF;
    
    -- Analyser les tags
    IF array_length(post_record.tags, 1) IS NULL OR array_length(post_record.tags, 1) = 0 THEN
        issues := array_append(issues, 'Aucun tag - ajoutez au moins 3 tags');
    ELSIF array_length(post_record.tags, 1) < 3 THEN
        warnings := array_append(warnings, 'Peu de tags (' || array_length(post_record.tags, 1) || ') - 3-5 recommandés');
    ELSE
        success := array_append(success, 'Tags appropriés (' || array_length(post_record.tags, 1) || ' tags)');
    END IF;
    
    -- Analyser l'image
    IF post_record.image_url IS NULL OR post_record.image_url = '' THEN
        issues := array_append(issues, 'Image manquante - essentielle pour SEO et partages sociaux');
    ELSE
        success := array_append(success, 'Image mise en avant présente');
    END IF;
    
    -- Analyser le slug
    IF LENGTH(post_record.slug) > 50 THEN
        warnings := array_append(warnings, 'Slug long (> 50 caractères) - privilégiez les slugs courts');
    END IF;
    
    -- Construire le JSON de réponse
    seo_analysis := json_build_object(
        'post_id', post_record.id,
        'title', post_record.title,
        'seo_score', (
            SELECT seo_score FROM blog_posts_seo WHERE id = post_id_param
        ),
        'stats', json_build_object(
            'title_length', LENGTH(post_record.title),
            'description_length', LENGTH(post_record.excerpt),
            'word_count', post_record.word_count,
            'reading_time', post_record.reading_time,
            'tags_count', COALESCE(array_length(post_record.tags, 1), 0),
            'has_image', post_record.image_url IS NOT NULL
        ),
        'analysis', json_build_object(
            'issues', issues,
            'warnings', warnings,
            'success', success
        ),
        'recommendations', ARRAY[
            'Utilisez le mot-clé principal dans les 100 premiers mots',
            'Ajoutez des sous-titres (H2, H3) pour structurer',
            'Incluez des liens internes vers d''autres articles',
            'Optimisez les images (alt text, compression)',
            'Ajoutez un appel à l''action en fin d''article'
        ]
    );
    
    RETURN seo_analysis;
END;
$ LANGUAGE plpgsql;

-- 9. POLITIQUE RLS (Row Level Security) pour seo_metrics

ALTER TABLE blog_seo_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des métriques" ON blog_seo_metrics
    FOR SELECT USING (true);

CREATE POLICY "Admin peut tout modifier" ON blog_seo_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins WHERE admins.id = auth.uid()
        )
    );

-- 10. FONCTION POUR OBTENIR LES SUGGESTIONS DE MOTS-CLÉS

CREATE OR REPLACE FUNCTION suggest_keywords(post_content TEXT, limit_count INTEGER DEFAULT 10)
RETURNS TABLE(keyword TEXT, frequency INTEGER) AS $
BEGIN
    RETURN QUERY
    WITH words AS (
        SELECT 
            lower(unnest(regexp_split_to_array(post_content, '\s+'))) as word
    ),
    filtered_words AS (
        SELECT word FROM words
        WHERE 
            LENGTH(word) > 4  -- Mots de plus de 4 lettres
            AND word !~ '[0-9]'  -- Pas de nombres
            AND word NOT IN ('avoir', 'être', 'faire', 'dans', 'pour', 'avec', 'cette', 'sont', 'plus', 'peut', 'comme', 'aussi', 'tout', 'mais', 'leur', 'leurs', 'nous', 'vous', 'elle', 'elles', 'cette', 'celui')  -- Mots courants
    )
    SELECT 
        word as keyword,
        COUNT(*)::INTEGER as frequency
    FROM filtered_words
    GROUP BY word
    ORDER BY frequency DESC, word
    LIMIT limit_count;
END;
$ LANGUAGE plpgsql;