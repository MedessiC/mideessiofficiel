import { ArrowRight, MapPin, Calendar, Users, Clock, AlertCircle, CheckCircle, Laptop, Globe, Sparkles, Award } from 'lucide-react';
import { Atelier, getDaysRemaining, isAtelierPassed, getCountdownStatus } from '../data/ateliers';

interface AtelierCardProps {
  atelier: Atelier;
  variant?: 'default' | 'compact';
}

const AtelierCard = ({ atelier, variant = 'default' }: AtelierCardProps) => {
  const availableSpots = atelier.capacity - atelier.registered;
  const isAlmostFull = availableSpots <= 5;
  const isFull = availableSpots <= 0;
  const daysRemaining = getDaysRemaining(atelier.date);
  const isPassed = isAtelierPassed(atelier.date);
  const countdownStatus = getCountdownStatus(atelier.date);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('fr-FR', { month: 'long', day: 'numeric' });
  };

  const getCountdownBadge = () => {
    if (isPassed) {
      return (
        <div className="bg-gray-500/90 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Atelier passé
        </div>
      );
    }
    
    if (countdownStatus === 'today') {
      return (
        <div className="bg-red-500/90 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 animate-pulse">
          <AlertCircle className="w-3 h-3" />
          Aujourd'hui!
        </div>
      );
    }
    
    if (countdownStatus === 'tomorrow') {
      return (
        <div className="bg-orange-500/90 text-white text-xs px-2 py-1 rounded-full font-bold">
          Demain
        </div>
      );
    }
    
    if (countdownStatus === 'soon') {
      return (
        <div className="bg-yellow-500/90 text-white text-xs px-2 py-1 rounded-full font-bold">
          {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}
        </div>
      );
    }
    
    return null;
  };

  if (variant === 'compact') {
    return (
      <a
        href={`/ateliers/${atelier.slug}`}
        className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="relative h-32 md:h-40 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img
            src={atelier.image}
            alt={atelier.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {getCountdownBadge()}
            {isAlmostFull && !isPassed && (
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Limitées
              </div>
            )}
          </div>
        </div>
        <div className="p-3 md:p-4">
          <p className="text-xs text-gold font-semibold uppercase tracking-wide mb-1">
            {atelier.category}
          </p>
          <h3 className="text-base md:text-lg font-bold text-midnight dark:text-white group-hover:text-gold transition-colors line-clamp-2 mb-2">
            {atelier.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(atelier.date)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {availableSpots > 0 ? availableSpots : 'Complet'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gold">{atelier.price.toLocaleString()} FCFA</span>
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-gold group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={`/ateliers/${atelier.slug}`}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-gray-100 dark:border-gray-700"
    >
      {/* Image Section with Enhanced Overlay */}
      <div className="relative h-28 sm:h-36 md:h-44 lg:h-56 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
        <img
          src={atelier.image}
          alt={atelier.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {/* Top Left - Category Badge */}
        <div className="absolute top-3 sm:top-4 md:top-6 lg:top-8 left-3 sm:left-4 md:left-6 lg:left-8">
          <div className="inline-flex items-center gap-1.5 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 bg-gold/95 backdrop-blur-sm rounded-full shadow-lg">
            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-midnight flex-shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-midnight uppercase tracking-wide">{atelier.category}</span>
          </div>
        </div>

        {/* Top Right - Badges Stack */}
        <div className="absolute top-3 sm:top-4 md:top-6 lg:top-8 right-3 sm:right-4 md:right-6 lg:right-8 flex flex-col gap-2">
          {/* Countdown Badge */}
          <div>
            {getCountdownBadge()}
          </div>

          {/* Level Badge */}
          <div
            className={`inline-flex items-center justify-center px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg backdrop-blur-sm ${
              atelier.level === 'Débutant'
                ? 'bg-green-500/95 text-white'
                : atelier.level === 'Intermédiaire'
                ? 'bg-blue-500/95 text-white'
                : 'bg-purple-500/95 text-white'
            }`}
          >
            {atelier.level}
          </div>

          {/* Limited Spots Badge */}
          {isAlmostFull && !isPassed && (
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 bg-red-500/95 text-white rounded-full text-xs sm:text-sm font-bold shadow-lg backdrop-blur-sm animate-pulse">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              Limité
            </div>
          )}
        </div>

        {/* Bottom Left - Instructor Info */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-6 left-3 sm:left-4 md:left-6 lg:left-8 flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gold/90 flex items-center justify-center text-midnight font-bold text-xs sm:text-sm shadow-lg">
            {atelier.instructor.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-300 line-clamp-1">Formateur</p>
            <p className="text-xs sm:text-sm font-bold text-white line-clamp-1">{atelier.instructor.name}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 md:p-5 lg:p-7">
        {/* Language & Meta Info */}
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-gold/15 text-gold dark:bg-gold/25 text-xs sm:text-sm font-semibold">
            <Laptop className="w-3 h-3" />
            {atelier.language}
          </span>
          <span className={`text-xs sm:text-sm font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${
            atelier.isOnline 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
          }`}>
            {atelier.isOnline ? 'En ligne' : 'Présentiel'}
          </span>
        </div>

        {/* Title - Enhanced Typography */}
        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-midnight dark:text-white mb-2 sm:mb-2.5 md:mb-3 lg:mb-4 group-hover:text-gold transition-colors duration-300 line-clamp-2 leading-tight">
          {atelier.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-3 md:mb-4 lg:mb-5 line-clamp-2 leading-relaxed">
          {atelier.description}
        </p>

        {/* Details Grid - Enhanced */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 mb-4 md:mb-5 lg:mb-6 pb-3 sm:pb-4 md:pb-5 lg:pb-6 border-b border-gray-200 dark:border-gray-700/50">
          {/* Date */}
          <div className="flex items-start gap-1.5 sm:gap-2">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gold flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Date</p>
              <p className="text-xs sm:text-sm md:text-base font-bold text-midnight dark:text-white">
                {formatDate(atelier.date)}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-start gap-1.5 sm:gap-2">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gold flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Durée</p>
              <p className="text-xs sm:text-sm md:text-base font-bold text-midnight dark:text-white">
                {atelier.duration}
                min
              </p>
            </div>
          </div>

          {/* Location Type */}
          <div className="flex items-start gap-1.5 sm:gap-2">
            {atelier.isOnline ? (
              <>
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gold flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Format</p>
                  <p className="text-xs sm:text-sm md:text-base font-bold text-midnight dark:text-white">
                    Distanciel
                  </p>
                </div>
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gold flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Lieu</p>
                  <p className="text-xs sm:text-sm md:text-base font-bold text-midnight dark:text-white">
                    Sur place
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Available Spots */}
          <div className="flex items-start gap-1.5 sm:gap-2">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gold flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Places</p>
              <p className={`text-xs sm:text-sm md:text-base font-bold ${
                isFull ? 'text-red-500 font-bold' : 'text-midnight dark:text-white'
              }`}>
                {availableSpots > 0 ? availableSpots : 'Complet'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer - Price and CTA */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex flex-col">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">À partir de</p>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gold">
              {Math.round(atelier.price / 1000)}
              k FCFA
            </p>
          </div>
          <button className="flex-1 bg-gradient-to-r from-gold to-yellow-400 hover:from-gold hover:to-yellow-500 text-midnight font-bold py-2 sm:py-2.5 md:py-3 lg:py-3.5 px-3 sm:px-4 md:px-5 lg:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl">
            S'inscrire
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </a>
  );
};

export default AtelierCard;
