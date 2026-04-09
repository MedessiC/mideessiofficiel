import { ArrowRight, Heart, BookOpen, Brain, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Careers = () => {

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title="Carrières chez MIDEESSI | Rejoignez notre équipe"
        description="Explorez les opportunités de carrière chez MIDEESSI. Rejoignez une équipe passionnée de développeurs, designers et entrepreneurs en Afrique."
        keywords={['carrière', 'emploi', 'recrutement', 'MIDEESSI', 'Bénin', 'développeur', 'designer']}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-12 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-5 md:top-20 md:right-10 w-40 h-40 md:w-72 md:h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-5 md:bottom-20 md:left-10 w-48 h-48 md:w-96 md:h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 tracking-tight">
              Rejoignez <span className="text-gold">MIDEESSI</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed px-2 mb-8">
              Soyez part d'une équipe passionnée qui crée des solutions digitales innovantes pour l'Afrique.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Heart className="w-5 h-5 text-gold" />
                <span>Passion</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Brain className="w-5 h-5 text-gold" />
                <span>Innovation</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Zap className="w-5 h-5 text-gold" />
                <span>Impact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-4">
              Pourquoi nous rejoindre ?
            </h2>
            <div className="w-12 sm:w-16 md:w-20 h-1 bg-gold rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: 'Apprentissage Continu',
                description: 'Formation, certifications et mentorat. Grandissez avec nous.',
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Culture Inclusive',
                description: 'Diversité, respect et collaboration. Tous sont bienvenues.',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Projets Innovants',
                description: 'Travaillez sur des solutions qui changent l\'Afrique.',
              },
            ].map((value, idx) => (
              <div 
                key={idx}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                  <div className="text-gold">{value.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-midnight dark:text-white mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No Recruitment Section */}
      <section className="py-12 md:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800 flex items-center justify-center min-h-[600px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            {/* Image */}
            <div className="mb-8 md:mb-12 flex justify-center">
              <img 
                src="/404-image.webp" 
                alt="Aucune offre disponible" 
                className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto object-contain rounded-2xl"
              />
            </div>

            {/* Message */}
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-midnight dark:text-white">
                Pas de recrutement pour l'instant
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Nous ne recrutons pas actuellement, mais nous reviendrons bientôt avec des opportunités passionnantes !
              </p>

              <div className="pt-6 md:pt-8">
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
                  Revenez nous voir plus tard pour découvrir nos offres 😊
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-yellow-500 text-midnight font-bold px-6 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base"
                >
                  <span>Retour à l'accueil</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Careers;
