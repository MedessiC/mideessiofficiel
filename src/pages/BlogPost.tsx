import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';

const renderMarkdownContent = (content: string) => {
  let html = content;
  
  // Headers - responsive sizes for different screen sizes
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-base sm:text-lg md:text-xl font-bold mt-6 mb-3 text-midnight dark:text-white border-l-4 border-blue-600 pl-4">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg sm:text-xl md:text-2xl font-bold mt-8 mb-4 text-midnight dark:text-white border-l-4 border-blue-600 pl-4">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl sm:text-2xl md:text-3xl font-bold mt-10 mb-6 text-midnight dark:text-white border-l-4 border-blue-600 pl-4">$1</h1>');
  
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-midnight dark:text-white">$1</strong>');
  
  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-800 dark:text-gray-100">$1</em>');
  
  // Images with figure caption - responsive sizing
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure class="my-4 sm:my-6"><img src="$2" alt="$1" class="w-full rounded-lg shadow-md max-w-full" /><figcaption class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">$1</figcaption></figure>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">$1</a>');
  
  // Code blocks - responsive padding
  html = html.replace(/```([^`]+)```/g, '<pre class="bg-gray-900 dark:bg-black text-gray-100 p-2 sm:p-4 rounded-lg overflow-x-auto my-4 border border-gray-700 text-xs sm:text-sm"><code>$1</code></pre>');
  
  // Inline code - responsive text size
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 rounded font-mono text-xs sm:text-sm">$1</code>');
  
  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gold pl-4 italic text-gray-700 dark:text-gray-300 my-4">$1</blockquote>');
  
  // Unordered lists - responsive margin
  html = html.replace(/\n- /g, '\n<li class="ml-4 sm:ml-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">');
  html = html.replace(/(<li[^>]*>[^<]*)<\/li>/g, '$1</li>');
  
  // Wrap lists in ul - responsive spacing
  html = html.replace(/(<li[^>]*>.*?<\/li>)/gs, (match: string) => {
    if (!match.includes('<ul')) {
      return '<ul class="list-disc space-y-1 sm:space-y-2 my-3 sm:my-4">' + match + '</ul>';
    }
    return match;
  });
  
  // Paragraphs - wrap remaining text that's not already in a tag with responsive sizing
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
      return `<p class="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">${line}</p>`;
    }
    return line;
  }).join('\n');
  
  return { __html: html };
};

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-midnight dark:text-white mb-4">Article non trouvé</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            L'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-gold hover:text-midnight dark:hover:text-white font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au blog</span>
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
        image={post.image}
        type="article"
        keywords={['MIDEESSI', 'blog', 'article', 'technologie', 'innovation']}
      />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-gold hover:text-midnight dark:hover:text-white font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux articles</span>
        </Link>

        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-midnight dark:text-white mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
          </div>
        </header>

        <div className="prose dark:prose-invert md:prose-lg max-w-none">
          <div dangerouslySetInnerHTML={renderMarkdownContent(post.content)} />
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-midnight dark:text-white mb-3">
              À propos de l'auteur
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
              {post.author === 'Medessi Coovi'
                ? 'Fondateur de MIDEESSI, passionné de technologie et d\'innovation. Engagé pour créer des solutions qui respectent l\'indépendance et servent la communauté.'
                : 'L\'équipe MIDEESSI est composée de développeurs et d\'innovateurs passionnés, dédiés à créer des solutions technologiques qui font la différence.'}
            </p>
          </div>
        </footer>

        <div className="mt-8 flex justify-center">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 bg-gold hover:bg-yellow-500 text-midnight font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <span>Voir plus d'articles</span>
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
