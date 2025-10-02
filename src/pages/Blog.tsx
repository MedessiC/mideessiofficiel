import BlogCard from '../components/BlogCard';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';
import { Facebook, Linkedin, Rss } from 'lucide-react';

const Blog = () => {
  return (
    <div className="min-h-screen pt-16">
      <SEO
        title="Blog MIDEESSI | Actualités technologiques et innovation"
        description="Suivez les dernières actualités de MIDEESSI, nos réflexions sur l'IA, l'automatisation et l'innovation technologique en Afrique."
        keywords={['blog', 'actualités', 'IA', 'automatisation', 'technologie', 'innovation', 'MIDEESSI']}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center tracking-tight">
            Blog & <span className="text-gold">Actualités</span>
          </h1>
          <p className="text-xl md:text-2xl text-center text-gray-200 max-w-3xl mx-auto font-light">
            Découvrez nos dernières réflexions sur la technologie, l'innovation et l'avenir de l'automatisation.
          </p>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogPosts.length > 0 ? (
            <>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-midnight dark:text-white mb-4">
                  Articles Récents
                </h2>
                <div className="w-20 h-1 bg-gold mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <div 
                    key={post.id}
                    className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                  >
                    <BlogCard {...post} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gold/10 rounded-full mb-6">
                <Rss className="w-10 h-10 text-gold" />
              </div>
              <h3 className="text-2xl font-bold text-midnight dark:text-white mb-4">
                Bientôt Disponible
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                Nous préparons du contenu exclusif pour vous. Restez connectés pour découvrir nos premiers articles !
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories/Topics Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-midnight dark:text-white mb-4">
              Nos Thématiques
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Intelligence Artificielle', 'Automatisation', 'Innovation', 'Développement'].map((topic, index) => (
              <div 
                key={topic}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <h3 className="text-lg font-semibold text-midnight dark:text-white group-hover:text-gold transition-colors duration-300">
                  {topic}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stay Connected Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl p-12">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-midnight dark:text-white mb-4">
                Restez Informé
              </h2>
              <div className="w-20 h-1 bg-gold mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Nous publions régulièrement des articles sur nos projets, nos découvertes technologiques
                et nos réflexions sur l'avenir de l'innovation. Suivez-nous pour ne rien manquer !
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-midnight dark:bg-white text-white dark:text-midnight font-semibold rounded-full hover:bg-gold hover:text-midnight dark:hover:bg-gold dark:hover:text-midnight transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Facebook className="w-5 h-5" />
                <span>Facebook</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-midnight dark:bg-white text-white dark:text-midnight font-semibold rounded-full hover:bg-gold hover:text-midnight dark:hover:bg-gold dark:hover:text-midnight transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter/CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Partagez Votre Expertise</h2>
          <div className="w-20 h-1 bg-gold mx-auto rounded-full mb-10"></div>
          <p className="text-xl text-gray-200 mb-10 leading-relaxed font-light max-w-2xl mx-auto">
            Vous avez une idée d'article ou souhaitez contribuer à notre blog ? 
            Nous sommes toujours à la recherche de nouvelles voix et perspectives !
          </p>
          <a
            href="/contact"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-midnight font-bold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>Proposer un article</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Blog;