import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Eye, Share2, Clock, Facebook, Twitter, Linkedin, Link as LinkIcon, Check, Bookmark, Heart, MessageCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase, BlogPost } from '../lib/supabase';

// Skeleton pour le chargement
const PostSkeleton = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-40 mb-10" />
    <div className="space-y-6 mb-10">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-32" />
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl w-full" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-3/4" />
    </div>
    <div className="h-[500px] bg-gray-200 dark:bg-gray-700 rounded-3xl mb-10" />
    <div className="space-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full" style={{ width: `${Math.random() * 30 + 70}%` }} />
      ))}
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
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

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
  // Utiliser le domaine de partage pour les crawlers
  // Les visiteurs normaux seront redirigés vers mideessi.com
  const shareUrl = `https://share.mideessi.com/blog/${post?.slug}`;
  
  if (navigator.share) {
    navigator.share({
      title: post?.title || 'MIDEESSI',
      text: post?.excerpt || 'Découvrez cet article sur MIDEESSI',
      url: shareUrl,
    }).catch((error) => {
      console.error('Erreur lors du partage:', error);
      setShareMenuOpen(true); // fallback si l'API échoue
    });
  } else {
    setShareMenuOpen(true); // fallback pour navigateurs non compatibles
  }
};


  // Fonction pour copier le lien de partage
const copyToClipboard = () => {
  const shareUrl = `https://share.mideessi.com/blog/${post?.slug}`;
  navigator.clipboard.writeText(shareUrl);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};


  // Fonction pour partager sur les réseaux sociaux
