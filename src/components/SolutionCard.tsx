import { ArrowRight, ExternalLink, CheckCircle } from 'lucide-react';
import { Solution } from '../data/solutions';

interface SolutionCardProps {
  solution: Solution;
  variant?: 'default' | 'compact';
}

const SolutionCard = ({ solution, variant = 'default' }: SolutionCardProps) => {
  if (variant === 'compact') {
    return (
      <a
        href={`/solutions/${solution.slug}`}
        className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="relative h-32 overflow-hidden bg-gray-200 dark:bg-gray-700 md:h-40">
          <img
            src={solution.image}
            alt={solution.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="p-3 md:p-4">
          <h3 className="line-clamp-2 text-base font-bold text-midnight transition-colors group-hover:text-gold dark:text-white md:text-lg">
            {solution.name}
          </h3>
          <p className="mb-2 line-clamp-1 text-xs text-gray-600 dark:text-gray-400">
            {solution.tagline}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold">En savoir plus</span>
            <ArrowRight className="h-3 w-3 text-gold transition-transform group-hover:translate-x-1 md:h-4 md:w-4" />
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={`/solutions/${solution.slug}`}
      className="group relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_20px_45px_-20px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_60px_-25px_rgba(15,23,42,0.35)] dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="relative h-40 overflow-hidden bg-gray-200 dark:bg-gray-700 md:h-48 lg:h-56">
        <img
          src={solution.image}
          alt={solution.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent"></div>
        <div className="absolute right-4 top-4 rounded-full border border-white/40 bg-white/90 px-3 py-1 text-xs font-semibold text-midnight backdrop-blur-sm">
          {solution.status}
        </div>
      </div>

      <div className="relative p-4 md:p-6 lg:p-8">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 line-clamp-2 text-xl font-bold text-midnight transition-colors group-hover:text-gold dark:text-white md:text-2xl">
              {solution.name}
            </h3>
            <p className="line-clamp-2 text-xs font-medium text-gray-600 dark:text-gray-400 md:text-sm">
              {solution.tagline}
            </p>
          </div>
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300 md:mb-6 md:text-base md:line-clamp-3">
          {solution.description}
        </p>

        <div className="mb-4 space-y-1.5 md:mb-6 md:space-y-2">
          {solution.benefits.slice(0, 3).map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs md:text-sm">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
              <span className="line-clamp-1 text-gray-600 dark:text-gray-400">{benefit}</span>
            </div>
          ))}
        </div>

        {solution.stats && (
          <div className="mb-4 grid grid-cols-2 gap-3 border-t border-gray-200 pt-3 md:mb-6 md:gap-4 md:pt-4 dark:border-gray-700">
            {solution.stats.slice(0, 2).map((stat, idx) => (
              <div key={idx} className="min-w-0">
                <div className="truncate text-base font-bold text-gold md:text-lg">{stat.value}</div>
                <div className="line-clamp-1 text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-200 pt-3 md:pt-4 dark:border-gray-700">
          <span className="inline-flex items-center text-xs font-bold text-gold transition-all group-hover:gap-2 md:text-sm">
            En savoir plus
            <ArrowRight className="ml-1.5 h-3 w-3 md:ml-2 md:h-4 md:w-4" />
          </span>
          <ExternalLink className="h-4 w-4 text-gray-400 transition-colors group-hover:text-gold md:h-5 md:w-5" />
        </div>
      </div>
    </a>
  );
};

export default SolutionCard;
