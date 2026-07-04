import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Clock, Search, TrendingUp, BookOpen, User, Flame, MessageSquare } from 'lucide-react';
import SEO from '../components/SEO';
import BlogCarousel from '../components/BlogCarousel';
import ArticlePreview from '../components/ArticlePreview';
import BlogSearchBar from '../components/BlogSearchBar';
import SearchStatsComponent, { SearchSuggestionsComponent } from '../components/SearchStatsComponent';
import { supabase, BlogPost, BlogCategory } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { toCloudinaryUrl } from '../utils/cloudinaryImage';

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
  const [engagementMap, setEngagementMap] = useState<Record<string, { likes: number; comments: number }>>({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const observerTarget = useRef<HTMLDivElement>(null);

  const ITEMS_PER_LOAD = isMobile ? 6 : 12;

  useEffect(() => {
    fetchData();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setDisplayedCount(ITEMS_PER_LOAD);
    setHasMore(true);
  }, [selectedCategory, searchQuery, ITEMS_PER_LOAD]);

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
        const posts = postsResult.data;
        setAllPosts(posts);
        setFeaturedPosts(posts.slice(0, 4)); // Get 4 for the news layout
        setDisplayedCount(ITEMS_PER_LOAD);
        setHasMore(posts.length > ITEMS_PER_LOAD);

        const postIds = posts.map(post => post.id);
        if (postIds.length > 0) {
          const [{ data: likesData }, { data: commentsData }] = await Promise.all([
            supabase.from('blog_likes').select('blog_id').in('blog_id', postIds),
            supabase.from('blog_comments').select('blog_id').in('blog_id', postIds)
          ]);

          const likesByPost = (likesData || []).reduce<Record<string, number>>((acc, like) => {
            acc[like.blog_id] = (acc[like.blog_id] || 0) + 1;
            return acc;
          }, {});

          const commentsByPost = (commentsData || []).reduce<Record<string, number>>((acc, comment) => {
            acc[comment.blog_id] = (acc[comment.blog_id] || 0) + 1;
            return acc;
          }, {});

          setEngagementMap(Object.fromEntries(postIds.map(postId => [
            postId,
            {
              likes: likesByPost[postId] || 0,
              comments: commentsByPost[postId] || 0,
            }
          ])));
        } else {
          setEngagementMap({});
        }
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
      
      if (nextCount >= filteredPosts.length) {
        setHasMore(false);
      }
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedCount, ITEMS_PER_LOAD]);

  const calculateReadTime = (text: string) => Math.ceil((text || '').split(' ').length / 200);

  const getPostsByCategory = (categoryName: string) => {
    return allPosts.filter(post => post.category === categoryName).slice(0, 8);
  };

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, displayedCount);
  }, [filteredPosts, displayedCount]);

  const getEngagement = (postId: string) => {
    return engagementMap[postId] || { likes: 0, comments: 0 };
  };

  // ---------------------------------------------------------------------------
  // BLOG CARD COMPONENTS
  // ---------------------------------------------------------------------------
  const BlogCard = ({ post, variant = 'default' }: { post: BlogPost; variant?: 'default' | 'small' | 'featured' | 'list' }) => {
    const engagement = getEngagement(post.id);

    // 1. FEATURED VARIANT (Hero Image)
    if (variant === 'featured') {
      return (
        <Link
          to={`/blog/${post.slug}`}
          className="group relative rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[var(--brand-midnight)] h-full flex flex-col justify-end transition-all duration-500 shadow-xl hover:shadow-[0_25px_60px_rgba(255,215,0,0.2)]"
        >
          <img
            src={toCloudinaryUrl(post.image_url, { width: 1600, height: 900, quality: 80, crop: 'fill' })}
            alt={post.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
          
          <div className="relative z-10 p-5 sm:p-8 md:p-10 transform group-hover:translate-y-[-5px] transition-transform duration-500">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-[var(--brand-gold)] text-midnight text-xs font-bold uppercase tracking-wider rounded-md">
                {post.category}
              </span>
              <span className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {calculateReadTime(post.excerpt)} min
              </span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 group-hover:text-[var(--brand-gold)] transition-colors duration-300 leading-tight">
              {post.title}
            </h3>
            
            <p className="hidden md:block text-sm md:text-base text-gray-300 mb-6 line-clamp-2 max-w-2xl leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between pt-5 border-t border-white/20">
              <div className="flex items-center gap-4 text-xs font-medium text-gray-300">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-gold" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-orange-500 transition-colors">
                  <Flame className="w-4 h-4" />
                  <span>{engagement.likes}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-gold transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>{engagement.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      );
    }

    // 2. LIST VARIANT (Sidebar news style)
    if (variant === 'list') {
      return (
        <Link
          to={`/blog/${post.slug}`}
          className="group flex gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
            <img
              src={toCloudinaryUrl(post.image_url, { width: 600, height: 600, quality: 80, crop: 'fill' })}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col justify-center flex-grow">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold mb-1.5">{post.category}</span>
            <h4 className="font-bold text-sm sm:text-base text-[var(--brand-midnight)] dark:text-white mb-2 line-clamp-2 group-hover:text-gold transition-colors leading-tight">
              {post.title}
            </h4>
            <div className="flex items-center gap-3 text-[11px] text-gray-500">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {calculateReadTime(post.excerpt)}m</span>
              <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {engagement.likes}</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {engagement.comments}</span>
            </div>
          </div>
        </Link>
      );
    }

    // 3. SMALL VARIANT (Grid)
    return (
      <Link
        to={`/blog/${post.slug}`}
        className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
      >
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={toCloudinaryUrl(post.image_url, { width: 800, height: 500, quality: 80, crop: 'fill' })}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur text-midnight text-[10px] font-black uppercase tracking-wider rounded-md shadow-sm">
            {post.category}
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <h4 className="font-bold text-lg text-[var(--brand-midnight)] dark:text-white mb-2 line-clamp-2 group-hover:text-[var(--brand-gold)] transition-colors leading-snug">
            {post.title}
          </h4>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {calculateReadTime(post.excerpt)} min
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 group-hover:text-orange-500 transition-colors"><Flame className="w-3.5 h-3.5" /> {engagement.likes}</span>
              <span className="flex items-center gap-1 group-hover:text-blue-500 transition-colors"><MessageSquare className="w-3.5 h-3.5" /> {engagement.comments}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen pt-16 bg-[var(--bg-page)] dark:bg-gray-900 font-poppins selection:bg-gold selection:text-midnight">
      <SEO
        title="Actualités & Blog | MIDEESSI"
        description="Découvrez nos articles sur la technologie, le business et l'innovation. Analyses et insights du monde digital."
        keywords={['blog', 'articles', 'tech', 'business', 'innovation', 'MIDEESSI']}
      />

      {/* HEADER SECTION */}
      <section className="bg-[var(--brand-midnight)] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black mb-3">L'Actu <span className="text-[var(--brand-gold)]">Tech & Digital</span></h1>
              <p className="text-gray-300 max-w-xl text-sm md:text-base">Les dernières tendances, stratégies et innovations pour propulser votre entreprise.</p>
            </div>
            <div className="w-full md:w-auto md:min-w-[300px]">
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
        </div>
      </section>

      {/* MEDIA/NEWS LAYOUT (Featured + Sidebar) */}
      {!loading && featuredPosts.length > 0 && searchQuery === '' && selectedCategory === 'all' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Colonne Principale (À la une) */}
            <div className="lg:col-span-2">
              <div className="h-[400px] sm:h-[500px] lg:h-[600px]">
                <BlogCard post={featuredPosts[0]} variant="featured" />
              </div>
            </div>

            {/* Colonne Latérale (Derniers Articles) */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-black text-[var(--brand-midnight)] dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gold" /> En continu
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                {featuredPosts.slice(1, 4).map(post => (
                  <BlogCard key={post.id} post={post} variant="list" />
                ))}
              </div>
              <Link to="/blog" className="mt-4 text-center text-sm font-bold text-[var(--brand-midnight)] dark:text-white hover:text-gold transition-colors py-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                Voir tous les articles récents →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* GRILLE COMPLÈTE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-8 bg-gold rounded-full" />
          <h2 className="text-2xl md:text-3xl font-black text-midnight dark:text-white">Dernières publications</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : displayedPosts.length > 0 ? (
          <>
            {(searchQuery || selectedCategory !== 'all') && (
              <SearchStatsComponent
                stats={{
                  totalResults: filteredPosts.length,
                  searchQuery,
                  selectedCategory,
                  totalArticles: allPosts.length
                }}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedPosts.map(post => (
                <ArticlePreview key={post.id} post={post}>
                  <BlogCard post={post} variant="small" />
                </ArticlePreview>
              ))}
            </div>

            {hasMore && (
              <div ref={observerTarget} className="flex justify-center mt-12 py-8">
                {loadingMore ? (
                  <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                ) : (
                  <p className="text-sm font-medium text-gray-500">Chargement...</p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-3xl">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-midnight dark:text-white mb-2">Aucun article trouvé</h3>
            <p className="text-gray-500 mb-6">Essayez une autre recherche.</p>
          </div>
        )}
      </section>

    </div>
  );
};

export default ModernBlog;
