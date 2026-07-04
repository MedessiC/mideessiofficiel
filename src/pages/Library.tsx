import { useState, useEffect } from 'react';
import { BookOpen, Star, Users, Download, Heart, Share2, Search, Filter, ArrowRight, Trophy, Sparkles, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PopupDisplay from '../components/PopupDisplay';

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
  article_url?: string;
  buy_url?: string;
}

const Library = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedBooks, setLikedBooks] = useState<Set<string>>(new Set());

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

  const toggleLike = (bookId: string) => {
    setLikedBooks(prev => {
      const next = new Set(prev);
      if (next.has(bookId)) {
        next.delete(bookId);
      } else {
        next.add(bookId);
      }
      return next;
    });
  };

  const categories = ['Tous', 'Développement', 'Design', 'Entrepreneuriat', 'Cybersécurité'];
  
  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'Tous' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredBook = filteredBooks.find(b => b.is_bestseller) ?? filteredBooks[0] ?? null;
  const regularBooks = featuredBook
    ? filteredBooks.filter(b => b.id !== featuredBook.id)
    : filteredBooks;

  const getLevelColor = (level?: string) => {
    switch(level) {
      case 'Débutant': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'Intermédiaire': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
      case 'Avancé': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const BookCard = ({ book, featured = false }: { book: Book; featured?: boolean }) => {
    const isLiked = likedBooks.has(book.id);

    if (featured) {
      return (
        <div className="group relative bg-gradient-to-br from-midnight to-blue-900 rounded-2xl overflow-hidden shadow-xl border border-gold/30 mb-8">
          {/* Background image */}
          {book.cover_image && (
            <div className="absolute inset-0">
              <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-midnight/95 via-midnight/80 to-midnight/50" />
            </div>
          )}
          <div className="relative flex flex-col sm:flex-row gap-5 p-5 sm:p-6 md:p-8">
            {/* Cover */}
            <div className="flex-shrink-0 w-full sm:w-40 md:w-48 h-48 sm:h-auto rounded-xl overflow-hidden shadow-2xl border-2 border-gold/30">
              {book.cover_image ? (
                <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-gold/60" />
                </div>
              )}
            </div>
            {/* Info */}
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/20 border border-gold/40 text-gold text-xs font-bold rounded-full">
                    <Trophy className="w-3 h-3" /> BESTSELLER
                  </span>
                  {book.is_new && (
                    <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-full animate-pulse">
                      NOUVEAU
                    </span>
                  )}
                  {book.level && (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getLevelColor(book.level)}`}>
                      {book.level}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">{book.title}</h2>
                <p className="text-sm text-gray-300 line-clamp-2 mb-4">{book.description}</p>
                {/* Stats */}
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    <span className="text-sm font-bold text-white">{book.rating || 4.8}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-300" />
                    <span className="text-sm text-gray-300">{book.students || 150} lecteurs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-300" />
                    <span className="text-sm text-gray-300">{book.pages || 50} pages</span>
                  </div>
                </div>
              </div>
              {/* Price + CTA */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-gold/20 border border-gold/30 rounded-xl px-4 py-2">
                  <span className="text-2xl font-black text-gold">{book.price || '1000'}</span>
                  <span className="text-xs text-gray-400 ml-1">FCFA</span>
                </div>
                {book.buy_url && (
                  <a
                    href={book.buy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-midnight font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg hover:shadow-xl text-sm active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    Acheter maintenant
                  </a>
                )}
                {book.article_url && (
                  <a
                    href={book.article_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 text-white font-semibold py-2.5 px-4 rounded-xl transition-all text-sm"
                  >
                    Lire l'article
                    <ChevronRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-gold/40 flex flex-col">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700">
          {book.cover_image ? (
            <img
              src={book.cover_image}
              alt={book.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-midnight to-blue-800 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-white/60" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-1">
            <div className="flex flex-col gap-1">
              {book.is_bestseller && (
                <div className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1">
                  <Star className="w-2.5 h-2.5" /> BEST
                </div>
              )}
              {book.is_new && (
                <div className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow-lg animate-pulse">
                  NEW
                </div>
              )}
            </div>
          </div>

          {/* Touch-friendly action buttons (always visible on mobile, hover on desktop) */}
          <div className="absolute bottom-2 right-2 flex gap-1.5">
            <button
              onClick={() => toggleLike(book.id)}
              className={`p-2 rounded-full shadow-lg transition-all active:scale-95 ${
                isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 dark:bg-gray-900/90 text-gray-700 hover:bg-red-50 hover:text-red-500'
              }`}
              aria-label="J'aime"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              className="p-2 bg-white/90 dark:bg-gray-900/90 text-gray-700 rounded-full shadow-lg hover:bg-gold hover:text-midnight transition-all active:scale-95"
              aria-label="Partager"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          {/* Title & Level */}
          <div className="mb-2">
            <h3 className="text-sm sm:text-base font-bold text-midnight dark:text-white line-clamp-2 mb-1.5 leading-tight">
              {book.title}
            </h3>
            {book.level && (
              <span className={`inline-block text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${getLevelColor(book.level)}`}>
                {book.level}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-500 dark:text-gray-400 text-[11px] sm:text-xs line-clamp-2 mb-3 flex-grow leading-relaxed">
            {book.description}
          </p>

          {/* Stats — compact */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mb-3 pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-gold fill-gold" />
              <span className="font-bold text-gray-700 dark:text-white">{book.rating || 4.8}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-blue-400" />
              <span>{book.students || 150}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-emerald-400" />
              <span>{book.pages || 50}p</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-baseline gap-0.5 bg-gold/10 dark:bg-gold/5 px-2.5 py-1 rounded-lg">
              <span className="text-base sm:text-lg font-black text-gold">{book.price || '1000'}</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">FCFA</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-1.5 mt-auto">
            {book.buy_url && (
              <a
                href={book.buy_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-2 bg-gold hover:bg-yellow-400 text-midnight font-bold rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 text-xs sm:text-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Acheter
              </a>
            )}
            {book.article_url && (
              <a
                href={book.article_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors text-xs sm:text-sm"
              >
                Lire l'article
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 pb-24 sm:pb-8">
      {/* Hero Section */}
      <section className="relative text-white pt-20 sm:pt-24 pb-10 sm:pb-14 overflow-hidden bg-gradient-to-br from-midnight via-[#0e1a4d] to-blue-900">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
        
        {/* Decorative blobs */}
        <div className="absolute top-8 right-8 w-32 h-32 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-gold/15 rounded-full border border-gold/30">
            <BookOpen className="w-4 h-4 text-gold" />
            <span className="text-xs sm:text-sm font-semibold text-gold uppercase tracking-wider">BIBLIOTHÈQUE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Ta bibliothèque <span className="text-gold">tech</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-200 mb-2 max-w-xl mx-auto">
            Des PDFs pour progresser depuis ton téléphone
          </p>
          <p className="text-sm text-gray-400 mb-8">
            1000 FCFA chacun • Accès à vie • Mises à jour gratuites
          </p>
          {/* Stats */}
          <div className="flex justify-center gap-4 sm:gap-8">
            {[
              { value: books.length || '10+', label: 'PDFs' },
              { value: '4.8★', label: 'Note' },
              { value: '500+', label: 'Lecteurs' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-xl sm:text-2xl font-black text-gold">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter — Sticky */}
      <section className="sticky top-16 z-30 bg-white/95 dark:bg-gray-950/95 border-b border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Search Bar */}
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Chercher un PDF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all text-sm placeholder-gray-400"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-semibold text-xs whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-gold text-midnight shadow-md shadow-gold/20'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 md:py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Chargement de la bibliothèque...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">Aucun PDF trouvé</h3>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                {searchQuery ? 'Essaie une autre recherche' : 'Les PDFs arrivent très bientôt'}
              </p>
            </div>
          ) : (
            <>
              {/* Featured Bestseller */}
              {featuredBook && searchQuery === '' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">En vedette</h2>
                  </div>
                  <BookCard book={featuredBook} featured />
                </div>
              )}

              {/* Grid */}
              {regularBooks.length > 0 && (
                <>
                  {searchQuery === '' && featuredBook && (
                    <div className="flex items-center gap-2 mb-4">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tous les PDFs
                      </h2>
                      <span className="ml-auto text-xs text-gray-400">{regularBooks.length} titre{regularBooks.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {(searchQuery !== '' || !featuredBook ? filteredBooks : regularBooks).map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Stats Footer */}
          {filteredBooks.length > 0 && (
            <div className="mt-12 text-center border-t border-gray-100 dark:border-gray-800 pt-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                <span className="font-bold text-midnight dark:text-gold">{filteredBooks.length}</span>{' '}
                PDF{filteredBooks.length > 1 ? 's' : ''} disponible{filteredBooks.length > 1 ? 's' : ''}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Nouveaux PDFs ajoutés chaque semaine
              </p>
            </div>
          )}
        </div>
      </section>

      <PopupDisplay currentPage="library" />
    </div>
  );
};

export default Library;
