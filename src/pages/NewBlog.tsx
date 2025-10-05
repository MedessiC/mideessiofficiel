import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, TrendingUp, Search, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase, BlogPost, BlogCategory } from '../lib/supabase';

// Skeleton pour le chargement
const ArticleSkeleton = () => (
  <div className="bg-corporate-50 dark:bg-gray-800 rounded-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-corporate-200 dark:bg-gray-700" />
    <div className="p-6 space-y-3">
      <div className="h-4 bg-corporate-200 dark:bg-gray-700 rounded w-2/3" />
      <div className="h-4 bg-corporate-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="space-y-2">
        <div className="h-3 bg-corporate-200 dark:bg-gray-700 rounded" />
        <div className="h-3 bg-corporate-200 dark:bg-gray-700 rounded w-5/6" />
      </div>
    </div>
  </div>
);

const FeaturedSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-corporate-50 dark:bg-gray-800 rounded-lg overflow-hidden animate-pulse">
    <div className="h-64 lg:h-96 bg-corporate-200 dark:bg-gray-700" />
    <div className="p-8 space-y-4">
      <div className="h-6 bg-corporate-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-corporate-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-corporate-200 dark:bg-gray-700 rounded w-5/6" />
    </div>
  </div>
);

const NewBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Requêtes parallèles pour gagner du temps
      const [postsResult, categoriesResult] = await Promise.all([
        supabase
          .from('blog_posts')
          .select('id, slug, title, excerpt, image_url, author, category, published_at, is_featured, is_published')
          .eq('is_published', true)
          .order('published_at', { ascending: false })
          .limit(20), // Limiter le nombre d'articles chargés initialement
        
        supabase
          .from('blog_categories')
          .select('id, name, slug')
          .order('name')
      ]);

      if (postsResult.data) {
        const featured = postsResult.data.find(p => p.is_featured) || postsResult.data[0];
        setFeaturedPost(featured);
        setPosts(postsResult.data);
      }

      if (categoriesResult.data) {
        setCategories(categoriesResult.data);
      }

      if (postsResult.error) throw postsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;

    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError('Impossible de charger les articles. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && post.id !== featuredPost?.id;
  });

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title="Blog & Actualités | MIDEESSI"
        description="Découvrez nos articles sur l'automatisation, l'IA, et les dernières innovations technologiques. Actualités, tutoriels et insights de l'équipe MIDEESSI."
        keywords={['blog', 'actualités', 'IA', 'automatisation', 'technologie', 'innovation']}
      />

      <section className="bg-gradient-to-br from-midnight via-navy to-steel text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Actualités</h1>
          <p className="text-xl text-gray-200 max-w-3xl">
            Restez informé des dernières tendances en IA, automatisation et innovation technologique
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article à la une */}
        {loading ? (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">
                Article à la une
              </span>
            </div>
            <FeaturedSkeleton />
          </div>
        ) : error ? (
          <div className="mb-16 p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
            >
              <Loader2 className="w-4 h-4" />
              Réessayer
            </button>
          </div>
        ) : featuredPost && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">
                Article à la une
              </span>
            </div>
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-8 bg-corporate-50 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all border border-corporate-200 dark:border-gray-700"
            >
              <div className="relative h-64 lg:h-full overflow-hidden bg-corporate-100 dark:bg-gray-700">
                <img
                  src={featuredPost.image_url}
                  alt={featuredPost.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-corporate-500 dark:text-corporate-400 mb-4">
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-full font-semibold">
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredPost.published_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-corporate-600 dark:text-corporate-300 mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-corporate-600 dark:text-corporate-300">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{featuredPost.author}</span>
                  </div>
                  <span className="inline-flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all">
                    Lire l'article
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-corporate-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
              className="w-full pl-12 pr-4 py-3 bg-corporate-50 dark:bg-gray-800 border border-corporate-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white disabled:opacity-50"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={loading}
            className="px-6 py-3 bg-corporate-50 dark:bg-gray-800 border border-corporate-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white disabled:opacity-50"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Grille d'articles */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <ArticleSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-corporate-50 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all border border-corporate-200 dark:border-gray-700"
              >
                <div className="relative h-48 overflow-hidden bg-corporate-100 dark:bg-gray-700">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-midnight/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-corporate-500 dark:text-corporate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.published_at).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-midnight dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-corporate-600 dark:text-corporate-300 text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center text-blue-600 font-semibold text-sm">
                    Lire la suite
                    <ArrowRight className="ml-1 w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-corporate-600 dark:text-corporate-300 text-lg">
              Aucun article trouvé. Essayez une autre recherche ou catégorie.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default NewBlog;