import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Eye, Share2, Clock, Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase, BlogPost } from '../lib/supabase';

// Skeleton pour le chargement
const PostSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
    <div className="h-6 bg-corporate-200 dark:bg-gray-700 rounded w-32 mb-8" />
    <div className="space-y-4 mb-8">
      <div className="h-4 bg-corporate-200 dark:bg-gray-700 rounded w-24" />
      <div className="h-12 bg-corporate-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-6 bg-corporate-200 dark:bg-gray-700 rounded w-3/4" />
    </div>
    <div className="h-96 bg-corporate-200 dark:bg-gray-700 rounded-lg mb-8" />
    <div className="space-y-3">
      <div className="h-4 bg-corporate-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-corporate-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-corporate-200 dark:bg-gray-700 rounded w-3/4" />
    </div>
  </div>
);

const NewBlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPost = async () => {
    try {
      setLoading(true);

      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (data) {
        setPost(data);

        // Incrémenter les vues
        await supabase
          .from('blog_posts')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', data.id);

        // Charger les articles similaires
        const { data: related } = await supabase
          .from('blog_posts')
          .select('id, slug, title, excerpt, image_url, category, published_at, author')
          .eq('is_published', true)
          .eq('category', data.category)
          .neq('id', data.id)
          .order('published_at', { ascending: false })
          .limit(3);

        if (related) setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateReadingTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      setShareMenuOpen(!shareMenuOpen);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || '');
    
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        // Titres
        if (paragraph.startsWith('## ')) {
          return (
            <h2 key={index} className="text-3xl font-bold text-midnight dark:text-white mt-8 mb-4">
              {paragraph.replace('## ', '')}
            </h2>
          );
        }
        if (paragraph.startsWith('### ')) {
          return (
            <h3 key={index} className="text-2xl font-bold text-midnight dark:text-white mt-6 mb-3">
              {paragraph.replace('### ', '')}
            </h3>
          );
        }

        // Listes
        if (paragraph.startsWith('- ')) {
          const items = paragraph.split('\n');
          return (
            <ul key={index} className="list-disc list-inside space-y-2 my-4">
              {items.map((item, i) => (
                <li key={i} className="text-corporate-700 dark:text-corporate-200">
                  {item.replace('- ', '')}
                </li>
              ))}
            </ul>
          );
        }

        // Images
        const imgMatch = paragraph.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imgMatch) {
          return (
            <div key={index} className="my-8">
              <img
                src={imgMatch[2]}
                alt={imgMatch[1]}
                loading="lazy"
                className="w-full rounded-lg shadow-lg"
              />
              {imgMatch[1] && (
                <p className="text-sm text-corporate-500 dark:text-corporate-400 text-center mt-2 italic">
                  {imgMatch[1]}
                </p>
              )}
            </div>
          );
        }

        // Liens et formatage inline
        let formattedText = paragraph
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer">$1</a>');

        return (
          <p
            key={index}
            className="text-lg text-corporate-700 dark:text-corporate-200 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
        <PostSkeleton />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-midnight dark:text-white mb-4">
            Article introuvable
          </h1>
          <p className="text-lg text-corporate-600 dark:text-corporate-300 mb-8">
            L'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <a
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Retour au blog
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title={`${post.title} | Blog MIDEESSI`}
        description={post.excerpt}
        image={post.image_url}
        type="article"
        keywords={post.tags}
      />

      {/* Barre de progression de lecture */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-corporate-100 dark:bg-gray-800 z-50">
        <div
          className="h-full bg-blue-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <a
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-8 group"
        >
          <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour au blog
        </a>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-corporate-500 dark:text-corporate-400 mb-6">
            <span className="px-3 py-1 bg-blue-600 text-white rounded-full font-semibold shadow-sm">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.published_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views || 0} vues
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {calculateReadingTime(post.content)} min de lecture
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-midnight dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-corporate-600 dark:text-corporate-300 leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        <div className="relative h-96 rounded-lg overflow-hidden mb-8 shadow-xl">
          <img
            src={post.image_url}
            alt={post.title}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center justify-between py-4 border-y border-corporate-200 dark:border-gray-700 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-corporate-500" />
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-corporate-100 dark:bg-gray-800 text-corporate-700 dark:text-corporate-300 text-sm rounded-full hover:bg-corporate-200 dark:hover:bg-gray-700 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Partager
            </button>

            {shareMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-corporate-200 dark:border-gray-700 py-2 z-10">
                <button
                  onClick={() => shareOnSocial('facebook')}
                  className="w-full px-4 py-2 text-left hover:bg-corporate-50 dark:hover:bg-gray-700 flex items-center gap-2 text-corporate-700 dark:text-corporate-200"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </button>
                <button
                  onClick={() => shareOnSocial('twitter')}
                  className="w-full px-4 py-2 text-left hover:bg-corporate-50 dark:hover:bg-gray-700 flex items-center gap-2 text-corporate-700 dark:text-corporate-200"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </button>
                <button
                  onClick={() => shareOnSocial('linkedin')}
                  className="w-full px-4 py-2 text-left hover:bg-corporate-50 dark:hover:bg-gray-700 flex items-center gap-2 text-corporate-700 dark:text-corporate-200"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </button>
                <button
                  onClick={copyToClipboard}
                  className="w-full px-4 py-2 text-left hover:bg-corporate-50 dark:hover:bg-gray-700 flex items-center gap-2 text-corporate-700 dark:text-corporate-200 border-t border-corporate-200 dark:border-gray-600"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
                  {copied ? 'Copié !' : 'Copier le lien'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contenu formaté */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          {formatContent(post.content)}
        </div>

        {/* Call to action */}
        <div className="my-12 p-8 bg-gradient-to-br from-blue-50 to-corporate-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-blue-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-midnight dark:text-white mb-4">
            Vous avez aimé cet article ?
          </h3>
          <p className="text-corporate-600 dark:text-corporate-300 mb-6">
            Rejoignez le mouvement MIDEESSI et restez informé de nos dernières innovations et actualités.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              Nous contacter
            </a>
            <a
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 hover:bg-corporate-50 dark:hover:bg-gray-700 text-corporate-700 dark:text-corporate-200 font-semibold rounded-lg border border-corporate-200 dark:border-gray-600 transition-colors"
            >
              Plus d'articles
            </a>
          </div>
        </div>

        {/* Articles similaires */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-8 border-t border-corporate-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-midnight dark:text-white mb-6">
              Articles similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <a
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-corporate-50 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all border border-corporate-200 dark:border-gray-700"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="relative h-40 overflow-hidden bg-corporate-100 dark:bg-gray-700">
                    <img
                      src={relatedPost.image_url}
                      alt={relatedPost.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-corporate-500 dark:text-corporate-400 mb-2">
                      {new Date(relatedPost.published_at).toLocaleDateString('fr-FR')}
                    </div>
                    <h3 className="font-bold text-midnight dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-corporate-600 dark:text-corporate-300 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Styles pour les animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NewBlogPost;