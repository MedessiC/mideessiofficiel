import { ArrowLeft, Check, X, MessageCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { getOffreBySlug, offres } from '../data/offres';

const DetailOffre = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const offre = getOffreBySlug(slug || '');

  if (!offre) {
    return (
      <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <button
            onClick={() => navigate('/offres')}
            className="inline-flex items-center gap-2 text-gold font-bold mb-8 hover:gap-4 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux offres
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-midnight dark:text-white">Offre non trouvée</h1>
          </div>
        </div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const message = `Bonjour MIDEESSI, je suis intéressé par le Pack ${offre.nom} à ${offre.prix.toLocaleString('fr-FR')} FCFA/mois.`;
    const whatsappUrl = `https://wa.me/2290164409691?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title={`${offre.nom} - ${offre.description} | MIDEESSI`}
        description={`Découvrez le pack ${offre.nom} : ${offre.tagline}. ${offre.prix.toLocaleString('fr-FR')} FCFA/mois.`}
        keywords={[`pack ${offre.nom}`, 'offre', 'agence digitale', 'MIDEESSI']}
      />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <button
          onClick={() => navigate('/offres')}
          className="inline-flex items-center gap-2 text-gold font-bold text-sm sm:text-base hover:gap-4 transition-all"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Retour aux offres
        </button>
      </div>

      {/* Hero Image Section */}
      <section className="h-64 md:h-96 lg:h-[32rem] overflow-hidden relative bg-gradient-to-br from-blue-600 to-blue-900">
        <img
          src={offre?.image}
          alt={offre?.nom}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </section>

      {/* Info Section - Integrated with Hero */}
      <section className="relative -mt-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 mb-12 sm:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4">
                  {offre?.nom}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                  "{offre?.signification}" — {offre?.description}
                </p>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2">Prix mensuel</p>
                <div className="flex items-baseline gap-2 mb-6 sm:mb-8">
                  <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-gold">
                    {offre?.prix.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300">FCFA/mois</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>✓ Contrat minimum 3 mois</p>
                  <p>✓ Budget pub client</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Left Column - Features & What You Get */}
          <div className="lg:col-span-2 space-y-8 sm:space-y-12">
            {/* Ce que vous obtenez */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-6 sm:mb-8">
                Ce que vous obtenez concrètement
              </h2>
              <div className="space-y-4">
                {offre.whaYouGet.map((benefit, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Features List */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-8">
                Liste complète des fonctionnalités
              </h2>
              <div className="space-y-3">
                {offre.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    {feature.included ? (
                      <>
                        <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-800 dark:text-gray-200 text-lg">
                          {feature.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <X className="w-6 h-6 text-gray-300 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-400 dark:text-gray-500 text-lg line-through">
                          {feature.name}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pour qui ? */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-midnight dark:text-white mb-4">
                Pour qui ? 👥
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {offre.forWho}
              </p>
            </div>
          </div>

          {/* Right Column - Sticky CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gradient-to-br from-gold/10 to-yellow-100/10 dark:from-gold/20 dark:to-gold/10 rounded-2xl p-8 border-2 border-gold/30 dark:border-gold/20">
              {/* Price Summary */}
              <div className="mb-8 pb-8 border-b-2 border-gold/20">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Investment mensuel</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-gold">
                    {offre.prix.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">FCFA</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Minimum 3 mois — Sans engagement après
                </p>
              </div>

              {/* Main CTA - WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="w-full bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-midnight px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-4 active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                Choisir ce pack
              </button>

              {/* Additional Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Réponse dans 24h
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Consultation gratuite
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Pas de frais cachés
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison Link */}
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/offres')}
                className="text-gold font-bold hover:underline text-sm"
              >
                Comparer les autres packs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Important Note Section */}
      <section className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-gold py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl font-bold text-midnight dark:text-white mb-4">
            📌 Note importante
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed max-w-3xl">
            {offre.note}
            <br />
            <br />
            Le budget publicitaire (si applicable pour votre pack) reste à vos frais et est géré directement selon vos objectifs. Nous optimisons chaque dirham dépensé pour maximiser vos résultats.
          </p>
        </div>
      </section>

      {/* Other Offers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-12 text-center">
          Vous hésitez ? Explorez les autres packs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offres.filter(o => o.id !== offre.id).map((otherOffre) => (
            <button
              key={otherOffre.id}
              onClick={() => navigate(`/offres/${otherOffre.slug}`)}
              className="group bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 hover:border-gold dark:border-gray-700 dark:hover:border-gold transition-all duration-300 text-left"
            >
              <h3 className="text-2xl font-bold text-midnight dark:text-white group-hover:text-gold transition-colors mb-2">
                {otherOffre.nom}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm italic mb-4">
                "{otherOffre.signification}"
              </p>
              <p className="text-3xl font-bold text-gold mb-4">
                {otherOffre.prix.toLocaleString('fr-FR')}
                <span className="text-sm text-gray-600 dark:text-gray-400 font-normal">/mois</span>
              </p>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">
                {otherOffre.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-midnight to-blue-900 dark:from-gray-900 dark:to-gray-800 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt ? Passons à l'action ! 🚀
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Cliquez sur le bouton ci-dessous pour nous contacter via WhatsApp
          </p>
          <button
            onClick={handleWhatsApp}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-midnight px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
          >
            <MessageCircle className="w-6 h-6" />
            Choisir le Pack {offre.nom}
          </button>
        </div>
      </section>
    </div>
  );
};

export default DetailOffre;
