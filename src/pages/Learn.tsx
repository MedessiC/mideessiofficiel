import { useState, useEffect } from 'react';
import { BookOpen, Star, Users, Download, Heart, Share2, Search, Filter, ArrowRight, Smartphone } from 'lucide-react';
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
  cover_color?: string;
  article_url?: string;
  buy_url?: string;
  week_added?: string;
}

const Learn = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

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

  const categories = ['Tous', 'Développement', 'Design', 'Entrepreneuriat', 'Cybersécurité'];
  
  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'Tous' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLevelColor = (level?: string) => {
    switch(level) {
      case 'Débutant': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'Intermédiaire': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'Avancé': return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative text-white pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden bg-gradient-to-r from-[#191970] to-[#0e1a4d]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent"></div>
        
        <div className="absolute top-10 left-10 w-16 h-16 border-4 border-[#ffd700] opacity-10 rotate-45 hidden sm:block"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 border-4 border-[#ffd700] opacity-10 rounded-full hidden sm:block"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-[#ffd700]/10 rounded-full border border-[#ffd700]/30">
              <BookOpen className="w-4 h-4 text-[#ffd700]" />
              <span className="text-xs sm:text-sm font-semibold text-[#ffd700]">BIBLIOTHÈQUE MIDEESSI</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Ta bibliothèque tech
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-2">
              Des PDFs pour progresser depuis ton téléphone
            </p>
            <p className="text-base text-gray-300">
              1000 FCFA chacun • Accès à vie • Mises à jour gratuites
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm md:shadow-none transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Search Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Chercher un PDF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-[#ffd700] focus:outline-none transition-colors text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            <div className="flex gap-2 sm:gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#ffd700] text-[#191970] shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 sm:py-20">
              <div className="inline-block">
                <div className="animate-spin w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#ffd700] border-t-transparent rounded-full"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm sm:text-base">Chargement de la bibliothèque...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <BookOpen className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                Aucun PDF trouvé
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                {searchQuery ? 'Essaie une autre recherche' : 'Les PDFs arrivent très bientôt'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-[#ffd700]/50 flex flex-col"
                >
                  {/* Cover Image */}
                  <div className="relative h-56 sm:h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
                    {book.cover_image ? (
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#191970] to-[#ffd700] flex items-center justify-center">
                        <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-white opacity-90" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      {book.is_bestseller && (
                        <div className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          BEST
                        </div>
                      )}
                      {book.is_new && (
                        <div className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse ml-auto">
                          NOUVEAU
                        </div>
                      )}
                    </div>

                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button className="p-3 bg-white dark:bg-gray-900 rounded-full hover:bg-[#ffd700] transition-all shadow-lg">
                        <Heart className="w-5 h-5 text-[#191970]" />
                      </button>
                      <button className="p-3 bg-white dark:bg-gray-900 rounded-full hover:bg-[#ffd700] transition-all shadow-lg">
                        <Share2 className="w-5 h-5 text-[#191970]" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex flex-col flex-grow">
                    {/* Title & Level */}
                    <div className="mb-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#191970] dark:text-white line-clamp-2 mb-2">
                        {book.title}
                      </h3>
                      {book.level && (
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${getLevelColor(book.level)}`}>
                          {book.level}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-2 mb-4 flex-grow">
                      {book.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffd700] fill-[#ffd700]" />
                          <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                            {book.rating || 4.8}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Note</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                          <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                            {book.students || 150}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Lus</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                          <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                            {book.pages || 50}p
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Pages</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="inline-flex items-baseline gap-1 bg-[#ffd700]/10 px-3 py-2 rounded-lg">
                        <span className="text-xl sm:text-2xl font-bold text-[#ffd700]">
                          {book.price || '1000'}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">FCFA</span>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-2 mt-auto">
                      {book.article_url && (
                        <a
                          href={book.article_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors text-xs sm:text-sm"
                        >
                          Lire l'article
                        </a>
                      )}
                      
                      {book.buy_url && (
                        <a
                          href={book.buy_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center px-4 py-2.5 bg-[#ffd700] hover:bg-[#ffed4e] text-[#191970] font-bold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] text-xs sm:text-sm flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Acheter
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Footer */}
          {filteredBooks.length > 0 && (
            <div className="mt-12 sm:mt-16 md:mt-20 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Affichage de <span className="font-bold text-[#191970] dark:text-[#ffd700]">{filteredBooks.length}</span> PDF{filteredBooks.length > 1 ? 's' : ''}
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm mt-2">
                Nouveaux PDFs ajoutés chaque semaine
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-[#191970] to-[#0e1a4d] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Smartphone className="w-12 h-12 sm:w-16 sm:h-16 text-[#ffd700] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Reçois les nouveaux PDFs en avant-première
          </h2>
          <p className="text-base sm:text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Inscris-toi à notre newsletter pour être le premier à découvrir les nouveaux contenus et recevoir des offres exclusives.
          </p>
          <a
            href="/#newsletter"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#ffd700] text-[#191970] font-bold rounded-lg hover:bg-[#ffed4e] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            S'inscrire à la newsletter
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>
      </section>

      <PopupDisplay currentPage="learn" />
    </div>
  );
};

export default Learn;