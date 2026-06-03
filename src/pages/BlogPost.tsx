import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, User, ArrowLeft, Twitter, Linkedin,
  Copy, Clock, Tag, Eye, ChevronRight 
} from 'lucide-react';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';

// Extraire les headings pour la table of contents
const extractHeadings = (content: string) => {
  const headings: { text: string; level: number; id: string }[] = [];
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = `heading-${idx}`;
      headings.push({ text, level, id });
    }
  });
  
  return headings;
};

// Calcul du temps de lecture
const calculateReadTime = (content: string) => {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
};

const renderMarkdownContent = (content: string) => {
  let html = content;
  let headingIndex = 0;
  
  // Headers avec ID pour ancres
  html = html.replace(/^### (.*$)/gim, () => {
    const text = arguments[1];
    const id = `heading-${headingIndex++}`;
    return `<h3 id="${id}" class="text-base sm:text-lg md:text-xl font-bold mt-6 mb-3 text-midnight dark:text-white border-l-4 border-gold pl-4 scroll-mt-24">${text}</h3>`;
  });
  
  html = html.replace(/^## (.*$)/gim, () => {
    const text = arguments[1];
    const id = `heading-${headingIndex++}`;
    return `<h2 id="${id}" class="text-lg sm:text-xl md:text-2xl font-bold mt-8 mb-4 text-midnight dark:text-white border-l-4 border-gold pl-4 scroll-mt-24">${text}</h2>`;
  });
  
  html = html.replace(/^# (.*$)/gim, () => {
    const text = arguments[1];
    const id = `heading-${headingIndex++}`;
    return `<h1 id="${id}" class="text-xl sm:text-2xl md:text-3xl font-bold mt-10 mb-6 text-midnight dark:text-white border-l-4 border-gold pl-4 scroll-mt-24">${text}</h1>`;
  });
  
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-midnight dark:text-white">$1</strong>');
  
  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-800 dark:text-gray-100">$1</em>');
  
  // Images avec responsive + lazy load
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure class="my-6 sm:my-8"><img src="$2" alt="$1" loading="lazy" class="w-full rounded-xl shadow-lg max-w-full" /><figcaption class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3 text-center italic">$1</figcaption></figure>');
  
  // Links avec style
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-gold hover:text-gold/80 font-semibold hover:underline transition-colors">$1</a>');
  
  // Code blocks premium
  html = html.replace(/```([^`]+)```/g, '<pre class="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto my-6 border border-gray-700"><code class="text-xs sm:text-sm">$1</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gold/10 dark:bg-gold/5 text-gold font-mono px-2 py-1 rounded text-xs sm:text-sm">$1</code>');
  
  // Blockquotes premium
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gold bg-gold/5 dark:bg-gold/10 pl-4 pr-4 py-3 italic text-gray-800 dark:text-gray-200 my-4 rounded-r-lg">$1</blockquote>');
  
  // Listes
  html = html.replace(/\n- /g, '\n<li class="ml-4 sm:ml-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">');
  html = html.replace(/(<li[^>]*>[^<]*)<\/li>/g, '$1</li>');
  
  // Wrap lists
  html = html.replace(/(<li[^>]*>.*?<\/li>)/gs, (match: string) => {
    if (!match.includes('<ul')) {
      return '<ul class="list-disc space-y-2 my-4">' + match + '</ul>';
    }
    return match;
  });
  
  // Paragraphes
  const lines = html.split('\n');
  html = lines.map((line: string) => {
    if (line.trim() === '' || 
        line.includes('<h') || 
        line.includes('<ul') || 
        line.includes('<li') || 
        line.includes('<pre') || 
        line.includes('<blockquote') || 
        line.includes('<figure') ||
        line.includes('</')) {
      return line;
    }
    if (line.trim()) {
      return `<p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">${line}</p>`;
    }
    return line;
  }).join('\n');
  
  return { __html: html };
};

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find(p => p.id === id);
  
  const [readingProgress, setReadingProgress] = useState(0);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  
  const readTime = useMemo(() => calculateReadTime(post?.content || ''), [post]);
  const headings = useMemo(() => extractHeadings(post?.content || ''), [post]);
  
  // Tracking scroll pour progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setReadingProgress(scrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-midnight dark:text-white mb-4">404 - Article non trouvé</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            L'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-midnight font-semibold px-6 py-3 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au blog</span>
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post.title;

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setShowCopyMessage(true);
    setTimeout(() => setShowCopyMessage(false), 2000);
  };

  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title={`${post.title} | Blog MIDEESSI`}
        description={post.excerpt}
        image={post.image}
        type="article"
        keywords={['MIDEESSI', 'blog', post.category, 'article']}
      />

      {/* Reading Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-40">
        <div 
          className="h-full bg-gradient-to-r from-gold to-gold/70 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 overflow-x-auto pb-2">
          <Link to="/" className="hover:text-gold transition-colors whitespace-nowrap">Accueil</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link to="/blog" className="hover:text-gold transition-colors whitespace-nowrap">Blog</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-gold font-semibold truncate">{post.title}</span>
        </div>
      </div>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gold hover:text-gold/80 font-medium mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Retour aux articles</span>
        </Link>

        {/* Hero Section */}
        <header className="mb-12">
          {/* Featured Image */}
          <div className="relative -mx-4 sm:-mx-6 lg:mx-0 mb-8 rounded-xl overflow-hidden shadow-2xl h-64 sm:h-80 md:h-96">
            <img 
              src={post.image} 
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
            <span className="px-3 py-1.5 bg-gold/20 text-gold text-xs font-bold rounded-full uppercase tracking-wide">
              {post.category}
            </span>
            <span className="px-3 py-1.5 bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime} min de lecture
            </span>
            <span className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-full flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {Math.floor(Math.random() * 5000) + 500} vues
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-midnight dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author & Date */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pb-6 border-b-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center text-midnight font-bold text-lg">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-midnight dark:text-white text-sm">{post.author}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Expert MIDEESSI</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400 sm:ml-auto flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{new Date(post.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="capitalize">{post.category}</span>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center justify-between pt-6 flex-wrap gap-4">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Partager cet article</span>
            <div className="flex items-center gap-3">
              <button
                onClick={shareOnTwitter}
                className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg transition-all group"
                title="Partager sur Twitter"
              >
                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={shareOnLinkedIn}
                className="p-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-400 rounded-lg transition-all group"
                title="Partager sur LinkedIn"
              >
                <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all group relative"
                title="Copier le lien"
              >
                <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {showCopyMessage && (
                  <span className="absolute top-10 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                    Copié !
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={renderMarkdownContent(post.content)} />
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="mt-16 pt-12 border-t-2 border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl sm:text-3xl font-bold text-midnight dark:text-white mb-8">Articles connexes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedPosts.map(relatedPost => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.id}`}
                      className="group bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="relative h-40 sm:h-48 overflow-hidden">
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 sm:p-5">
                        <span className="text-xs font-bold text-gold uppercase">{relatedPost.category}</span>
                        <h3 className="font-bold text-midnight dark:text-white mt-2 mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Card */}
            <div className="mt-16 bg-gradient-to-r from-midnight to-blue-900 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 sm:p-8 text-white">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center font-black text-2xl sm:text-3xl text-midnight flex-shrink-0">
                  {post.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{post.author}</h3>
                  <p className="text-sm sm:text-base text-gray-200 mb-4 leading-relaxed">
                    {post.author === 'Medessi Coovi'
                      ? 'Fondateur et PDG de MIDEESSI, Medessi est un visionnaire en technologie avec 10+ ans d\'expérience. Il s\'engage à créer des solutions qui respectent l\'indépendance et le bien-être de la communauté africaine.'
                      : 'L\'équipe MIDEESSI est composée de développeurs et d\'innovateurs passionnés, dédiés à créer des solutions technologiques qui font la différence en Afrique.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="sticky top-24 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6 mb-6">
                <h3 className="font-bold text-midnight dark:text-white mb-4 flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4" />
                  Table des matières
                </h3>
                <nav className="space-y-2 text-xs sm:text-sm">
                  {headings.map((heading, idx) => (
                    <a
                      key={idx}
                      href={`#${heading.id}`}
                      className={`block text-gray-600 dark:text-gray-400 hover:text-gold transition-colors line-clamp-2 ${
                        heading.level === 2 ? 'font-medium' : ''
                      } ${heading.level > 2 ? 'pl-4' : ''}`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-br from-gold/10 to-gold/5 dark:from-gold/5 dark:to-gold/10 rounded-xl p-4 sm:p-6 border-2 border-gold/20">
              <h3 className="font-bold text-midnight dark:text-white mb-2 text-sm">Recevez nos articles</h3>
              <p className="text-xs text-gray-700 dark:text-gray-400 mb-4">
                Inscrivez-vous à notre newsletter pour ne rien rater.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gold/20 rounded-lg text-xs placeholder-gray-500 focus:outline-none focus:border-gold"
                />
                <button className="px-3 py-2 bg-gold hover:bg-gold/90 text-midnight font-bold rounded-lg transition-colors text-sm">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Bottom */}
        <div className="mt-16 bg-gradient-to-r from-midnight to-blue-900 dark:from-gray-800 dark:to-blue-900 rounded-xl p-8 sm:p-12 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Découvrez nos services</h2>
          <p className="text-sm sm:text-base text-gray-300 mb-6 max-w-2xl mx-auto">
            Des solutions innovantes adaptées à vos besoins. Parlons de votre projet.
          </p>
          <Link
            to="/offres"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-midnight font-bold px-6 py-3 rounded-lg transition-all text-sm"
          >
            Explorer nos offres
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Back to Blog */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gold hover:text-gold/80 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
