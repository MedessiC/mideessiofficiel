import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  author?: string;
  image_url?: string;
}

interface BlogCategory {
  id: string;
  name: string;
}

interface BlogSearchBarProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
  searchQuery: string;
}

export const BlogSearchBar: React.FC<BlogSearchBarProps> = ({
  posts,
  categories,
  onSearchChange,
  onCategoryChange,
  selectedCategory,
  searchQuery,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrer les articles en fonction de la recherche et la catégorie
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Limiter à 5 suggestions
  const suggestions = filteredPosts.slice(0, 5);

  // Fermer les dropdowns quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    setShowSuggestions(value.length > 0);
  };

  const handleCategorySelect = (categoryName: string) => {
    onCategoryChange(categoryName);
    setShowCategoryDropdown(false);
  };

  const handleSuggestionClick = (slug: string) => {
    window.location.href = `/blog/${slug}`;
  };

  const clearSearch = () => {
    onSearchChange('');
    setShowSuggestions(false);
  };

  const getCategoryDisplayName = () => {
    if (selectedCategory === 'all') return 'Toutes les catégories';
    return selectedCategory;
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Search Bar */}
      <div className="relative" ref={searchRef}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 sm:top-4 w-5 sm:w-6 h-5 sm:h-6 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Chercher par titre, auteur ou mot-clé..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              className="w-full pl-12 sm:pl-14 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:border-gold focus:bg-white/20 transition-all backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 sm:w-6 h-5 sm:h-6" />
              </button>
            )}
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base font-medium hover:bg-white/20 focus:outline-none focus:border-gold transition-all backdrop-blur-sm flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="hidden sm:inline">{getCategoryDisplayName()}</span>
                <span className="sm:hidden text-xs">Catégorie</span>
              </div>
              <ChevronDown 
                className={`w-4 sm:w-5 h-4 sm:h-5 transition-transform ${
                  showCategoryDropdown ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Category Dropdown Menu */}
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 right-auto sm:right-0 mt-2 w-full sm:w-56 bg-gray-900 border border-gold/40 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-sm">
                <div className="max-h-64 overflow-y-auto">
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className={`w-full px-4 py-3 text-left text-sm font-medium transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-gold/20 text-gold border-l-4 border-gold'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    ✓ Toutes les catégories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`w-full px-4 py-3 text-left text-sm font-medium transition-all ${
                        selectedCategory === cat.name
                          ? 'bg-gold/20 text-gold border-l-4 border-gold'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      {selectedCategory === cat.name ? '✓' : '  '} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gold/40 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-sm max-h-96 overflow-y-auto">
            {suggestions.length > 0 ? (
              <div>
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-xs sm:text-sm text-gray-400 font-medium">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'résultat trouvé' : 'résultats trouvés'}
                  </p>
                </div>
                {suggestions.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => handleSuggestionClick(post.slug)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-0 group"
                  >
                    <div className="flex gap-3 items-start">
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white group-hover:text-gold transition-colors line-clamp-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-400 line-clamp-1 mt-1">
                          {post.excerpt}
                        </p>
                        <div className="flex gap-2 items-center mt-2 text-xs">
                          <span className="px-2 py-0.5 bg-gold/20 text-gold rounded-full">
                            {post.category}
                          </span>
                          {post.author && (
                            <span className="text-gray-500">{post.author}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                {filteredPosts.length > 5 && (
                  <div className="px-4 py-3 border-t border-gray-700 text-center">
                    <p className="text-xs text-gold font-medium">
                      +{filteredPosts.length - 5} {filteredPosts.length - 5 === 1 ? 'résultat' : 'résultats'} supplémentaires
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <Search className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400 font-medium">Aucun article trouvé</p>
                <p className="text-xs text-gray-500 mt-1">Essayez une autre recherche</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Category Pills - Mobile/Tablet */}
      <div className="flex flex-wrap gap-2 sm:gap-3 md:hidden">
        <button
          onClick={() => handleCategorySelect('all')}
          className={`px-3 py-2 text-xs sm:text-sm rounded-full font-semibold transition-all transform hover:scale-105 ${
            selectedCategory === 'all'
              ? 'bg-gold text-midnight shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
          }`}
        >
          Tous
        </button>
        {categories.slice(0, 3).map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.name)}
            className={`px-3 py-2 text-xs sm:text-sm rounded-full font-semibold transition-all transform hover:scale-105 ${
              selectedCategory === cat.name
                ? 'bg-gold text-midnight shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogSearchBar;
