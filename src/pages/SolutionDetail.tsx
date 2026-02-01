import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, CheckCircle, Mail, MessageCircle, Users, Award,
  Zap, ArrowRight, Briefcase, Code
} from 'lucide-react';
import SEO from '../components/SEO';
import { getSolutionBySlug, Solution } from '../data/solutions';
import { getIcon } from '../utils/iconMapper';

const SolutionDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [solution, setSolution] = useState<Solution | null>(null);
  const [activeTab, setActiveTab] = useState<'features' | 'benefits' | 'contact'>('features');

  useEffect(() => {
    const foundSolution = getSolutionBySlug(slug || '');
    if (foundSolution) {
      setSolution(foundSolution);
    } else {
      navigate('/solutions');
    }
  }, [slug, navigate]);

  if (!solution) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">Chargement...</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'En cours':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'En développement':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title={`${solution.name} | MIDEESSI - Solutions Technologiques`}
        description={solution.description}
        keywords={[solution.name, 'solution', 'MIDEESSI', ...solution.technologies]}
      />

      {/* Hero Section - Responsive */}
      <section className="relative py-12 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={solution.image}
            alt={solution.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="/solutions"
            className="inline-flex items-center gap-2 text-white hover:text-gold transition-colors mb-6 md:mb-8 text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux solutions
          </a>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-end">
            <div className="min-w-0">
              <div className="flex flex-col md:flex-row md:items-start md:gap-4 mb-4 md:mb-6 gap-3">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight break-words">
                  {solution.name}
                </h1>
                <span className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap flex-shrink-0 ${getStatusColor(solution.status)}`}>
                  {solution.status}
                </span>
              </div>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-4 md:mb-6 font-semibold">{solution.tagline}</p>
              <p className="text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed max-w-xl">
                {solution.longDescription}
              </p>
            </div>

            {/* Quick Stats - Responsive Grid */}
            {solution.stats && (
              <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6 lg:mt-0">
                {solution.stats.map((stat, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md rounded-lg p-4 md:p-6 border border-white/20">
                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gold mb-1 md:mb-2 break-words">{stat.value}</div>
                    <div className="text-xs md:text-sm text-gray-200 line-clamp-2">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content - Responsive */}
      <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs - Mobile Friendly */}
          <div className="flex gap-2 md:gap-4 mb-8 md:mb-12 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {(['features', 'benefits', 'contact'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 md:py-4 px-3 md:px-6 font-semibold transition-all border-b-2 whitespace-nowrap text-sm md:text-base ${
                  activeTab === tab
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-midnight dark:hover:text-white'
                }`}
              >
                {tab === 'features' && (
                  <>
                    <Zap className="w-4 h-4 inline mr-1 md:mr-2" />
                    <span>Fonctionnalités</span>
                  </>
                )}
                {tab === 'benefits' && (
                  <>
                    <Award className="w-4 h-4 inline mr-1 md:mr-2" />
                    <span>Avantages</span>
                  </>
                )}
                {tab === 'contact' && (
                  <>
                    <Mail className="w-4 h-4 inline mr-1 md:mr-2" />
                    <span>Contact</span>
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Features Tab - Responsive Grid */}
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {solution.features.map((feature) => {
                const FeatureIcon = getIcon(feature.iconName);
                return (
                  <div
                    key={feature.id}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FeatureIcon className="w-12 h-12 md:w-14 md:h-14 text-gold" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-midnight dark:text-white mb-2 md:mb-3 group-hover:text-gold transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Benefits Tab - Responsive */}
          {activeTab === 'benefits' && (
            <div className="space-y-3 md:space-y-4">
              {solution.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-900 rounded-lg p-4 md:p-6 flex items-start gap-3 md:gap-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-gold flex-shrink-0 mt-0.5 md:mt-1" />
                  <p className="text-sm md:text-lg text-gray-700 dark:text-gray-300">{benefit}</p>
                </div>
              ))}
            </div>
          )}

          {/* Contact Tab - Responsive */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-midnight dark:text-white mb-6">
                    Comment nous joindre ?
                  </h3>

                  {/* Email */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                      <h4 className="font-bold text-midnight dark:text-white text-sm md:text-base">Email</h4>
                    </div>
                    <a
                      href={`mailto:${solution.contact.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline ml-8 text-sm md:text-base break-all"
                    >
                      {solution.contact.email}
                    </a>
                  </div>

                  {/* WhatsApp */}
                  {solution.contact.whatsapp && (
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <MessageCircle className="w-5 h-5 text-gold flex-shrink-0" />
                        <h4 className="font-bold text-midnight dark:text-white text-sm md:text-base">WhatsApp</h4>
                      </div>
                      <a
                        href={`https://wa.me/${solution.contact.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline ml-8 flex items-center gap-2 text-sm md:text-base break-all"
                      >
                        {solution.contact.whatsapp}
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Website CTA - Responsive */}
              <div className="bg-gradient-to-br from-gold to-yellow-500 rounded-2xl p-6 md:p-8 text-midnight flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">En savoir plus</h3>
                  <p className="text-base md:text-lg leading-relaxed mb-6">
                    Visitez le site officiel de {solution.name} pour accéder à la plateforme complète et vous inscrire.
                  </p>
                </div>
                <a
                  href={solution.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-midnight hover:bg-gray-900 text-gold font-bold px-4 md:px-6 py-2.5 md:py-3 rounded-lg transition-colors text-sm md:text-base"
                >
                  Accéder à {solution.name}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Technologies Section - Responsive */}
      <section className="py-12 md:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-midnight dark:text-white mb-4 flex items-center justify-center gap-2">
              <Code className="w-6 h-6 md:w-8 md:h-8 text-gold" />
              Technologies Utilisées
            </h2>
            <div className="w-16 md:w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {solution.technologies.map((tech) => (
              <div
                key={tech}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center justify-center text-center"
              >
                <span className="font-semibold text-midnight dark:text-white text-xs md:text-sm break-words">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience - Responsive */}
      <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-midnight dark:text-white mb-4 flex items-center justify-center gap-2">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-gold" />
              À Qui S'adresse {solution.name} ?
            </h2>
            <div className="w-16 md:w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {solution.targetAudience.map((audience, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 rounded-xl p-4 md:p-6 flex items-center gap-3 md:gap-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                </div>
                <span className="text-base md:text-lg font-semibold text-midnight dark:text-white">{audience}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Responsive */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Prêt à Commencer ?</h2>
          <div className="w-16 md:w-20 h-1 bg-gold mx-auto rounded-full mb-6 md:mb-8"></div>
          <p className="text-base md:text-lg lg:text-xl text-gray-200 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            {solution.name} est conçue pour transformer votre manière de travailler. Découvrez comment
            rejoindre des milliers d'utilisateurs satisfaits à travers le continent.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <a
              href={solution.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold hover:bg-yellow-500 text-midnight font-bold px-6 md:px-8 py-2.5 md:py-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
            >
              Accéder à la Plateforme
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </a>
            <a
              href={`mailto:${solution.contact.email}`}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-6 md:px-8 py-2.5 md:py-4 rounded-lg transition-colors border border-white/40 text-sm md:text-base"
            >
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
              Nous Contacter
            </a>
          </div>
        </div>
      </section>

      {/* Related Solutions */}
      <section className="py-12 md:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-midnight dark:text-white mb-4">
            Autres Solutions
          </h2>
          <div className="w-16 md:w-20 h-1 bg-gold mx-auto rounded-full mb-8 md:mb-12"></div>

          <div className="text-center">
            <a
              href="/solutions"
              className="inline-flex items-center gap-2 bg-gold hover:bg-yellow-500 text-midnight font-bold px-6 md:px-8 py-2.5 md:py-3 rounded-lg transition-all duration-300 text-sm md:text-base"
            >
              Découvrir Toutes les Solutions
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolutionDetail;
