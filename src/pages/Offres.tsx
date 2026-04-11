import { ArrowRight, Globe, ShoppingCart, Smartphone, Code, PackageOpen, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { offres } from '../data/offres';
import { devServices } from '../data/devServices';
import PopupDisplay from '../components/PopupDisplay';

type CategoryType = 'presence' | 'tech';

const Offres = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('presence');

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR');
  };

  const handleWhatsAppDevis = (serviceName: string) => {
    const message = `Bonjour MIDEESSI, je suis intéressé par un devis pour: ${serviceName}`;
    const whatsappUrl = `https://wa.me/2290164409691?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWhatsAppHelp = () => {
    const message = `Bonjour MIDEESSI, je ne sais pas trop quoi choisir. Pouvez-vous m'aider?`;
    const whatsappUrl = `https://wa.me/2290164409691?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      Globe: <Globe className="w-8 h-8" />,
      ShoppingCart: <ShoppingCart className="w-8 h-8" />,
      Smartphone: <Smartphone className="w-8 h-8" />,
      Code: <Code className="w-8 h-8" />,
      PackageOpen: <PackageOpen className="w-8 h-8" />
    };
    return iconMap[iconName];
  };

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title="Nos Offres | MIDEESSI - Agence Digitale"
        description="Services digitaux : Présence Digitale (réseaux sociaux, contenu) et Développement Tech (sites, apps, e-commerce). Solutions adaptées à votre business."
        keywords={['offres', 'packs', 'services digitaux', 'agence digitale', 'MIDEESSI', 'développement']}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-5 md:top-20 md:right-10 w-40 h-40 md:w-72 md:h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-5 md:bottom-20 md:left-10 w-48 h-48 md:w-96 md:h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 text-center tracking-tight leading-tight">
            Nos <span className="text-gold">Offres</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-2xl text-center text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
            Deux approches pour transformer votre business. Trouvez la solution qui vous correspond.
          </p>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Selector */}
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-8 text-center">
              Qu'est-ce qu'il vous faut ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Présence Digitale */}
              <button
                onClick={() => setActiveCategory('presence')}
                className={`group relative overflow-hidden rounded-2xl p-8 md:p-10 transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === 'presence'
                    ? 'bg-gradient-to-br from-gold to-yellow-400 text-midnight shadow-2xl ring-2 ring-gold'
                    : 'bg-white dark:bg-gray-800 text-midnight dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-gold'
                }`}
              >
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">Présence Digitale</h3>
                  <p className={`text-base md:text-lg font-light leading-relaxed ${
                    activeCategory === 'presence' ? 'text-midnight/80' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Pour les entreprises qui veulent exister et grandir en ligne. Gestion des réseaux sociaux, contenu, campagnes.
                  </p>
                </div>
                {activeCategory === 'presence' && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                )}
              </button>

              {/* Développement Tech */}
              <button
                onClick={() => setActiveCategory('tech')}
                className={`group relative overflow-hidden rounded-2xl p-8 md:p-10 transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === 'tech'
                    ? 'bg-gradient-to-br from-midnight to-blue-900 text-white shadow-2xl ring-2 ring-gold'
                    : 'bg-white dark:bg-gray-800 text-midnight dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-gold'
                }`}
              >
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">Développement Tech</h3>
                  <p className={`text-base md:text-lg font-light leading-relaxed ${
                    activeCategory === 'tech' ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Pour les entreprises qui ont besoin d'un outil numérique sur mesure. Sites, apps, solutions custom.
                  </p>
                </div>
                {activeCategory === 'tech' && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                )}
              </button>
            </div>
          </div>

          {/* Présence Digitale Content */}
          {activeCategory === 'presence' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-2xl md:text-3xl font-bold text-midnight dark:text-white mb-12 text-center">
                Nos 3 packs clé en main
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-sm md:text-base">
                Les packs s'empilent : chaque niveau inclut tout du précédent + plus. Plus besoin d'hériter d'un vieux pack.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {offres.map((offre) => (
                  <div key={offre.id} className="group relative">
                    {offre.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <div className="bg-gradient-to-r from-gold to-yellow-400 text-midnight px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                          ⭐ {offre.badge}
                        </div>
                      </div>
                    )}

                    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col ${
                      offre.badge ? 'ring-2 ring-gold md:scale-105' : ''
                    }`}>
                      <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
                        <img
                          src={offre.image}
                          alt={offre.nom}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="px-6 md:px-8 py-8 md:py-10 flex flex-col flex-grow">
                        <div className="mb-4 sm:mb-6">
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-1">
                            {offre.nom}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 italic">
                            "{offre.signification}"
                          </p>
                        </div>

                        <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">
                          {offre.tagline}
                        </p>

                        <div className="mb-6 sm:mb-8">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gold">
                              {formatPrice(offre.prix)}
                            </span>
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">FCFA/mois</span>
                          </div>
                        </div>

                        <div className="mb-6 sm:mb-8 space-y-1.5 sm:space-y-2">
                          {offre.features.slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                {feature.name}
                              </span>
                            </div>
                          ))}
                        </div>

                        <Link
                          to={`/offres/${offre.slug}`}
                          className={`group/btn w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 mt-auto ${
                            offre.badge
                              ? 'bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-midnight shadow-lg hover:shadow-xl'
                              : 'bg-midnight dark:bg-gray-700 text-white hover:bg-blue-900 dark:hover:bg-gray-600 border-2 border-gold/30 hover:border-gold'
                          }`}
                        >
                          <span>Voir les détails</span>
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'tech' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-2xl md:text-3xl font-bold text-midnight dark:text-white mb-12 text-center">
                Services de développement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {devServices.map((service) => (
                  <div key={service.id} className="group relative">
                    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col`}>
                      <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
                        <img
                          src={service.image}
                          alt={service.nom}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4 w-12 h-12 md:w-14 md:h-14 bg-white/95 dark:bg-gray-900/95 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-sm">
                          <div className="text-gold">
                            {getIcon(service.icon)}
                          </div>
                        </div>
                      </div>

                      <div className="px-6 md:px-8 py-6 md:py-8 flex flex-col flex-grow">
                        <h3 className="text-xl md:text-2xl font-bold text-midnight dark:text-white mb-2">
                          {service.nom}
                        </h3>

                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-5 md:mb-6 flex-grow leading-relaxed">
                          {service.description}
                        </p>

                        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 space-y-3">
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Délai estimé</p>
                            <p className="text-base md:text-lg font-bold text-gold">
                              {service.delai}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">À partir de</p>
                            <p className="text-base md:text-lg font-bold text-midnight dark:text-white">
                              {formatPrice(service.prixDebut)} FCFA
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Link
                            to={`/dev-services/${service.slug}`}
                            className="w-full bg-midnight dark:bg-gray-700 text-white hover:bg-blue-900 dark:hover:bg-gray-600 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 border-2 border-gold/30 hover:border-gold group-hover:border-gold"
                          >
                            <span>Voir les détails</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                          <button
                            onClick={() => handleWhatsAppDevis(service.nom)}
                            className="w-full bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-midnight py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-md hover:shadow-lg"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Devis
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gold/5 to-yellow-100/5 dark:from-gold/10 dark:to-blue-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-midnight dark:text-white text-center mb-12">
            💼 Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
            {[
              { step: 1, title: 'Consultation', desc: 'On écoute vos besoins, vos objectifs, votre budget' },
              { step: 2, title: 'Proposition', desc: 'On vous recommande la solution idéale avec devis' },
              { step: 3, title: 'Mise en œuvre', desc: 'Notre équipe exécute en sprints agiles' },
              { step: 4, title: 'Suivi', desc: 'Support continu, rapports, optimisation' }
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border-2 border-gold/30 hover:border-gold transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center text-midnight font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-midnight dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
                {item.step < 4 && (
                  <div className="hidden md:flex absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-1 bg-gold/50"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-midnight via-blue-900 to-midnight dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl p-8 md:p-12 lg:p-16 text-white text-center shadow-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              Vous ne savez pas quoi choisir ?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 md:mb-8 max-w-2xl mx-auto">
              Aucun problème. Notre équipe vous aide à identifier la meilleure solution pour votre situation. Contactez-nous directement sur WhatsApp.
            </p>
            <button
              onClick={handleWhatsAppHelp}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-midnight px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Discuter sur WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-midnight to-blue-900 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Prêt à transformer votre présence digitale ?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-6 sm:mb-8">
            Explorez les détails de chaque offre ou service et trouvez la solution adaptée à vos besoins.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-midnight px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Nous contacter
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>

      <PopupDisplay currentPage="offres" />
    </div>
  );
};

export default Offres;
