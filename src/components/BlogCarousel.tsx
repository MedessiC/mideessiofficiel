import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogPost } from '../lib/supabase';

interface BlogCarouselProps {
  title: React.ReactNode;
  posts: BlogPost[];
  renderCard: (post: BlogPost) => React.ReactNode;
}

const BlogCarousel = ({ title, posts, renderCard }: BlogCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout>();
  const pauseTimeoutRef = useRef<NodeJS.Timeout>();

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  // Auto-scroll logic
  const startAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    autoScrollIntervalRef.current = setInterval(() => {
      const container = scrollContainerRef.current;
      if (container) {
        // Vérifier si on peut scroller à droite
        if (container.scrollLeft < container.scrollWidth - container.clientWidth - 10) {
          container.scrollBy({
            left: 400,
            behavior: 'smooth',
          });
        } else {
          // Retour au début
          container.scrollTo({
            left: 0,
            behavior: 'smooth',
          });
        }
      }
    }, 6000); // Scroll toutes les 6 secondes
  };

  const pauseAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }

    // Reprendre après 8 secondes d'inactivité
    pauseTimeoutRef.current = setTimeout(() => {
      startAutoScroll();
    }, 8000);
  };

  useEffect(() => {
    checkScroll();
    startAutoScroll();
    window.addEventListener('resize', checkScroll);

    return () => {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 400;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
      pauseAutoScroll(); // Pause auto-scroll au clic manuel
    }
  };

  if (posts.length === 0) return null;

  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-16 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-midnight dark:text-white flex-1 line-clamp-2">
            {title}
          </h2>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2 sm:p-2.5 md:p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gold hover:text-midnight dark:hover:bg-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110"
              aria-label="Scroll left"
              title="Article précédent"
            >
              <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-midnight dark:text-white" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2 sm:p-2.5 md:p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gold hover:text-midnight dark:hover:bg-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110"
              aria-label="Scroll right"
              title="Article suivant"
            >
              <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-midnight dark:text-white" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={() => {
            checkScroll();
            pauseAutoScroll();
          }}
          onMouseEnter={pauseAutoScroll}
          onMouseLeave={() => startAutoScroll()}
          className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide scroll-smooth"
        >
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex-shrink-0 w-80 md:w-96 snap-start transition-transform duration-300"
            >
              {renderCard(post)}
            </div>
          ))}
        </div>

        {/* Info auto-scroll */}
        <div className="mt-2 sm:mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          Défilement automatique • Cliquez les flèches
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scroll-smooth {
          scroll-behavior: smooth;
        }
      `}</style>
    </section>
  );
};

export default BlogCarousel;
