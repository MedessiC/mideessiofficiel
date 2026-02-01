import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, CheckCircle } from 'lucide-react';
import { Solution } from '../data/solutions';

interface SolutionCardProps {
  solution: Solution;
  variant?: 'default' | 'compact';
}

const SolutionCard = ({ solution, variant = 'default' }: SolutionCardProps) => {
  if (variant === 'compact') {
    return (
      <Link
        to={`/solutions/${solution.slug}`}
        className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="relative h-32 md:h-40 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img
            src={solution.image}
            alt={solution.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-3 md:p-4">
          <h3 className="text-base md:text-lg font-bold text-midnight dark:text-white group-hover:text-gold transition-colors line-clamp-2">
            {solution.name}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
            {solution.tagline}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold">En savoir plus</span>
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-gold group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/solutions/${solution.slug}`}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
    >
      {/* Image - Responsive Height */}
      <div className="relative h-40 md:h-48 lg:h-56 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={solution.image}
          alt={solution.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Content - Responsive Padding */}
      <div className="p-4 md:p-6 lg:p-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 md:mb-4 gap-2 md:gap-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl md:text-2xl font-bold text-midnight dark:text-white mb-1 group-hover:text-gold transition-colors line-clamp-2">
              {solution.name}
            </h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium line-clamp-2">
              {solution.tagline}
            </p>
          </div>
          <span
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
              solution.status === 'Disponible'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            }`}
          >
            {solution.status}
          </span>
        </div>

        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4 md:mb-6 line-clamp-2 md:line-clamp-3">
          {solution.description}
        </p>

        {/* Key Benefits - Responsive */}
        <div className="mb-4 md:mb-6 space-y-1.5 md:space-y-2">
          {solution.benefits.slice(0, 3).map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs md:text-sm">
              <CheckCircle className="w-4 h-4 md:w-4 md:h-4 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 dark:text-gray-400 line-clamp-1">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Stats - Responsive Grid */}
        {solution.stats && (
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
            {solution.stats.slice(0, 2).map((stat, idx) => (
              <div key={idx} className="min-w-0">
                <div className="text-base md:text-lg font-bold text-gold truncate">{stat.value}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* CTA - Responsive */}
        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="inline-flex items-center text-gold font-bold text-xs md:text-sm group-hover:gap-2 transition-all">
            En savoir plus
            <ArrowRight className="ml-1.5 md:ml-2 w-3 h-3 md:w-4 md:h-4" />
          </span>
          <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-gold transition-colors" />
        </div>
      </div>
    </Link>
  );
};

export default SolutionCard;
