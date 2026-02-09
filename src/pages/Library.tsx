import { useState, useEffect } from 'react';
import { BookOpen, Search, Star, Users, Download, Filter, X, ChevronLeft, ChevronRight, ArrowLeft, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getIcon } from '../utils/iconMapper';
import SEO from '../components/SEO';

interface Book {
  id: string;
  title: string;
  description: string;
  category?: string;
  price?: string | number;
  rating?: number;
  students?: number;
  pages?: number;
  level?: string;
  is_new?: boolean;
  is_bestseller?: boolean;
  cover_image?: string;
  cover_color?: string;
  article_url?: string;
  buy_url?: string;
  created_at?: string;
  updated_at?: string;
}

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  const categories = [
    { id: 'all', name: 'Tous les PDFs', iconName: 'BookOpen' },
    { id: 'mobile', name: 'Tutoriels Mobile', iconName: 'Smartphone' },
    { id: 'cybersec', name: 'Cybersécurité', iconName: 'Lock' },
    { id: 'webdev', name: 'Développement Web', iconName: 'Code' },
    { id: 'design', name: 'Design & UI/UX', iconName: 'Sparkles' },
    { id: 'business', name: 'Tech Business', iconName: 'TrendingUp' },
    { id: 'data', name: 'Data & IA', iconName: 'Zap' },
  ];

  const levels = [
    { id: 'all', name: 'Tous niveaux' },
    { id: 'Débutant', name: 'Débutant' },
    { id: 'Intermédiaire', name: 'Intermédiaire' },
    { id: 'Avancé', name: 'Avancé' },
  ];

  const sortOptions = [
    { id: 'recent', name: 'Plus récents' },
    { id: 'popular', name: 'Plus populaires' },
    { id: 'rated', name: 'Mieux notés' },
    { id: 'price-asc', name: 'Prix croissant' },
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur:', error);
      } else {
        setBooks(data || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books
    .filter(book => {
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || book.level === selectedLevel;
      const matchesSearch = (book.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                           (book.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      return matchesCategory && matchesLevel && matchesSearch;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'popular': return (b.students || 0) - (a.students || 0);
        case 'rated': return (b.rating || 0) - (a.rating || 0);
        case 'price-asc': return (Number(a.price) || 0) - (Number(b.price) || 0);
        default: {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        }
      }
    });

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const getLevelColor = (level?: string) => {
    switch(level) {
      case 'Débutant': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Avancé': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO 
        title="Bibliothèque MIDEESSI Learn | PDFs éducatifs"
        description="Découvrez notre complète bibliothèque de PDFs éducatifs classés par catégories et niveaux"
      />
      
      {/* Hero Section Compact - Mobile First */}
      <section className="relative bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-5 md:py-8 lg:py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 right-2 md:top-10 md:right-5 lg:top-20 lg:right-10 w-32 h-32 md:w-48 md:h-48 lg:w-72 lg:h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute -bottom-5 -left-2 md:bottom-10 md:left-5 lg:bottom-20 lg:left-10 w-36 h-36 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <Link to="/learn" className="inline-flex items-center gap-1 md:gap-2 text-gold hover:text-yellow-400 font-semibold mb-3 md:mb-4 text-xs md:text-sm group">
            <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
            Retour
          </Link>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1.5 md:mb-2 tracking-tight">
            Bibliothèque <span className="text-gold">Learn</span>
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base text-gray-200 max-w-2xl">
            Explorez notre collection de PDFs éducatifs classés par catégories et niveaux.
          </p>
        </div>
      </section>

      {/* Search & Filter Section - Mobile First */}
      <section className="bg-white dark:bg-gray-800 shadow-lg border-b-2 border-gold sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-6">
          <div className="flex flex-col gap-2 md:gap-3 lg:gap-4">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 md:left-3 lg:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 md:pl-10 lg:pl-12 pr-2 md:pr-3 lg:pr-4 py-2 md:py-2.5 lg:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg md:rounded-xl focus:ring-2 focus:ring-gold focus:border-gold bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium text-xs md:text-sm lg:text-base"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 lg:px-5 py-2 md:py-2.5 lg:py-3 bg-gold hover:bg-yellow-500 text-midnight font-bold rounded-lg md:rounded-xl transition-all shadow-md whitespace-nowrap text-xs md:text-sm lg:text-base"
              >
                <Filter className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Filtres</span>
              </button>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-1.5 md:gap-2">
              <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-gold" />
                <span className="font-semibold">{filteredBooks.length} PDF{filteredBooks.length > 1 ? 's' : ''}</span>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 md:px-3 lg:px-4 py-1 md:py-1.5 lg:py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
              >
                {sortOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
            </div>

            {showFilters && (
              <div className="space-y-2 md:space-y-3 lg:space-y-4 pt-2 md:pt-3 lg:pt-4 border-t border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">Catégories</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 md:gap-2">
                    {categories.map(category => {
                      const Icon = getIcon(category.iconName);
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex items-center justify-center gap-1 px-1.5 md:px-2 lg:px-3 py-1.5 md:py-2 rounded-lg font-medium transition-all text-xs md:text-sm ${
                            selectedCategory === category.id
                              ? 'bg-gold text-midnight shadow-md'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <Icon className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="hidden md:inline">{category.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">Niveau</p>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {levels.map(level => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`px-2 md:px-3 lg:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all text-xs md:text-sm ${
                          selectedLevel === level.id
                            ? 'bg-gold text-midnight shadow-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                </div>

                {(selectedCategory !== 'all' || selectedLevel !== 'all') && (
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedLevel('all');
                    }}
                    className="flex items-center gap-0.5 md:gap-1 text-xs md:text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>Réinit.</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PDFs Grid - Mobile First */}
      <section className="py-6 md:py-8 lg:py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 md:py-16 lg:py-20">
              <div className="animate-spin w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 border-4 border-gold border-t-transparent rounded-full mx-auto mb-3 md:mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm lg:text-base">Chargement des PDFs...</p>
            </div>
          ) : currentBooks.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8 lg:mb-12">
                {currentBooks.map((book) => (
                  <div key={book.id} className="group bg-white dark:bg-gray-800 rounded-lg md:rounded-2xl overflow-hidden shadow-sm md:shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-gold hover:-translate-y-0.5 md:hover:-translate-y-1">
                    <div className="relative h-32 md:h-40 lg:h-48 bg-gradient-to-br from-midnight to-blue-900 overflow-hidden">
                      {book.cover_image ? (
                        <img 
                          src={book.cover_image} 
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const nextSibling = target.nextSibling as HTMLElement | null;
                            if (nextSibling) nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`${book.cover_image ? 'hidden' : 'flex'} absolute inset-0 bg-gradient-to-br ${book.cover_color || 'from-midnight to-blue-900'} p-2 md:p-3 lg:p-4 flex-col items-center justify-center`}
                      >
                        <BookOpen className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 text-white opacity-90 mb-1 md:mb-2" />
                        <div className="bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1 rounded-lg">
                          <div className="text-white font-bold text-xs md:text-sm flex items-center gap-1">
                            <Smartphone className="w-3 h-3 md:w-4 md:h-4" />
                            100% Mobile
                          </div>
                        </div>
                      </div>

                      {book.is_new && (
                        <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-gold text-midnight text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-lg animate-pulse">
                          NOUVEAU
                        </div>
                      )}
                      {!book.is_new && (
                        <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-gold text-midnight rounded-full px-2 md:px-3 py-0.5 md:py-1 text-xs font-bold">
                          {book.price}F
                        </div>
                      )}
                    </div>

                    <div className="p-3 md:p-4 lg:p-5">
                      <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                        <span className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-bold ${getLevelColor(book.level)}`}>
                          {book.level}
                        </span>
                      </div>

                      <h3 className="text-xs md:text-sm lg:text-base font-bold text-midnight dark:text-white mb-1 md:mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                        {book.title}
                      </h3>

                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 md:mb-3 line-clamp-2">
                        {book.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2.5 md:mb-3 text-xs text-gray-500 dark:text-gray-400">
                        {book.students && (
                          <div className="flex items-center gap-0.5 md:gap-1">
                            <Users className="w-3 h-3" />
                            <span>{book.students}</span>
                          </div>
                        )}
                        {book.rating && (
                          <div className="flex items-center gap-0.5 md:gap-1">
                            <Star className="w-3 h-3 fill-gold text-gold" />
                            <span>{book.rating}/5</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <a 
                          href={book.article_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 md:gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-1.5 md:py-2 rounded-lg transition-all hover:scale-105 text-xs md:text-sm"
                        >
                          <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          Lire l'article
                        </a>

                        <a
                          href={book.buy_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 md:gap-2 bg-gold hover:bg-yellow-500 text-midnight font-bold py-1.5 md:py-2 lg:py-2.5 rounded-lg transition-all text-xs md:text-sm"
                        >
                          <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          Acheter maintenant
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 md:gap-2 mt-6 md:mt-8 lg:mt-12">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 md:p-2 rounded-lg border border-gold text-gold hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  </button>

                  <div className="flex gap-0.5 md:gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 md:px-3 lg:px-4 py-1 md:py-2 rounded-lg font-bold transition-all text-xs md:text-sm ${
                          currentPage === page
                            ? 'bg-gold text-midnight shadow-md'
                            : 'border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 md:p-2 rounded-lg border border-gold text-gold hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 md:py-12 lg:py-16">
              <BookOpen className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-gray-300 dark:text-gray-600 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm lg:text-base">Aucun PDF ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Library;
