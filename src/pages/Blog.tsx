import BlogCard from '../components/BlogCard';
import { blogPosts } from '../data/blogPosts';

const Blog = () => {
  return (
    <div className="min-h-screen pt-16">
      <section className="bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Blog & Actualités</h1>
          <p className="text-xl text-center text-gray-200 max-w-3xl mx-auto">
            Découvrez nos dernières réflexions sur la technologie, l'innovation et l'avenir de l'automatisation.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>

          {blogPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Aucun article disponible pour le moment. Revenez bientôt !
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-midnight dark:text-white mb-6">
            Restez Informé
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Nous publions régulièrement des articles sur nos projets, nos découvertes technologiques
            et nos réflexions sur l'avenir de l'innovation. Suivez-nous pour ne rien manquer !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-midnight dark:bg-white text-white dark:text-midnight font-semibold rounded-lg hover:bg-gold hover:text-midnight transition-colors"
            >
              Suivez-nous sur Facebook
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-midnight dark:bg-white text-white dark:text-midnight font-semibold rounded-lg hover:bg-gold hover:text-midnight transition-colors"
            >
              Suivez-nous sur LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
