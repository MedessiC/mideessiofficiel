import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';

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

  const contentParagraphs = post.content.split('\n\n');

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
          <h1 className="text-4xl md:text-5xl font-bold text-midnight dark:text-white mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
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

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {contentParagraphs.map((paragraph, index) => {
            if (paragraph.startsWith('# ')) {
              return (
                <h1 key={index} className="text-3xl font-bold text-midnight dark:text-white mt-8 mb-4">
                  {paragraph.replace('# ', '')}
                </h1>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl font-bold text-midnight dark:text-white mt-6 mb-3">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl font-bold text-midnight dark:text-white mt-4 mb-2">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n');
              return (
                <ul key={index} className="list-disc list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace('- ', '')}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-midnight dark:text-white mb-3">
              À propos de l'auteur
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
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