const shareOnSocial = (platform: string) => {
  const shareUrl = encodeURIComponent(`https://share.mideessi.com/blog/${post?.slug}`);
  const title = encodeURIComponent(post?.title || '');
  
  const urls: Record<string, string> = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    whatsapp: `https://wa.me/?text=${title}%20${shareUrl}`,
    telegram: `https://t.me/share/url?url=${shareUrl}&text=${title}`,
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
        if (paragraph.startsWith('# ')) {
          const text = paragraph.replace(/^# /, '');
          return (
            <h1 key={index} className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-midnight dark:text-white mt-8 sm:mt-10 md:mt-14 mb-4 sm:mb-6 md:mb-8 leading-tight">
              {text}
            </h1>
          );
        }
        if (paragraph.startsWith('## ')) {
          const text = paragraph.replace(/^## /, '');
          return (
            <h2 key={index} className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-midnight dark:text-white mt-8 sm:mt-10 md:mt-12 mb-4 sm:mb-5 md:mb-6 leading-tight">
              {text}
            </h2>
          );
        }
        if (paragraph.startsWith('### ')) {
          const text = paragraph.replace(/^### /, '');
          return (
            <h3 key={index} className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-midnight dark:text-white mt-6 sm:mt-8 md:mt-10 mb-3 sm:mb-4 md:mb-5 leading-tight">
              {text}
            </h3>
          );
        }

        // Listes
        if (paragraph.startsWith('- ')) {
          const items = paragraph.split('\n');
          return (
            <ul key={index} className="space-y-2 sm:space-y-3 my-4 sm:my-6 pl-3 sm:pl-4">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-200 leading-relaxed">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-1.5 sm:mt-2.5 flex-shrink-0"></span>
                  <span>{item.replace(/^- /, '')}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Citations
        if (paragraph.startsWith('> ')) {
          const text = paragraph.replace(/^> /, '');
          return (
            <blockquote key={index} className="my-4 sm:my-6 md:my-8 pl-3 sm:pl-6 border-l-4 border-yellow-400 bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-900/20 dark:to-transparent py-3 sm:py-4 pr-3 sm:pr-6 rounded-r-2xl">
              <p className="text-xs sm:text-sm md:text-lg lg:text-xl italic text-gray-700 dark:text-gray-200 leading-relaxed">
                {text}
              </p>
            </blockquote>
          );
        }

        // Images
        const imgMatch = paragraph.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imgMatch) {
          return (
            <figure key={index} className="my-6 sm:my-8 md:my-10">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-2xl">
                <img
                  src={imgMatch[2]}
                  alt={imgMatch[1]}
                  loading="lazy"
                  className="w-full"
                />
              </div>
              {imgMatch[1] && (
                <figcaption className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mt-2 sm:mt-4 italic">
                  {imgMatch[1]}
                </figcaption>
              )}
            </figure>
          );
        }

        // Code blocks
        if (paragraph.startsWith('```')) {
          const codeContent = paragraph.replace(/```\w*\n?/, '').replace(/```$/, '');
          return (
            <pre key={index} className="my-4 sm:my-6 md:my-8 p-3 sm:p-4 md:p-6 bg-gray-900 rounded-xl sm:rounded-2xl overflow-x-auto shadow-md sm:shadow-lg">
              <code className="text-xs sm:text-sm text-gray-100 font-mono">{codeContent}</code>
            </pre>
          );
        }

        // Formatage inline avec dangerouslySetInnerHTML
        // Ordre important: traiter **...**  avant  *...*
        let formattedText = paragraph
          // Gras: **...**
          .replace(/\*\*([^*]+?)\*\*/g, '<strong class="font-bold text-midnight dark:text-yellow-400">$1</strong>')
          // Italique: *...*
          .replace(/\*([^*]+?)\*/g, '<em class="italic text-gray-800 dark:text-gray-100">$1</em>')
          // Liens: [texte](url)
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-yellow-400 hover:text-yellow-500 font-medium underline decoration-2 underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>')
          // Code inline: `...`
          .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 rounded font-mono text-sm">$1</code>');

        return (
          <p
            key={index}
            className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-3 sm:mb-4 md:mb-6"
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
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <ArrowLeft className="w-12 h-12 text-midnight" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-midnight dark:text-white mb-4">
            Article introuvable
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-md mx-auto">
            L'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-midnight font-bold rounded-full transition-all transform hover:scale-105 shadow-lg"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Retour au blog
          </Link>
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
        article={{
          publishedTime: post.published_at,
          modifiedTime: post.updated_at || post.published_at,
          author: post.author,
          section: post.category,
          tags: post.tags,
        }}
      />

      {/* Barre de progression de lecture */}
      <div className="fixed top-16 left-0 right-0 h-1.5 bg-gray-100 dark:bg-gray-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-150 shadow-lg"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Boutons flottants (mobile) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40 md:hidden">
        <button
          onClick={handleShare}
          className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 text-midnight rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Share2 className="w-6 h-6" />
        </button>
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
            bookmarked 
              ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-midnight scale-110' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:scale-110'
          }`}
        >
          <Bookmark className={`w-6 h-6 ${bookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Bouton retour */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-midnight dark:hover:text-white font-semibold mb-10 group hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Retour au blog
        </Link>

        {/* En-tête de l'article */}
        <header className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-midnight rounded-full font-bold text-xs sm:text-sm shadow-md">
              {post.category}
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-3 sm:w-4 h-3 sm:h-4" />
              {new Date(post.published_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
              {calculateReadingTime(post.content)} min
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
              {post.views || 0} vues
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-midnight dark:text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
            {post.title}
          </h1>

          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8">
            {post.excerpt}
          </p>

          {/* Info auteur */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 py-4 sm:py-6 border-y-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 sm:w-14 h-10 sm:h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 sm:w-7 h-5 sm:h-7 text-midnight" />
              </div>
              <div>
                <p className="font-bold text-midnight dark:text-white text-sm sm:text-base md:text-lg">{post.author}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Auteur</p>
              </div>
            </div>

            {/* Actions desktop */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
                  liked 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm">{liked ? 'Aimé' : "J'aime"}</span>
              </button>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
                  bookmarked 
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                <span className="text-sm">{bookmarked ? 'Enregistré' : 'Enregistrer'}</span>
              </button>
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-midnight font-bold rounded-full transition-all shadow-md"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">Partager</span>
                </button>

                {shareMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 py-2 z-10 animate-fadeIn">
                    <button
                      onClick={() => shareOnSocial('facebook')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-200 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Facebook className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium">Facebook</span>
                    </button>
                    <button
                      onClick={() => shareOnSocial('twitter')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-200 transition-colors"
                    >
                      <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                        <Twitter className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium">Twitter</span>
                    </button>
                    <button
                      onClick={() => shareOnSocial('linkedin')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-200 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
                        <Linkedin className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium">LinkedIn</span>
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-200 border-t-2 border-gray-200 dark:border-gray-600 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        {copied ? <Check className="w-5 h-5 text-white" /> : <LinkIcon className="w-5 h-5 text-white" />}
                      </div>
                      <span className="font-medium">{copied ? 'Lien copié !' : 'Copier le lien'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Image principale */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-12 shadow-lg sm:shadow-2xl">
          <div className="aspect-video bg-gray-100 dark:bg-gray-800">
            <img
              src={post.image_url}
              alt={post.title}
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-4 sm:py-6 mb-6 sm:mb-8">
          <Tag className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" />
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-full hover:bg-gradient-to-br hover:from-yellow-400 hover:to-yellow-500 hover:text-midnight transition-all cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Contenu formaté */}
        <div className="prose dark:prose-invert md:prose-lg max-w-none mb-12 sm:mb-16">
          {formatContent(post.content)}
        </div>

        {/* Call to action */}
        <div className="my-12 sm:my-16 p-4 sm:p-8 md:p-12 bg-gradient-to-br from-midnight via-blue-900 to-midnight dark:from-gray-800 dark:to-gray-900 rounded-2xl sm:rounded-3xl border-2 border-yellow-400 shadow-lg sm:shadow-2xl">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Vous avez aimé cet article ?
          </h3>
          <div className="w-16 sm:w-20 h-1 bg-yellow-400 rounded-full mb-4 sm:mb-6"></div>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
            Rejoignez le mouvement MIDEESSI et restez informé de nos dernières innovations et actualités technologiques.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-midnight font-bold text-sm sm:text-base rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Nous contacter
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-sm sm:text-base rounded-full border-2 border-white/30 transition-all"
            >
              Plus d'articles
            </Link>
          </div>
        </div>

        {/* Articles similaires */}
        {relatedPosts.length > 0 && (
          <section className="mt-12 sm:mt-16 md:mt-20 pt-8 sm:pt-10 md:pt-12 border-t-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-10">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-yellow-400/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-midnight dark:text-white">
                Articles similaires
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-lg sm:hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-400 transform hover:-translate-y-1"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="relative h-36 sm:h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={relatedPost.image_url}
                      alt={relatedPost.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                      <Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                      <span className="text-xs">{new Date(relatedPost.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 rounded-full font-semibold text-xs">
                        {relatedPost.category}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-midnight dark:text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight">
                      {relatedPost.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NewBlogPost;