import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useClientAuth } from '../contexts/ClientContext';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const ClientOnboarding = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useClientAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Bienvenue sur MIDEESSI!',
      subtitle: `Nous sommes heureux de vous accueillir, ${user?.nom_marque || 'cher client'}`,
      description: 'Votre espace client est prêt. Découvrez les outils qui vous aideront à gérer votre présence digitale.',
      icon: '🎉',
    },
    {
      title: 'Complétez vos informations',
      subtitle: 'Aidez-nous à mieux vous connaître',
      description: 'Remplissez votre profil avec vos détails, vos accès sociaux et vos préférences de contenu.',
      icon: '📋',
    },
    {
      title: 'Suivez vos performances',
      subtitle: 'Des données claires chaque mois',
      description: 'Consultez en temps réel vos KPIs : publications, engagement, budget dépensé et plus.',
      icon: '📊',
    },
    {
      title: 'Planifiez votre calendrier',
      subtitle: 'Restez organisé',
      description: 'Découvrez le calendrier éditorial avec les contenus prévus pour votre marque.',
      icon: '📅',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = async () => {
    await completeOnboarding();
    navigate('/clients/dashboard');
  };

  if (!user) {
    return navigate('/clients');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-blue-900 to-indigo-900 dark:from-black dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <SEO
        title="Bienvenue | Espace Client MIDEESSI"
        description="Découvrez votre espace client MIDEESSI"
      />

      {/* Background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gold rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10"></div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Slide Container */}
        <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20 dark:border-gray-700/50 min-h-[500px] flex flex-col justify-between">
          {/* Content */}
          <div className="mb-8">
            {/* Icon */}
            <div className="text-6xl mb-6 text-center">{slides[currentSlide].icon}</div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-3">
              {slides[currentSlide].title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gold text-center font-semibold mb-6">
              {slides[currentSlide].subtitle}
            </p>

            {/* Description */}
            <p className="text-gray-300 text-center text-lg leading-relaxed">
              {slides[currentSlide].description}
            </p>

            {/* Additional Info for specific slides */}
            {currentSlide === 0 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gold/10 rounded-lg p-4 border border-gold/20">
                  <p className="text-sm text-gray-300">
                    <span className="text-gold font-semibold">Pack:</span> {user?.pack ? user.pack.toUpperCase() : 'N/A'}
                  </p>
                </div>
                <div className="bg-gold/10 rounded-lg p-4 border border-gold/20">
                  <p className="text-sm text-gray-300">
                    <span className="text-gold font-semibold">Client ID:</span> {user?.client_id || 'N/A'}
                  </p>
                </div>
                <div className="bg-gold/10 rounded-lg p-4 border border-gold/20">
                  <p className="text-sm text-gray-300">
                    <span className="text-gold font-semibold">Statut:</span>{' '}
                    <span className={user?.statut === 'actif' ? 'text-green-400' : 'text-orange-400'}>
                      {user?.statut ? user.statut.charAt(0).toUpperCase() + user.statut.slice(1) : 'N/A'}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'bg-gold w-8' : 'bg-gray-400 w-2'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Précédent</span>
            </button>

            <span className="text-gray-400 text-sm">
              {currentSlide + 1} / {slides.length}
            </span>

            {currentSlide < slides.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-yellow-400 hover:from-gold/90 hover:to-yellow-400/90 text-midnight font-semibold transition-all"
              >
                <span className="hidden sm:inline">Suivant</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-yellow-400 hover:from-gold/90 hover:to-yellow-400/90 text-midnight font-semibold transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="hidden sm:inline">C'est parti!</span>
              </button>
            )}
          </div>
        </div>

        {/* Skip Button */}
        <div className="text-center mt-6">
          <button
            onClick={handleComplete}
            className="text-gray-400 hover:text-white transition-colors text-sm underline"
          >
            Passer cette visite
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientOnboarding;
