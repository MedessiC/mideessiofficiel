import BlogCard from '../components/BlogCard';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';
import { Rss, BookOpen, Lightbulb, Zap, Rocket, ArrowRight, Mail } from 'lucide-react';
import { getIcon } from '../utils/iconMapper';

const Blog = () => {
  const topics = [
    { name: 'Intelligence Artificielle', icon: 'Lightbulb' },
    { name: 'Automatisation', icon: 'Zap' },
    { name: 'Innovation', icon: 'Rocket' },
    { name: 'Développement', icon: 'Code' },
  ];

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title="Blog MIDEESSI | Actualités technologiques et innovation"
        description="Suivez les dernières actualités de MIDEESSI, nos réflexions sur l'IA, l'automatisation et l'innovation technologique en Afrique."
        keywords={['blog', 'actualités', 'IA', 'automatisation', 'technologie', 'innovation', 'MIDEESSI']}
      />
      
      {/* Hero Section - Responsive */}
      <section className="relative bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-12 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-5 md:top-20 md:right-10 w-40 h-40 md:w-72 md:h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-5 md:bottom-20 md:left-10 w-48 h-48 md:w-96 md:h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 lg:mb-8 tracking-tight leading-tight">
              Blog & <span className="text-gold">Actualités</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed px-2">
              Découvrez nos dernières réflexions sur la technologie, l'innovation et l'avenir de l'automatisation en Afrique.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section - Responsive Grid */}
      <section className="py-8 md:py-12 lg:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogPosts.length > 0 ? (
            <>
              <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-midnight dark:text-white mb-3 sm:mb-4 md:mb-6">
                  Articles Récents
                </h2>
                <div className="w-12 sm:w-16 md:w-20 h-1 bg-gold mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
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
            <div className="text-center py-8 sm:py-12 md:py-16 lg:py-20">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gold/10 rounded-full mb-3 sm:mb-4 md:mb-6 lg:mb-8">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-gold" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-midnight dark:text-white mb-2 sm:mb-3 md:mb-4 lg:mb-5">
                Bientôt Disponible
              </h3>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto px-2 leading-relaxed">
                Nous préparons du contenu exclusif pour vous. Restez connectés pour découvrir nos premiers articles !
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories/Topics Section - Responsive */}
      <section className="py-8 md:py-12 lg:py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-midnight dark:text-white mb-3 sm:mb-4 md:mb-6">
              Nos Thématiques
            </h2>
            <div className="w-12 sm:w-16 md:w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {topics.map((topic) => {
              const Icon = getIcon(topic.icon);
              return (
                <div 
                  key={topic.name}
                  className="group bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 hover:border-gold"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gold/20 transition-colors">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gold" />
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-midnight dark:text-white text-center group-hover:text-gold transition-colors leading-tight">
                      {topic.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stay Connected Section - Responsive */}
      <section className="py-8 md:py-12 lg:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl md:rounded-2xl lg:rounded-3xl shadow-xl p-6 md:p-8 lg:p-12 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-midnight dark:text-white mb-3 sm:mb-4 md:mb-6">
                Restez Informé
              </h2>
              <div className="w-12 sm:w-16 md:w-20 h-1 bg-gold mx-auto rounded-full mb-4 sm:mb-5 md:mb-6 lg:mb-8"></div>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-2">
                Nous publions régulièrement des articles sur nos projets, nos découvertes technologiques
                et nos réflexions sur l'avenir de l'innovation. Suivez-nous pour ne rien manquer !
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 lg:py-4 bg-midnight dark:bg-white text-white dark:text-midnight font-bold rounded-lg md:rounded-xl hover:bg-gold hover:text-midnight dark:hover:bg-gold dark:hover:text-midnight transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm md:text-base"
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span>Facebook</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 lg:py-4 bg-midnight dark:bg-white text-white dark:text-midnight font-bold rounded-lg md:rounded-xl hover:bg-gold hover:text-midnight dark:hover:bg-gold dark:hover:text-midnight transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm md:text-base"
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter/CTA Section - Responsive */}
      <section className="relative py-12 md:py-16 lg:py-24 bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-96 md:h-96 bg-gold rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 lg:mb-8">Partagez Votre Expertise</h2>
          <div className="w-12 sm:w-16 md:w-20 h-1 bg-gold mx-auto rounded-full mb-4 sm:mb-6 md:mb-8 lg:mb-10"></div>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-200 mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-relaxed font-light max-w-2xl mx-auto px-2">
            Vous avez une idée d'article ou souhaitez contribuer à notre blog ? 
            Nous sommes toujours à la recherche de nouvelles voix et perspectives !
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-gold hover:bg-yellow-500 text-midnight font-bold px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-xs sm:text-sm md:text-base lg:text-lg"
          >
            <span>Proposer un article</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Blog;