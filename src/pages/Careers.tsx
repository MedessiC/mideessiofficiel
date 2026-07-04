import { ArrowRight, Heart, BookOpen, Brain, Sparkles, Briefcase, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import { getRecruitmentOffers, syncRecruitmentOffers, type RecruitmentOffer } from '../lib/contentManagement';

const Careers = () => {
  const [offers, setOffers] = useState(getRecruitmentOffers());
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const loadOffers = async () => {
      setOffers(await syncRecruitmentOffers());
    };

    void loadOffers();

    const handler = async () => {
      setOffers(await syncRecruitmentOffers());
    };

    window.addEventListener('mideessi-content-updated', handler);
    return () => window.removeEventListener('mideessi-content-updated', handler);
  }, []);


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
                <Sparkles className="w-5 h-5 text-gold" />
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
                icon: <Sparkles className="w-8 h-8" />,
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

      <section className="py-12 md:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-midnight dark:text-white">Offres ouvertes</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">Des postes passionnants pour rejoindre l’aventure MIDEESSI.</p>
          </div>

          {feedback && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {feedback}
            </div>
          )}

          {offers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <p className="text-lg text-gray-600 dark:text-gray-300">Aucune offre de recrutement pour le moment.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {offers.map((offer) => (
                <div key={offer.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <div className="flex items-center gap-2 text-gold">
                    <Briefcase className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-[0.2em]">{offer.type}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-midnight dark:text-white">{offer.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{offer.role}</p>
                  {offer.imageUrl && (
                    <img src={offer.imageUrl} alt={offer.title} className="mt-4 h-40 w-full rounded-2xl object-cover" />
                  )}
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    {offer.location}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{offer.description}</p>
                  <div className="mt-5">
                    <h4 className="text-sm font-semibold text-midnight dark:text-white">Exigences</h4>
                    <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      {offer.requirements.map((requirement) => (
                        <li key={requirement} className="flex gap-2"><span className="text-gold">•</span>{requirement}</li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    to={`/careers/apply/${offer.slug || offer.id}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-midnight px-4 py-2 text-sm font-semibold text-white"
                  >
                    Postuler <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Careers;
