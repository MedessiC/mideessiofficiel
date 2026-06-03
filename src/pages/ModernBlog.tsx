import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Clock, Search, TrendingUp, BookOpen, User } from 'lucide-react';
import SEO from '../components/SEO';
import BlogCarousel from '../components/BlogCarousel';
import ArticlePreview from '../components/ArticlePreview';
import BlogSearchBar from '../components/BlogSearchBar';
import SearchStatsComponent, { SearchSuggestionsComponent } from '../components/SearchStatsComponent';
import { supabase, BlogPost, BlogCategory } from '../lib/supabase';

const ModernBlog = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Déterminer le nombre d'articles à charger selon la screen size
  const ITEMS_PER_LOAD = isMobile ? 6 : 12;

  useEffect(() => {
    fetchData();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Réinitialiser quand les filtres changent
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_LOAD);
    setHasMore(true);
  }, [selectedCategory, searchQuery, ITEMS_PER_LOAD]);

  // Infinite scroll avec Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && displayedCount > 0) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [postsResult, categoriesResult] = await Promise.all([
        supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false }),
        supabase
          .from('blog_categories')
          .select('*')
          .order('name', { ascending: true })
      ]);

      if (postsResult.data) {
        setAllPosts(postsResult.data);
        setFeaturedPosts(postsResult.data.slice(0, 3));
        setDisplayedCount(ITEMS_PER_LOAD);
        setHasMore(postsResult.data.length > ITEMS_PER_LOAD);
      }

      if (categoriesResult.data) {
        setCategories(categoriesResult.data);
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      const nextCount = displayedCount + ITEMS_PER_LOAD;
      setDisplayedCount(nextCount);
      setLoadingMore(false);
      
      // filteredPosts n'est pas dans les dépendances par design
      // pour éviter une boucle infinie avec useEffect
      if (nextCount >= filteredPosts.length) {
        setHasMore(false);
      }
    }, 300); // Simule un léger délai de chargement
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedCount, ITEMS_PER_LOAD]);

  const calculateReadTime = (text: string) => Math.ceil(text.split(' ').length / 200);

  const getPostsByCategory = (categoryName: string) => {
    return allPosts.filter(post => post.category === categoryName).slice(0, 8);
  };

  // Memoize filteredPosts pour éviter les recalculs inutiles
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  // Memoize les posts affichés selon le filtrage et le count
  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, displayedCount);
  }, [filteredPosts, displayedCount]);

  // Blog card component
  const BlogCard = ({ post, variant = 'default' }: { post: BlogPost; variant?: 'default' | 'small' | 'featured' }) => {
    if (variant === 'featured') {
      return (
        <a
          href={`/blog/${post.slug}`}
          className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black h-full flex flex-col justify-end hover:shadow-[0_25px_80px_rgba(255,215,0,0.25)] transition-all duration-500"
        >
          <img
            src={post.image_url}
            alt={post.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 group-hover:brightness-125 transition-all duration-500 opacity-65 group-hover:opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20 group-hover:via-black/40 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/0 to-gold/0 group-hover:from-gold/15 group-hover:via-gold/5 transition-all duration-500" />
          
          <div className="relative z-10 p-5 sm:p-6 md:p-7 lg:p-9 transform group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-2.5 mb-3 sm:mb-4 flex-wrap">
              <span className="px-3 sm:px-3.5 py-1.5 bg-gold text-midnight text-xs font-bold rounded-full group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                {post.category}
              </span>
              <span className="text-xs text-gray-300 flex items-center gap-1.5 group-hover:text-gray-100 transition-colors">
                <Clock className="w-3.5 h-3.5" />
                {calculateReadTime(post.excerpt)} min de lecture
              </span>
            </div>
            
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 group-hover:text-gold group-hover:drop-shadow-[0_0_25px_rgba(255,215,0,0.35)] transition-all duration-500 line-clamp-3">
              {post.title}
            </h3>
            
            <p className="text-xs sm:text-sm text-gray-300 group-hover:text-gray-200 mb-4 sm:mb-5 line-clamp-2 transition-colors duration-500 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between pt-4 sm:pt-5 border-t border-white/20 group-hover:border-gold/50 transition-colors duration-500">
              <div className="flex items-center gap-2">
                <User className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gold" />
                <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors font-medium">{post.author}</span>
              </div>
              <span className="text-gold font-bold text-xs sm:text-sm group-hover:translate-x-2 transition-transform duration-500 flex items-center gap-1.5">Lire l'article <span className="text-lg">→</span></span>
            </div>
          </div>
        </a>
      );
    }

    if (variant === 'small') {
      return (
        <a
          href={`/blog/${post.slug}`}
          className="group bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden hover:shadow-[0_20px_50px_rgba(255,215,0,0.12)] transition-all duration-500 flex flex-col h-full transform hover:-translate-y-2 hover:scale-105"
        >
          <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
            <img
              src={post.image_url}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-120 group-hover:brightness-110 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 group-hover:to-black/30 transition-all duration-500" />
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 sm:px-3 py-1 sm:py-1.5 bg-gold text-midnight text-xs font-bold rounded-full shadow-lg group-hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] group-hover:scale-110 transition-all duration-300">
              {post.category}
            </div>
          </div>
          
          <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow">
            <h4 className="font-bold text-sm sm:text-base md:text-lg text-midnight dark:text-white mb-2 md:mb-3 line-clamp-2 group-hover:text-gold group-hover:drop-shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all duration-500">
              {post.title}
            </h4>
            
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4 flex-grow line-clamp-3 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-500">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-700 group-hover:border-gold/30 transition-colors duration-500">
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 group-hover:text-gold transition-colors duration-500">
                <Clock className="w-3 h-3" />
                {calculateReadTime(post.excerpt)} min
              </span>
              <span className="text-gold font-bold text-xs sm:text-sm group-hover:translate-x-2 transition-transform duration-500">Lire →</span>
            </div>
          </div>
        </a>
      );
    }

    // Default (carousel)
    return (
      <a
        href={`/blog/${post.slug}`}
        className="group bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden hover:shadow-[0_25px_60px_rgba(255,215,0,0.15)] transition-all duration-500 flex flex-col h-full transform hover:-translate-y-3 hover:scale-110"
      >
        <div className="relative h-40 sm:h-44 md:h-52 overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img
            src={post.image_url}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-125 group-hover:brightness-120 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25 group-hover:to-black/40 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-tr from-gold/0 to-gold/0 group-hover:from-gold/5 group-hover:to-gold/10 transition-all duration-500" />
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gold text-midnight text-xs font-bold rounded-full shadow-lg group-hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] group-hover:scale-110 group-hover:-rotate-2 transition-all duration-300">
            {post.category}
          </div>
        </div>
        
        <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
          <h4 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-midnight dark:text-white mb-2 md:mb-3 line-clamp-2 group-hover:text-gold group-hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.25)] transition-all duration-500">
            {post.title}
          </h4>
          
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-5 flex-grow line-clamp-3 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-500">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 group-hover:border-gold/40 transition-colors duration-500">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 group-hover:text-gold transition-colors duration-500">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              {calculateReadTime(post.excerpt)} min
            </span>
            <span className="text-gold font-bold text-xs sm:text-sm group-hover:translate-x-2 transition-transform duration-500">Lire →</span>
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title="Blog | MIDEESSI - Tech, Business & Innovation"
        description="Découvrez nos articles sur la technologie, le business et l'innovation. Tutoriels, analyses et insights du monde digital."
        keywords={['blog', 'articles', 'tech', 'business', 'innovation', 'tutoriel', 'MIDEESSI']}
      />

      {/* HERO MODERNE */}
      <section className="relative bg-gradient-to-br from-midnight via-blue-900 to-black dark:from-black dark:via-gray-900 dark:to-black text-white py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Blog Tech & Business
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mb-10 md:mb-16">
            Explorez nos articles sur la technologie, l'entrepreneuriat et l'innovation africaine.
          </p>

          {/* SEARCH HERO WITH ADVANCED FILTERS */}
          <div className="relative max-w-3xl mx-auto mb-8 md:mb-10">
            <BlogSearchBar
              posts={allPosts}
              categories={categories}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategory}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </section>

      {/* FEATURED GRANDE FORMAT */}
      {!loading && featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24 border-b-2 border-gold/20 dark:border-gold/10">
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-12 bg-gradient-to-r from-gold to-gold/40" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-midnight via-midnight to-gold dark:from-white dark:via-white dark:to-gold bg-clip-text text-transparent">À la Une</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Les articles les plus lus et les plus pertinents de la semaine</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Grand article - Numéro 1 */}
            <div className="md:col-span-2 group">
              <div className="relative">
                <div className="absolute -top-6 -left-3 w-12 h-12 bg-gradient-to-br from-gold to-gold/70 rounded-full flex items-center justify-center text-midnight font-black text-lg shadow-lg z-20 group-hover:scale-125 group-hover:shadow-xl transition-all duration-300">1</div>
                <div className="h-64 sm:h-80 md:h-96 lg:h-full rounded-2xl overflow-hidden min-h-64 shadow-2xl group-hover:shadow-[0_30px_80px_rgba(255,215,0,0.2)] transition-all duration-500">
                  <ArticlePreview post={featuredPosts[0]}>
                    <BlogCard post={featuredPosts[0]} variant="featured" />
                  </ArticlePreview>
                </div>
              </div>
            </div>

            {/* 2 petits articles */}
            <div className="space-y-6">
              {featuredPosts.slice(1, 3).map((post, idx) => (
                <div key={post.id} className="group relative">
                  <div className="absolute -top-4 -left-2 w-10 h-10 bg-gradient-to-br from-gold to-gold/70 rounded-full flex items-center justify-center text-midnight font-black text-sm shadow-lg z-20 group-hover:scale-110 transition-all duration-300">{idx + 2}</div>
                  <div className="h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-[0_20px_60px_rgba(255,215,0,0.15)] transition-all duration-500">
                    <ArticlePreview post={post}>
                      <BlogCard post={post} variant="featured" />
                    </ArticlePreview>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CARROUSELS PAR CATÉGORIE */}
      {!loading && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Plus lus */}
          <BlogCarousel
            title={
              <div className="flex items-center gap-3">
                <TrendingUp className="w-7 h-7 text-gold" />
                <span>Plus Lus</span>
              </div>
            }
            posts={allPosts.slice(0, 8)}
            renderCard={(post) => (
              <ArticlePreview post={post}>
                <BlogCard post={post} />
              </ArticlePreview>
            )}
          />

          {/* Par catégories */}
          {categories.map(cat => {
            const categoryPosts = getPostsByCategory(cat.name);
            if (categoryPosts.length === 0) return null;

            return (
              <BlogCarousel
                key={cat.id}
                title={
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-7 h-7 text-gold" />
                    <span>{cat.name}</span>
                  </div>
                }
                posts={categoryPosts}
                renderCard={(post) => (
                  <ArticlePreview post={post}>
                    <BlogCard post={post} />
                  </ArticlePreview>
                )}
              />
            );
          })}
        </section>
      )}

      {/* GRILLE COMPLÈTE */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-8 md:mb-10">Tous les Articles</h2>

        {loading ? (
          <div className="flex justify-center items-center py-24 md:py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-4 h-4 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-4 h-4 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Chargement des articles...</p>
            </div>
          </div>
        ) : displayedPosts.length > 0 ? (
          <>
            {/* Search Statistics */}
            {(searchQuery || selectedCategory !== 'all') && (
              <SearchStatsComponent
                stats={{
                  totalResults: filteredPosts.length,
                  searchQuery: searchQuery,
                  selectedCategory: selectedCategory,
                  totalArticles: allPosts.length
                }}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {displayedPosts.map(post => (
                <ArticlePreview key={post.id} post={post}>
                  <BlogCard post={post} variant="small" />
                </ArticlePreview>
              ))}
            </div>

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div ref={observerTarget} className="flex justify-center mt-12 md:mt-16 py-8">
                {loadingMore ? (
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-3 h-3 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <div className="w-3 h-3 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Défilez pour charger plus...</p>
                )}
              </div>
            )}

            {/* Fin des résultats */}
            {!hasMore && displayedPosts.length > 0 && (
              <div className="text-center mt-12 md:mt-16 text-sm text-gray-500 dark:text-gray-400">
                Tous les articles chargés ({displayedPosts.length} au total)
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 md:py-16">
            {searchQuery || selectedCategory !== 'all' ? (
              <>
                <Search className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-midnight dark:text-white mb-2">Aucun article trouvé</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 md:mb-8">Essayez une autre recherche ou changez le filtre de catégorie</p>
                <SearchSuggestionsComponent 
                  onSuggestionClick={(suggestion) => {
                    setSearchQuery(suggestion);
                    setSelectedCategory('all');
                  }}
                />
              </>
            ) : (
              <>
                <Search className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-midnight dark:text-white mb-4 md:mb-6">Découvrez nos articles</h3>
                <SearchSuggestionsComponent 
                  onSuggestionClick={(suggestion) => setSearchQuery(suggestion)}
                />
              </>
            )}
          </div>
        )}
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-gold to-yellow-400 text-midnight py-16 md:py-20 lg:py-24 mt-6 md:mt-8">
        <div className="max-w-4xl mx-auto text-center px-3 sm:px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Pas trouvé ce que tu cherches?</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 md:mb-10 opacity-90">Découvre nos services et offres adaptées à tes besoins</p>
          <a
            href="/offres"
            className="inline-block bg-midnight hover:bg-black text-gold px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold transition-all transform hover:scale-105 text-sm sm:text-base"
          >
            Voir nos offres →
          </a>
        </div>
      </section>
    </div>
  );
};

export default ModernBlog;
