import { useEffect, useState } from 'react';
import { Calendar, User, Clock, Search, TrendingUp, Zap, Code, Briefcase, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';
import BlogCarousel from '../components/BlogCarousel';
import { supabase, BlogPost, BlogCategory } from '../lib/supabase';

const ModernBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
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
          .order('published_at', { ascending: false })
          .limit(100),
        supabase
          .from('blog_categories')
          .select('*')
          .order('name', { ascending: true })
      ]);

      if (postsResult.data) {
        setPosts(postsResult.data);
        setFeaturedPosts(postsResult.data.slice(0, 3));
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

  const calculateReadTime = (text: string) => Math.ceil(text.split(' ').length / 200);

  const getPostsByCategory = (categoryName: string) => {
    return posts.filter(post => post.category === categoryName).slice(0, 8);
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Blog card component
  const BlogCard = ({ post, variant = 'default' }: { post: BlogPost; variant?: 'default' | 'small' | 'featured' }) => {
    if (variant === 'featured') {
      return (
        <a
          href={`/blog/${post.slug}`}
          className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black h-full flex flex-col justify-end hover:shadow-2xl transition-all duration-300"
        >
          <img
            src={post.image_url}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-gold text-midnight text-xs font-bold rounded-full">
                {post.category}
              </span>
              <span className="text-xs text-gray-300 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {calculateReadTime(post.excerpt)} min
              </span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-gold transition-colors line-clamp-3">
              {post.title}
            </h3>
            
            <p className="text-gray-300 text-sm md:text-base mb-4 line-clamp-2">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gold" />
                <span className="text-xs text-gray-400">{post.author}</span>
              </div>
              <span className="text-gold font-bold text-sm">Lire →</span>
            </div>
          </div>
        </a>
      );
    }

    if (variant === 'small') {
      return (
        <a
          href={`/blog/${post.slug}`}
          className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full transform hover:scale-103 hover:-translate-y-1"
        >
          <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3 px-3 py-1.5 bg-gold text-midnight text-xs font-bold rounded-full shadow-lg">
              {post.category}
            </div>
          </div>
          
          <div className="p-5 flex flex-col flex-grow">
            <h4 className="font-bold text-base md:text-lg text-midnight dark:text-white mb-3 line-clamp-2 group-hover:text-gold transition-colors">
              {post.title}
            </h4>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-3">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {calculateReadTime(post.excerpt)} min
              </span>
              <span className="text-gold font-bold text-sm group-hover:translate-x-1 transition-transform">Lire →</span>
            </div>
          </div>
        </a>
      );
    }

    // Default (carousel)
    return (
      <a
        href={`/blog/${post.slug}`}
        className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full transform hover:scale-105 hover:-translate-y-2"
      >
        <div className="relative h-52 overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-gold text-midnight text-xs font-bold rounded-full shadow-lg">
            {post.category}
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h4 className="font-bold text-lg md:text-xl text-midnight dark:text-white mb-3 line-clamp-2 group-hover:text-gold transition-colors">
            {post.title}
          </h4>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 flex-grow line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {calculateReadTime(post.excerpt)} min
            </span>
            <span className="text-gold font-bold group-hover:translate-x-1.5 transition-transform">Lire →</span>
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
      <section className="relative bg-gradient-to-br from-midnight via-blue-900 to-black dark:from-black dark:via-gray-900 dark:to-black text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Blog Tech & Business
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-16">
            Explorez nos articles sur la technologie, l'entrepreneuriat et l'innovation africaine.
          </p>

          {/* SEARCH HERO */}
          <div className="relative max-w-2xl mb-12">
            <Search className="absolute left-5 top-5 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Chercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-gray-400 focus:outline-none focus:border-gold focus:bg-white/20 transition-all backdrop-blur-sm text-lg"
            />
          </div>

          {/* CATEGORY PILLS */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                selectedCategory === 'all'
                  ? 'bg-gold text-midnight shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              Tous
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-5 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                  selectedCategory === cat.name
                    ? 'bg-gold text-midnight shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED GRANDE FORMAT */}
      {!loading && featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-10">À la Une</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Grand article */}
            <div className="md:col-span-2">
              <div className="h-96 md:h-full rounded-2xl overflow-hidden min-h-80">
                <BlogCard post={featuredPosts[0]} variant="featured" />
              </div>
            </div>

            {/* 2 petits articles */}
            <div className="space-y-6">
              {featuredPosts.slice(1, 3).map(post => (
                <div key={post.id} className="h-40">
                  <BlogCard post={post} variant="featured" />
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
            posts={posts.slice(0, 8)}
            renderCard={(post) => <BlogCard post={post} />}
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
                renderCard={(post) => <BlogCard post={post} />}
              />
            );
          })}
        </section>
      )}

      {/* GRILLE COMPLÈTE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-10">Tous les Articles</h2>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <BlogCard key={post.id} post={post} variant="small" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-midnight dark:text-white mb-2">Aucun article trouvé</h3>
            <p className="text-gray-600 dark:text-gray-400">Essayez une autre recherche</p>
          </div>
        )}
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-gold to-yellow-400 text-midnight py-20 md:py-24 mt-8">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Pas trouvé ce que tu cherches?</h2>
          <p className="text-lg md:text-xl mb-10 opacity-90">Découvre nos services et offres adaptées à tes besoins</p>
          <a
            href="/offres"
            className="inline-block bg-midnight hover:bg-black text-gold px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105"
          >
            Voir nos offres →
          </a>
        </div>
      </section>
    </div>
  );
};

export default ModernBlog;
