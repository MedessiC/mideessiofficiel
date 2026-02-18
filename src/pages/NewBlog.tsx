import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, TrendingUp, Search, Loader2, Tag, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase, BlogPost, BlogCategory } from '../lib/supabase';

// Skeleton pour le chargement
const ArticleSkeleton = () => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden shadow-lg animate-pulse">
    <div className="h-56 bg-gray-200 dark:bg-gray-700" />
    <div className="p-6 space-y-4">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-5/6" />
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-4/5" />
      </div>
    </div>
  </div>
);

const FeaturedSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden shadow-xl animate-pulse">
    <div className="h-72 lg:h-full bg-gray-200 dark:bg-gray-700" />
    <div className="p-8 lg:p-10 space-y-6">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-5/6" />
      <div className="space-y-3 pt-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-4/5" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4" />
      </div>
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
          .limit(20),
        
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

  // Fonction pour calculer le temps de lecture estimé
  const calculateReadTime = (excerpt: string) => {
    const wordsPerMinute = 200;
    const words = excerpt.split(' ').length * 5; // Approximation basée sur l'extrait
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title="Blog & Actualités | MIDEESSI"
        description="Découvrez nos articles sur l'automatisation, l'IA, et les dernières innovations technologiques. Actualités, tutoriels et insights de l'équipe MIDEESSI."
        keywords={['blog', 'actualités', 'IA', 'automatisation', 'technologie', 'innovation']}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-midnight via-blue-900 to-midnight dark:from-black dark:to-gray-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Blog & <span className="text-yellow-400">News</span>
          </h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full mb-6"></div>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
            IA, automatisation, innovation. Les trucs qui changent la donne. On partage nos discoveries et des tutos.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Article à la une */}
        {loading ? (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-lg font-bold text-yellow-400 uppercase tracking-wide">
                Article à la une
              </span>
            </div>
            <FeaturedSkeleton />
          </div>
        ) : error ? (
          <div className="mb-16 p-8 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-200 dark:border-red-800 rounded-3xl text-center shadow-lg">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-red-600 dark:text-red-400 mb-6 text-lg font-medium">{error}</p>
            <button
              onClick={fetchData}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:from-red-700 hover:to-red-800 transition-all inline-flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Loader2 className="w-5 h-5" />
              Réessayer
            </button>
          </div>
        ) : featuredPost && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-lg font-bold text-yellow-400 uppercase tracking-wide">
                À lire en priorité
              </span>
            </div>
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 dark:border-gray-700"
            >
              <div className="relative h-72 lg:h-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={featuredPost.image_url}
                  alt={featuredPost.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="p-6 lg:p-10 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-midnight rounded-full font-bold text-sm shadow-md">
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredPost.published_at).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    {calculateReadTime(featuredPost.excerpt)} min
                  </span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-midnight dark:text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300 leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-midnight" />
                    </div>
                    <span className="text-sm font-medium">{featuredPost.author}</span>
                  </div>
                  <span className="inline-flex items-center text-yellow-400 font-bold group-hover:gap-3 transition-all">
                    Vas-y, lis
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Statistiques du blog */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-center border-2 border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-yellow-400 mb-1">{posts.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Articles</div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-center border-2 border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-yellow-400 mb-1">{categories.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Catégories</div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-center border-2 border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-yellow-400 mb-1">5+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Auteurs</div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-center border-2 border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-yellow-400 mb-1">New</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Chaque semaine</div>
          </div>
        </div>

        {/* Section de filtres améliorée */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 md:p-8 mb-12 shadow-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-midnight dark:text-white">
              Rechercher & Filtrer
            </h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-midnight dark:text-white disabled:opacity-50 transition-all shadow-sm"
              />
            </div>
            <div className="relative md:w-64">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-midnight dark:text-white disabled:opacity-50 appearance-none cursor-pointer transition-all shadow-sm font-medium"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Affichage du nombre de résultats */}
          {!loading && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-yellow-400">{filteredPosts.length}</span> article{filteredPosts.length > 1 ? 's' : ''} trouvé{filteredPosts.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Grille d'articles améliorée */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <ArticleSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-400 transform hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-midnight/20 to-transparent opacity-60"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-midnight text-xs font-bold rounded-full shadow-lg">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-midnight dark:text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {calculateReadTime(post.excerpt)} min
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.published_at).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {post.author}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-midnight dark:text-white mb-3 group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="inline-flex items-center text-yellow-400 font-bold text-sm group-hover:gap-2 transition-all">
                      Lire la suite
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                    <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                      <ArrowRight className="w-4 h-4 text-yellow-400 group-hover:text-midnight transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Message si aucun résultat */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-midnight dark:text-white mb-3">
              Aucun article trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 max-w-md mx-auto">
              Essayez une autre recherche ou explorez une catégorie différente.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-midnight font-bold rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>

      {/* Section CTA Newsletter */}
      <section className="relative py-20 md:py-24 bg-gradient-to-br from-midnight via-blue-900 to-midnight dark:from-black dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Ne manquez rien de <span className="text-yellow-400">l'innovation</span>
          </h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full mb-6"></div>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Abonnez-vous à notre newsletter pour recevoir les derniers articles, tendances et insights directement dans votre boîte mail.
          </p>
          <div className="inline-block bg-yellow-400/10 backdrop-blur-sm border-2 border-yellow-400 rounded-full px-8 py-4">
            <p className="text-xl font-bold text-yellow-400">
              MIDEESSI - Nous sommes indépendants
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewBlog;