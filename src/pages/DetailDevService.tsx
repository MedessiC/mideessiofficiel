import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, Globe, ShoppingCart, Smartphone, Code, PackageOpen, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { devServices } from '../data/devServices';

const DetailDevService = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = devServices.find(s => s.slug === slug);
  const [showProcessModal, setShowProcessModal] = useState(false);

  if (!service) {
    return <Navigate to="/offres" />;
  }

  const handleWhatsAppDevis = () => {
    const message = `Bonjour MIDEESSI, je suis intéressé par: ${service.nom}. J'aimerais en savoir plus et avoir un devis détaillé.`;
    const whatsappUrl = `https://wa.me/2290164409691?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      Globe: <Globe className="w-12 h-12" />,
      ShoppingCart: <ShoppingCart className="w-12 h-12" />,
      Smartphone: <Smartphone className="w-12 h-12" />,
      Code: <Code className="w-12 h-12" />,
      PackageOpen: <PackageOpen className="w-12 h-12" />
    };
    return iconMap[iconName];
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR');
  };

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title={`${service.nom} | MIDEESSI - Agence Digitale`}
        description={service.fullDescription}
        keywords={['développement', service.nom.toLowerCase(), 'MIDEESSI']}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-5 md:top-20 md:right-10 w-40 h-40 md:w-72 md:h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-5 md:bottom-20 md:left-10 w-48 h-48 md:w-96 md:h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/offres"
            className="inline-flex items-center gap-2 text-gold hover:text-yellow-400 mb-6 text-sm sm:text-base transition-colors"
          >
            ← Retour aux offres
          </Link>

          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gold/20 rounded-2xl flex items-center justify-center flex-shrink-0 text-gold">
              {getIcon(service.icon)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 tracking-tight leading-tight">
                {service.nom}
              </h1>
            </div>
          </div>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-3xl font-light leading-relaxed">
            {service.fullDescription}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Key Info Box */}
            <div className="lg:sticky lg:top-24 h-fit space-y-6">
              {/* Prix */}
              <div className="bg-gradient-to-br from-gold/10 to-yellow-100 dark:from-gold/20 dark:to-blue-900/20 rounded-2xl p-6 md:p-8 border-2 border-gold/30">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">À partir de</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl md:text-5xl font-bold text-gold">
                    {formatPrice(service.prixDebut)}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">FCFA</span>
                </div>
                <button
                  onClick={handleWhatsAppDevis}
                  className="w-full bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-midnight py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl mb-3"
                >
                  Demander un devis
                </button>
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  Prix adapté selon vos besoins spécifiques
                </p>
              </div>

              {/* Délai */}
              <div className="bg-midnight/5 dark:bg-white/5 rounded-2xl p-6 border-2 border-midnight/10 dark:border-white/10">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Délai de livraison</p>
                <p className="text-2xl font-bold text-midnight dark:text-white">
                  {service.delai}
                </p>
              </div>

              {/* Pour qui */}
              <div className="bg-midnight/5 dark:bg-white/5 rounded-2xl p-6 border-2 border-midnight/10 dark:border-white/10">
                <p className="text-sm font-bold text-midnight dark:text-white mb-3">Idéal pour</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {service.pourQui}
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Features */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-midnight dark:text-white mb-8">
                  Ce qui est inclus
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-4 rounded-lg ${
                        feature.included
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                          : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {feature.included ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0 mt-0.5"></div>
                      )}
                      <span className={`text-sm ${
                        feature.included
                          ? 'text-gray-800 dark:text-gray-200 font-medium'
                          : 'text-gray-500 dark:text-gray-400 line-through'
                      }`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Processus */}
              <div>
                <button
                  onClick={() => setShowProcessModal(true)}
                  className="inline-flex items-center gap-2 text-lg font-bold text-midnight dark:text-white hover:text-gold transition-colors mb-6 group"
                >
                  <h2>Comment ça marche ? (notre processus)</h2>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="space-y-4">
                  {service.processus.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center">
                        <span className="font-bold text-midnight text-sm">{idx + 1}</span>
                      </div>
                      <div className="pt-1">
                        <p className="text-gray-800 dark:text-gray-200 font-medium">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bonus */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 md:p-8 border-2 border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-bold text-midnight dark:text-white mb-6">
                  🎁 Bonus inclus
                </h3>
                <ul className="space-y-3">
                  {service.bonus.map((bonus, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0"></div>
                      <span className="text-gray-800 dark:text-gray-200">{bonus}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-midnight to-blue-900 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt à démarrer ?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Nous vous aiderons à transformer votre vision en réalité. Contactez-nous pour un devis personnalisé.
            </p>
            <button
              onClick={handleWhatsAppDevis}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-midnight px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <MessageCircle className="w-6 h-6" />
              Discuter sur WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Process Modal */}
      {showProcessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 md:p-8 sticky top-0 bg-gradient-to-r from-midnight to-blue-900 text-white rounded-t-2xl flex items-center justify-between">
              <h3 className="text-2xl font-bold">Notre processus</h3>
              <button
                onClick={() => setShowProcessModal(false)}
                className="text-2xl hover:text-gold transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              {service.processus.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/20 border-3 border-gold flex items-center justify-center">
                    <span className="font-bold text-midnight text-lg">{idx + 1}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-lg font-bold text-midnight dark:text-white mb-2">{step}</p>
                    <div className="h-1 w-20 bg-gold/30 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailDevService;
