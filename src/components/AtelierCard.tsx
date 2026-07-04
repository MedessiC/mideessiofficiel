import { ArrowRight, MapPin, Calendar, Users, Clock, AlertCircle, Laptop, Globe, Bookmark, Award } from 'lucide-react';
import { Atelier } from '../lib/supabase';
import { getDaysRemaining, isAtelierPassed, getCountdownStatus } from '../data/ateliers';

interface AtelierCardProps {
  atelier: Atelier;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  isRegistered?: boolean;
}

const AtelierCard = ({ atelier, isBookmarked = false, onBookmarkToggle, isRegistered = false }: AtelierCardProps) => {
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
        <div className="bg-gray-500/90 text-white text-xs px-2.5 py-1 rounded-lg font-bold">
          Terminé
        </div>
      );
    }
    
    if (countdownStatus === 'today') {
      return (
        <div className="bg-red-500/90 text-white text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 animate-pulse">
          <AlertCircle className="w-3.5 h-3.5" />
          Aujourd'hui
        </div>
      );
    }
    
    if (countdownStatus === 'tomorrow') {
      return (
        <div className="bg-orange-500/90 text-white text-xs px-2.5 py-1 rounded-lg font-bold">
          Demain
        </div>
      );
    }
    
    if (countdownStatus === 'soon') {
      return (
        <div className="bg-gold/90 text-midnight text-xs px-2.5 py-1 rounded-lg font-bold">
          J-{daysRemaining}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 border border-gray-100 dark:border-gray-700 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
        <img
          src={atelier.image}
          alt={atelier.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Top Badges Stack */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {getCountdownBadge()}
          {isRegistered && (
            <span className="bg-green-600 text-white text-xs px-2.5 py-1 rounded-lg font-bold">
              Inscrit
            </span>
          )}
          {isAlmostFull && !isPassed && !isFull && (
            <div className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-lg font-bold">
              Limitées
            </div>
          )}
        </div>

        {/* Bookmark Action */}
        {onBookmarkToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBookmarkToggle();
            }}
            className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:text-gold transition-colors z-10"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-gold text-gold' : ''}`} />
          </button>
        )}

        {/* Category tag */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 bg-gold text-midnight text-[10px] font-black uppercase tracking-wider rounded-lg">
            {atelier.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Header meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2.5">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gold" />
            {formatDate(atelier.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gold" />
            {atelier.duration} min
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-midnight dark:text-white mb-2 leading-snug group-hover:text-gold transition-colors line-clamp-2">
          {atelier.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed flex-grow">
          {atelier.description}
        </p>

        {/* Additional meta details */}
        <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 mb-4">
          <div className="text-left">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Format</p>
            <p className="text-xs font-semibold text-midnight dark:text-white truncate">
              {atelier.is_online ? 'En ligne' : 'Présentiel'}
            </p>
          </div>
          <div className="text-left">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Places restantes</p>
            <p className={`text-xs font-semibold ${isFull ? 'text-red-500' : 'text-midnight dark:text-white'}`}>
              {availableSpots > 0 ? availableSpots : 'Complet'}
            </p>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50 mt-auto">
          <div>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Tarif</p>
            <p className="text-base font-black text-gold">
              {atelier.price.toLocaleString('fr-FR')} FCFA
            </p>
          </div>
          <a
            href={`/ateliers/${atelier.slug}`}
            className="flex items-center gap-1 bg-[var(--brand-midnight)] hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors shadow-sm"
          >
            S'inscrire
            <ArrowRight className="w-3.5 h-3.5 text-gold" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AtelierCard;
