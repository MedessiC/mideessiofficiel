import React from 'react';
import { TrendingUp, Clock, Users } from 'lucide-react';

interface SearchStats {
  totalResults: number;
  searchQuery: string;
  selectedCategory: string;
  totalArticles: number;
}

interface SearchStatsComponentProps {
  stats: SearchStats;
}

/**
 * Composant pour afficher les statistiques de recherche
 * Aide l'utilisateur à comprendre les résultats de sa recherche
 */
export const SearchStatsComponent: React.FC<SearchStatsComponentProps> = ({ stats }) => {
  const searchPercentage = Math.round((stats.totalResults / stats.totalArticles) * 100);
  
  return (
    <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 border border-gold/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex-1">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
            Résultat{stats.totalResults !== 1 ? 's' : ''} trouvé{stats.totalResults !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
            <span className="text-sm sm:text-base font-semibold text-midnight dark:text-white">
              {stats.totalResults} sur {stats.totalArticles}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">
              ({searchPercentage}% de la base)
            </span>
          </div>
          {stats.searchQuery && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Recherche: <span className="text-gold font-semibold">"{stats.searchQuery}"</span>
              {stats.selectedCategory !== 'all' && (
                <>
                  {' '}+ Catégorie: <span className="text-gold font-semibold">{stats.selectedCategory}</span>
                </>
              )}
            </p>
          )}
        </div>
        
        {stats.totalResults === 0 && (
          <div className="w-full sm:w-auto text-center sm:text-right">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Aucun résultat trouvé
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Essayez d'autres mots-clés
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Composant pour afficher des suggestions de recherche populaires
 * Aide l'utilisateur si sa recherche n'obtient pas de résultats
 */
export const SearchSuggestionsComponent: React.FC<{
  onSuggestionClick: (suggestion: string) => void;
}> = ({ onSuggestionClick }) => {
  const popularSearches = [
    'Intelligence Artificielle',
    'Automatisation',
    'Technologie',
    'Innovation',
    'Productivité'
  ];

  return (
    <div className="mb-6">
      <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
        Recherches populaires
      </p>
      <div className="flex flex-wrap gap-2">
        {popularSearches.map((search) => (
          <button
            key={search}
            onClick={() => onSuggestionClick(search)}
            className="px-3 py-1.5 sm:py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gold hover:text-midnight text-xs sm:text-sm rounded-full transition-all transform hover:scale-105"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Composant pour afficher les statistiques des articles
 * Montre les infos utiles pour chaque article trouvé
 */
export const ArticleStatsComponent: React.FC<{
  readTime?: number;
  author?: string;
  category?: string;
}> = ({ readTime, author, category }) => {
  return (
    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs sm:text-sm">
      {readTime && (
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{readTime} min</span>
        </div>
      )}
      {author && (
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Users className="w-3.5 h-3.5" />
          <span>{author}</span>
        </div>
      )}
      {category && (
        <span className="px-2 py-0.5 bg-gold/20 text-gold rounded-full text-xs font-semibold">
          {category}
        </span>
      )}
    </div>
  );
};

export default SearchStatsComponent;
