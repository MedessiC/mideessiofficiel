import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, ArrowRight, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';
import BlogSearchBar from '../components/BlogSearchBar';
import { supabase, BlogPost, BlogCategory } from '../lib/supabase';
import { toCloudinaryUrl } from '../utils/cloudinaryImage';

const ModernBlog = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Blog & Analyses — MIDEESSI';
    fetchData();
  }, []);

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
          .order('name', { ascending: true }),
      ]);

      if (postsResult.data) {
        setAllPosts(postsResult.data);
      }
      if (categoriesResult.data) {
        setCategories(categoriesResult.data);
      }
    } catch (err) {
      console.error('Erreur chargement blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateReadTime = (text: string) => Math.max(1, Math.ceil((text || '').split(' ').length / 200));

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  return (
    <div style={{ backgroundColor: '#FAFAFA' }}>
      <SEO
        title="Blog & Analyses — MIDEESSI"
        description="Analyses, réflexions et récits de terrain sur la technologie, la souveraineté numérique et l'innovation en Afrique."
      />

      {/* ── Section Hero / Header ── */}
      <section style={{ paddingTop: 'clamp(64px, 10vh, 120px)', paddingBottom: '48px' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-medium uppercase tracking-[0.14em] mb-4 block" style={{ color: '#6B7280' }}>
                Réflexions & Analyses
              </span>
              <div className="w-12 h-0.5 mb-6" style={{ backgroundColor: '#E5E7EB' }} />
              <h1
                className="font-bold mb-4"
                style={{
                  fontSize: 'clamp(36px, 6vw, 64px)',
                  lineHeight: 1.05,
                  color: '#191970',
                  letterSpacing: '-0.02em',
                }}
              >
                Le Blog MIDEESSI
              </h1>
              <p className="text-base leading-relaxed" style={{ color: '#4B5563', fontSize: 'clamp(16px, 2vw, 18px)' }}>
                Perspectives sur la tech locale, le numérique utile et la souveraineté technologique africaine.
              </p>
            </div>

            {/* Search Bar Container */}
            <div className="w-full md:w-80 flex-shrink-0">
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

      {/* ── Main Content ── */}
      <section style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7EB', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">

          {loading ? (
            <div className="py-20 text-center">
              <p className="text-sm font-medium" style={{ color: '#6B7280' }}>
                Chargement des articles...
              </p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-20 text-center bg-[#FAFAFA] rounded-2xl border border-[#E5E7EB] p-12">
              <BookOpen size={40} className="mx-auto mb-4" style={{ color: '#6B7280' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#191970' }}>
                Aucun article trouvé
              </h3>
              <p className="text-sm" style={{ color: '#4B5563' }}>
                Essayez d'ajuster votre recherche ou filtre.
              </p>
            </div>
          ) : (
            <>
              {/* Featured Post (Si pas de filtre de recherche spécifique) */}
              {featuredPost && searchQuery === '' && selectedCategory === 'all' && (
                <div className="mb-16">
                  <Link
                    to={`/article/${featuredPost.slug}`}
                    className="group block bg-[#FAFAFA] rounded-2xl overflow-hidden border border-[#E5E7EB] transition-all duration-200"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#191970';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB';
                    }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                      <div className="lg:col-span-7 h-64 sm:h-80 lg:h-96 bg-[#F3F4F6] overflow-hidden">
                        {featuredPost.image_url ? (
                          <img
                            src={toCloudinaryUrl(featuredPost.image_url, { width: 1200, height: 800, quality: 80, crop: 'fill' })}
                            alt={featuredPost.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
                        )}
                      </div>

                      <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: '#191970' }}>
                              À la une · {featuredPost.category}
                            </span>
                            <span className="text-xs flex items-center gap-1" style={{ color: '#6B7280' }}>
                              <Clock size={12} /> {calculateReadTime(featuredPost.excerpt)} min de lecture
                            </span>
                          </div>

                          <h2
                            className="font-bold mb-4 line-clamp-3"
                            style={{ fontSize: 'clamp(24px, 3vw, 32px)', color: '#111111', lineHeight: 1.2 }}
                          >
                            {featuredPost.title}
                          </h2>

                          <p className="text-sm leading-relaxed line-clamp-3 mb-6" style={{ color: '#4B5563' }}>
                            {featuredPost.excerpt}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-[#E5E7EB]">
                          <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#6B7280' }}>
                            <User size={13} /> {featuredPost.author}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all" style={{ color: '#191970' }}>
                            Lire l'article <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Grid des articles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {(searchQuery !== '' || selectedCategory !== 'all' ? filteredPosts : gridPosts).map((post) => (
                  <Link
                    key={post.id}
                    to={`/article/${post.slug}`}
                    className="group bg-[#FAFAFA] rounded-2xl overflow-hidden border border-[#E5E7EB] flex flex-col transition-all duration-200"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#191970';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB';
                    }}
                  >
                    <div className="h-48 bg-[#F3F4F6] overflow-hidden">
                      {post.image_url ? (
                        <img
                          src={toCloudinaryUrl(post.image_url, { width: 800, height: 500, quality: 80, crop: 'fill' })}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">📰</div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: '#191970' }}>
                            {post.category}
                          </span>
                          <span className="text-xs flex items-center gap-1" style={{ color: '#6B7280' }}>
                            <Clock size={12} /> {calculateReadTime(post.excerpt)} min
                          </span>
                        </div>

                        <h3 className="font-bold text-base mb-2 line-clamp-2" style={{ color: '#111111' }}>
                          {post.title}
                        </h3>

                        <p className="text-xs leading-relaxed line-clamp-3 mb-6" style={{ color: '#4B5563' }}>
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                        <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
                          {post.author}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all" style={{ color: '#191970' }}>
                          Lire <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

        </div>
      </section>
    </div>
  );
};

export default ModernBlog;
