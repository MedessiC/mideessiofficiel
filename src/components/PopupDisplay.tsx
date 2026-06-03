import { useState, useEffect } from 'react';
import { X, Zap, CheckCircle, Gift, Clock, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Popup {
  id: string;
  title: string;
  description: string;
  type: 'modal' | 'slide-in' | 'banner';
  trigger: 'page_load' | 'exit_intent' | 'scroll' | 'time_delay';
  pages: string[];
  image_url: string;
  promo_code: string;
  discount_percent: number;
  cta_link: string;
  cta_text: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface PopupDisplayProps {
  currentPage: string;
}

const PopupDisplay = ({ currentPage }: PopupDisplayProps) => {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [visiblePopupIds, setVisiblePopupIds] = useState<Set<string>>(new Set());
  const [countdowns, setCountdowns] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    fetchPopups();
  }, [currentPage]);

  const fetchPopups = async () => {
    try {
      const now = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('popups')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .gte('end_date', now);

      if (error) {
        console.error('Error fetching popups:', error);
        return;
      }

      if (data) {
        // Filter popups that include current page
        const filteredPopups = data.filter((popup) =>
          popup.pages && popup.pages.includes(currentPage)
        );
        setPopups(filteredPopups);

        // Trigger page_load popups immediately
        const pageLoadPopupIds = new Set(
          filteredPopups
            .filter((p) => p.trigger === 'page_load')
            .map((p) => p.id)
        );
        setVisiblePopupIds(pageLoadPopupIds);

        // Trigger time_delay popups after 10 seconds
        filteredPopups
          .filter((p) => p.trigger === 'time_delay')
          .forEach((popup) => {
            setTimeout(() => {
              setVisiblePopupIds((prev) => new Set(prev).add(popup.id));
            }, 10000);
          });
      }
    } catch (error) {
      console.error('Error in fetchPopups:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const percentage = (scrolled / scrollHeight) * 100;

      // Trigger scroll popups at 40%
      if (percentage >= 40) {
        popups
          .filter((p) => p.trigger === 'scroll')
          .forEach((popup) => {
            setVisiblePopupIds((prev) => new Set(prev).add(popup.id));
          });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [popups]);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if ((e.clientY) <= 0) {
        popups
          .filter((p) => p.trigger === 'exit_intent')
          .forEach((popup) => {
            setVisiblePopupIds((prev) => new Set(prev).add(popup.id));
          });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [popups]);

  // Calculate remaining seconds from end_date
  const calculateRemainingSeconds = (endDate: string): number => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const remaining = Math.floor((end - now) / 1000);
    return remaining > 0 ? remaining : 0;
  };

  // Countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const updated = new Map(prev);
        visiblePopupIds.forEach((popupId) => {
          const popup = popups.find((p) => p.id === popupId);
          if (popup && popup.end_date) {
            const remaining = calculateRemainingSeconds(popup.end_date);
            if (remaining > 0) {
              updated.set(popupId, remaining);
            }
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visiblePopupIds, popups]);

  // Initialize countdowns when popups become visible
  useEffect(() => {
    visiblePopupIds.forEach((popupId) => {
      const popup = popups.find((p) => p.id === popupId);
      if (popup && popup.end_date && !countdowns.has(popupId)) {
        const remaining = calculateRemainingSeconds(popup.end_date);
        if (remaining > 0) {
          setCountdowns((prev) => new Map(prev).set(popupId, remaining));
        }
      }
    });
  }, [visiblePopupIds, popups, countdowns]);

  const formatCountdown = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hrs = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) {
      return `${days}j ${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
    } else if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    } else {
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  };

  const getCountdownLabel = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    if (days > 0) return `${days} jour${days > 1 ? 's' : ''}`;
    const hrs = Math.floor((seconds % 86400) / 3600);
    if (hrs > 0) return `${hrs} heure${hrs > 1 ? 's' : ''}`;
    const mins = Math.floor((seconds % 3600) / 60);
    if (mins > 0) return `${mins} minute${mins > 1 ? 's' : ''}`;
    return 'Quelques secondes';
  };

  const closePopup = (popupId: string) => {
    setVisiblePopupIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(popupId);
      return newSet;
    });
  };

  const renderPopupContent = (popup: Popup) => {
    const countdownValue = countdowns.get(popup.id);
    const isCtaExternal = popup.cta_link.startsWith('http');
    
    return (
      <div className="space-y-2.5 xs:space-y-3 sm:space-y-4">
        {/* Image - Compact height */}
        {popup.image_url && (
          <div className="relative w-full h-24 xs:h-28 sm:h-40 rounded-lg overflow-hidden bg-gradient-to-br from-[#ffd700]/20 to-[#191970]/20 flex-shrink-0 border border-[#ffd700]/30">
            <img
              src={popup.image_url}
              alt={popup.title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Header with Icon */}
        <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
          <div className="flex-shrink-0 p-2 sm:p-2.5 bg-[#ffd700]/10 rounded-lg">
            <Sparkles className="w-4 xs:w-4.5 sm:w-5 h-4 xs:h-4.5 sm:h-5 text-[#ffd700]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[#191970] dark:text-white leading-tight">
              {popup.title}
            </h3>
          </div>
        </div>

        {/* Description - Compact */}
        <p className="text-xs xs:text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-snug line-clamp-2 xs:line-clamp-3 sm:line-clamp-none">
          {popup.description}
        </p>

        {/* Promo Code - Compact */}
        {popup.promo_code && (
          <div className="bg-gradient-to-r from-[#ffd700]/15 to-[#ffd700]/5 dark:from-[#ffd700]/20 dark:to-[#ffd700]/5 border border-[#ffd700]/40 dark:border-[#ffd700]/60 rounded-lg p-2.5 xs:p-3 sm:p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 xs:w-16 h-12 xs:h-16 bg-[#ffd700]/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex items-center gap-1.5 xs:gap-2 relative z-10">
              <Gift className="w-3.5 xs:w-4 sm:w-5 h-3.5 xs:h-4 sm:h-5 text-[#ffd700] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs xs:text-xs font-bold text-[#191970] dark:text-[#ffd700] uppercase tracking-wider">
                  {popup.discount_percent}% OFF
                </p>
                <p className="text-sm xs:text-base sm:text-lg font-mono font-bold text-[#191970] dark:text-white break-all">
                  {popup.promo_code}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Countdown - Compact */}
        {popup.end_date && countdownValue !== undefined && countdownValue > 0 && (
          <div className="bg-gradient-to-r from-red-100/50 to-orange-100/50 dark:from-red-900/30 dark:to-orange-900/30 border border-red-300/60 dark:border-red-700/60 rounded-lg p-2.5 xs:p-3 sm:p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 xs:w-16 h-12 xs:h-16 bg-red-400/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex items-center gap-1.5 xs:gap-2 relative z-10">
              <div className="flex-shrink-0 animate-pulse">
                <Clock className="w-3.5 xs:w-4 sm:w-5 h-3.5 xs:h-4 sm:h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wide leading-tight">
                  Expire dans {getCountdownLabel(countdownValue)}
                </p>
                <p className="text-base xs:text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400 font-mono">
                  {formatCountdown(countdownValue)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Button - Full Width */}
        {isCtaExternal ? (
          <a
            href={popup.cta_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-1 xs:mt-1.5 sm:mt-2 px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-[#191970] to-[#191970]/80 hover:from-[#ffd700] hover:to-[#ffd700]/90 text-white hover:text-[#191970] font-bold text-xs xs:text-sm sm:text-base rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 block"
          >
            <CheckCircle className="w-3.5 xs:w-4 sm:w-5 h-3.5 xs:h-4 sm:h-5 flex-shrink-0" />
            <span className="truncate">{popup.cta_text}</span>
          </a>
        ) : (
          <a
            href={popup.cta_link}
            className="w-full mt-1 xs:mt-1.5 sm:mt-2 px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-[#191970] to-[#191970]/80 hover:from-[#ffd700] hover:to-[#ffd700]/90 text-white hover:text-[#191970] font-bold text-xs xs:text-sm sm:text-base rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 block"
          >
            <CheckCircle className="w-3.5 xs:w-4 sm:w-5 h-3.5 xs:h-4 sm:h-5 flex-shrink-0" />
            <span className="truncate">{popup.cta_text}</span>
          </a>
        )}
      </div>
    );
  };

  return (
    <>
      {popups.map((popup) => {
        const isVisible = visiblePopupIds.has(popup.id);

        if (popup.type === 'modal') {
          return (
            <div
              key={popup.id}
              className={`fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4 transition-all duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => closePopup(popup.id)}
              style={{
                backdropFilter: isVisible ? 'blur(4px)' : 'blur(0px)',
                backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
              }}
            >
              <div
                className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-2xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full relative p-3 xs:p-4 sm:p-6 md:p-8 border-2 border-[#ffd700]/30 dark:border-[#ffd700]/50 transition-all duration-300 transform overflow-y-auto max-h-[85vh] xs:max-h-[80vh] ${
                  isVisible ? 'scale-100' : 'scale-95'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 xs:w-32 h-24 xs:h-32 bg-[#ffd700]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-24 xs:w-32 h-24 xs:h-32 bg-[#191970]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none"></div>

                {/* Close button */}
                <button
                  onClick={() => closePopup(popup.id)}
                  className="absolute top-2 xs:top-3 right-2 xs:right-3 p-1 xs:p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 z-50"
                >
                  <X className="w-4 xs:w-5 h-4 xs:h-5" />
                </button>

                {/* Content */}
                <div className="relative z-10 pt-4 xs:pt-0">
                  {renderPopupContent(popup)}
                </div>
              </div>
            </div>
          );
        }

        if (popup.type === 'slide-in') {
          return (
            <div
              key={popup.id}
              className={`fixed bottom-3 xs:bottom-4 sm:bottom-6 right-3 xs:right-4 sm:right-6 z-50 transform transition-all duration-500 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'
              }`}
            >
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-2xl max-w-xs w-[calc(100vw-1.5rem)] xs:w-80 sm:w-96 p-3 xs:p-4 sm:p-6 relative border-2 border-[#ffd700]/30 dark:border-[#ffd700]/50 overflow-hidden overflow-y-auto max-h-[75vh] xs:max-h-[80vh]">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 xs:w-24 h-20 xs:h-24 bg-[#ffd700]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>

                {/* Close button */}
                <button
                  onClick={() => closePopup(popup.id)}
                  className="absolute top-2 xs:top-2.5 right-2 xs:right-2.5 p-1 xs:p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 z-50"
                >
                  <X className="w-4 xs:w-5 h-4 xs:h-5" />
                </button>

                {/* Content */}
                <div className="relative z-10 pt-3 xs:pt-0">
                  {renderPopupContent(popup)}
                </div>
              </div>
            </div>
          );
        }

        if (popup.type === 'banner') {
          return (
            <div
              key={popup.id}
              className={`fixed top-0 left-0 right-0 z-50 transform transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
              }`}
            >
              <div className="bg-gradient-to-r from-[#191970] via-[#191970]/95 to-[#191970] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white shadow-xl border-b-2 border-[#ffd700]/50">
                <div className="max-w-7xl mx-auto px-2.5 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-2 xs:py-2.5 sm:py-3">
                  <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5 xs:gap-2 sm:gap-3">
                    <div className="flex-1 flex items-start xs:items-center gap-1.5 xs:gap-2 sm:gap-3 min-w-0">
                      <div className="flex-shrink-0 p-1 xs:p-1.5 bg-[#ffd700]/20 rounded">
                        <Zap className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4 text-[#ffd700]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xs xs:text-xs sm:text-sm text-white leading-tight line-clamp-1">
                          {popup.title}
                        </h3>
                        <p className="text-xs text-gray-200 opacity-90 line-clamp-1 leading-tight">
                          {popup.description}
                        </p>
                        {popup.promo_code && (
                          <p className="text-xs font-mono font-bold mt-0.5 xs:mt-1 text-[#ffd700] truncate">
                            <span className="bg-white/20 px-1 xs:px-1.5 py-0.5 rounded text-[11px] xs:text-xs">{popup.promo_code}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => closePopup(popup.id)}
                      className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-all duration-200 text-white hover:text-[#ffd700]"
                    >
                      <X className="w-3.5 xs:w-4 sm:w-5 h-3.5 xs:h-4 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return null;
      })}

      <style>{`
        @keyframes popupSlideIn {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes popupScaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        * {
          transition-property: color, background-color, border-color, box-shadow;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
};

export default PopupDisplay;
