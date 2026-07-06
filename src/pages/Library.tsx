import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, Users, Download, Heart, Share2, Search, Filter, Trophy, Sparkles, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PopupDisplay from '../components/PopupDisplay';
import { useAuth } from '../contexts/AuthContext';

interface Book {
  id: string;
  title: string;
  description: string;
  category?: string;
  price?: string | number;
  rating?: number;
  views?: number;
  students?: number;
  pages?: number;
  level?: string;
  is_new?: boolean;
  is_bestseller?: boolean;
  cover_image?: string;
  article_url?: string;
  buy_url?: string;
}

const CATEGORIES = ['Tous', 'Développement', 'Design', 'Entrepreneuriat', 'Cybersécurité'];

// Cache en mémoire qui survit aux montages/démontages du composant
// (évite de réafficher le skeleton à chaque retour sur la page)
let booksCache: Book[] | null = null;
let readerCountsCache: Record<string, number> = {};

const getLevelColor = (level?: string) => {
  switch (level) {
    case 'Débutant':
      return 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-500/20';
    case 'Intermédiaire':
      return 'bg-blue-500/10 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-500/20';
    case 'Avancé':
      return 'bg-purple-500/10 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-500/20';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400 border border-gray-500/20';
  }
};

// Skeleton affiché uniquement au tout premier chargement (rien en cache)
const BookCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
    <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-800" />
    <div className="p-4 space-y-2">
      <div className="h-2 w-1/3 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="h-2 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
    </div>
  </div>
);

const Library = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>(booksCache || []);
  const [loading, setLoading] = useState(booksCache === null);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [likedBooks, setLikedBooks] = useState<Set<string>>(new Set());
  const [shareToast, setShareToast] = useState(false);
  const [readerCounts, setReaderCounts] = useState<Record<string, number>>(readerCountsCache);

  useEffect(() => {
    fetchBooks();
    if (user) {
      fetchLikedBooks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Debounce la recherche pour éviter de refiltrer à chaque frappe
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchBooks = async () => {
    // Skeleton uniquement si on n'a encore rien à montrer
    if (booksCache === null) {
      setLoading(true);
    }
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur:', error);
      } else {
        const nextBooks = data || [];
        booksCache = nextBooks;
        setBooks(nextBooks);

        // Si books.views est absent, on retombe sur le nombre de lecteurs par progression
        if (nextBooks.length > 0 && !nextBooks.every((book: any) => typeof book.views === 'number')) {
          const { data: progressData } = await supabase
            .from('book_progress')
            .select('book_id')
            .gte('progress_percent', 1);

          if (progressData) {
            const counts: Record<string, number> = {};
            progressData.forEach((row: { book_id: string }) => {
              counts[row.book_id] = (counts[row.book_id] || 0) + 1;
            });
            readerCountsCache = counts;
            setReaderCounts(counts);
          }
        }
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedBooks = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('book_likes')
        .select('book_id')
        .eq('user_id', user.id);

      if (error) throw error;
      if (data) {
        setLikedBooks(new Set(data.map((r: any) => r.book_id)));
      }
    } catch (err) {
      console.error('Error fetching liked books:', err);
    }
  };

  const toggleLike = async (bookId: string) => {
    if (!user) {
      window.location.assign(`/login?redirect=/library`);
      return;
    }

    const isLiked = likedBooks.has(bookId);

    setLikedBooks(prev => {
      const next = new Set(prev);
      if (next.has(bookId)) {
        next.delete(bookId);
      } else {
        next.add(bookId);
      }
      return next;
    });

    try {
      if (isLiked) {
        await supabase.from('book_likes').delete().eq('user_id', user.id).eq('book_id', bookId);
      } else {
        await supabase.from('book_likes').insert({ user_id: user.id, book_id: bookId });
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      fetchLikedBooks();
    }
  };

  const handleShare = async (book: Book, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/library/${book.id}`;
    if (navigator.share) {
      await navigator.share({ title: book.title, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    }
  };

  const filteredBooks = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return books.filter(book => {
      const matchesCategory = selectedCategory === 'Tous' || book.category === selectedCategory;
      const matchesSearch =
        !q || book.title.toLowerCase().includes(q) || book.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [books, selectedCategory, debouncedQuery]);

  const featuredBook =
    debouncedQuery === '' ? filteredBooks.find(b => b.is_bestseller) ?? filteredBooks[0] ?? null : null;
  const regularBooks = featuredBook ? filteredBooks.filter(b => b.id !== featuredBook.id) : filteredBooks;

  const BookCard = ({ book, featured = false }: { book: Book; featured?: boolean }) => {
    const isLiked = likedBooks.has(book.id);
    const readerCount = book.views ?? readerCounts[book.id] ?? 0;

    if (featured) {
      return (
        <div className="group relative bg-[var(--brand-midnight)] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-gold/20 mb-8 sm:mb-10 transition-all duration-300">
          {/* Background image decoration */}
          {book.cover_image && (
            <div className="absolute inset-0 pointer-events-none">
              <img src={book.cover_image} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-15 blur-[2px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-midnight)] via-[var(--brand-midnight)]/90 to-transparent" />
            </div>
          )}

          <div className="relative flex flex-col sm:flex-row gap-5 sm:gap-6 p-5 sm:p-6 md:p-8 lg:p-10 z-10 items-center sm:items-start">
            {/* Cover image */}
            <div className="w-32 sm:w-36 md:w-44 lg:w-48 aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:scale-102 transition-transform flex-shrink-0">
              {book.cover_image ? (
                <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-gold/60" />
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="flex flex-col justify-between flex-grow w-full min-w-0 text-center sm:text-left">
              <div>
                {/* Badges row */}
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-1.5 mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gold/10 border border-gold/30 text-gold text-[10px] sm:text-xs font-bold rounded-full whitespace-nowrap">
                    <Trophy className="w-3 h-3" /> BESTSELLER
                  </span>
                  {book.is_new && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-bold rounded-full whitespace-nowrap">
                      NOUVEAU
                    </span>
                  )}
                  {book.level && (
                    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap ${getLevelColor(book.level)}`}>
                      {book.level}
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mb-2 leading-snug sm:leading-tight tracking-tight group-hover:text-gold transition-colors line-clamp-2">
                  {book.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4 line-clamp-2 sm:line-clamp-3">
                  {book.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-4 gap-y-2 sm:gap-4 mb-5 sm:mb-6 justify-items-center sm:justify-items-start">
                  <div className="flex items-center gap-1.5 text-gray-300 text-[11px] sm:text-xs font-medium">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold fill-gold flex-shrink-0" />
                    <span>Note : {book.rating || 4.8} / 5</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300 text-[11px] sm:text-xs font-medium">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                    <span>{readerCount} lecteur{readerCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300 text-[11px] sm:text-xs font-medium">
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 flex-shrink-0" />
                    <span>{((book as any).downloads || 0).toLocaleString()} téléch.</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300 text-[11px] sm:text-xs font-medium">
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
                    <span>{book.pages || 50} pages</span>
                  </div>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 order-1 sm:order-none">
                  <span className="text-sm font-extrabold text-gold whitespace-nowrap">
                    {book.price === 0 ? 'Gratuit' : `${book.price || '1000'} FCFA`}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto order-2 sm:order-none">
                  <Link
                    to={`/library/${book.id}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-midnight font-black py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all shadow-lg active:scale-95 text-xs sm:text-sm whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                    Voir le livre
                  </Link>
                  {book.buy_url && (
                    
                      <a href={book.buy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 border border-white/20 hover:border-white/40 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl transition-all text-xs sm:text-sm whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Acheter
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        to={`/library/${book.id}`}
        className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-gold/30 flex flex-col h-full cursor-pointer"
      >
        {/* Cover */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          {book.cover_image ? (
            <img
              src={book.cover_image}
              alt={book.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--brand-midnight)] to-blue-950 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* New / Bestseller labels */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {book.is_bestseller && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded shadow-sm">
                BESTSELLER
              </span>
            )}
            {book.is_new && (
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded shadow-sm">
                NOUVEAU
              </span>
            )}
          </div>

          {/* Like / Share */}
          <div className="absolute bottom-2 right-2 flex gap-1.5 z-10">
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                toggleLike(book.id);
              }}
              className={`p-2 rounded-xl shadow transition-all active:scale-95 ${
                isLiked ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-gray-900/90 text-gray-700 hover:text-red-500'
              }`}
              aria-label={isLiked ? 'Retirer des favoris' : 'Sauvegarder'}
              aria-pressed={isLiked}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleShare(book, e);
              }}
              className="p-2 bg-white/90 dark:bg-gray-900/90 text-gray-700 rounded-xl shadow hover:bg-gold hover:text-midnight transition-all active:scale-95"
              aria-label="Partager"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Price badge under image */}
        <div className="w-full px-3 sm:px-4 mt-2 text-center">
          <span className="bg-white/5 border border-white/10 text-gold text-[11px] sm:text-sm font-extrabold px-2.5 sm:px-3 py-0.5 rounded-full shadow-sm inline-block">
            {book.price === 0 ? 'Gratuit' : `${book.price} FCFA`}
          </span>
        </div>

        {/* Info panel */}
        <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
              <span className="text-[9px] uppercase tracking-wider text-gold font-bold truncate">
                {book.category || 'Guide'}
              </span>
              {book.level && (
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded flex-shrink-0 ${getLevelColor(book.level)}`}>
                  {book.level}
                </span>
              )}
            </div>

            <h3 className="text-[13px] sm:text-base font-bold text-midnight dark:text-white mb-1.5 leading-snug line-clamp-2 sm:line-clamp-1 group-hover:text-gold transition-colors">
              {book.title}
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs line-clamp-2 mb-3 leading-relaxed">
              {book.description}
            </p>
          </div>

          <div>
            {/* Stats row */}
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 mb-3 pb-2.5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1 font-bold text-gray-700 dark:text-white">
                <Star className="w-3 h-3 text-gold fill-gold" />
                <span>{book.rating || 4.8}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-400" />
                <span>{readerCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3 text-gray-500" />
                <span>{((book as any).downloads || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-emerald-400" />
                <span>{book.pages || 50}p</span>
              </div>
            </div>

            {/* CTA */}
            <span className="flex items-center justify-center gap-1 bg-[var(--brand-midnight)] hover:bg-[var(--brand-midnight-dark)] text-[var(--brand-gold)] font-bold py-1.5 px-3 rounded-lg transition-all text-[10px]">
              <Play className="w-3 h-3 fill-current" /> Voir le livre
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] dark:bg-gray-950 pb-20 sm:pb-8 font-poppins">
      {/* Toast */}
      {shareToast && (
        <div
          role="status"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[var(--brand-midnight)] text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-1.5"
        >
          <span>Lien copié dans le presse-papiers</span>
        </div>
      )}

      {/* Hero */}
      <section className="relative text-white pt-20 sm:pt-24 pb-10 sm:pb-16 overflow-hidden bg-[var(--brand-midnight)]">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600 rounded-full blur-[100px]" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 bg-gold/10 rounded-full border border-gold/30">
            <BookOpen className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] font-bold text-gold uppercase tracking-wider">BIBLIOTHÈQUE MIDEESSI</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black mb-3 leading-tight tracking-tight">
            Accélérez vos <span className="text-gold">Compétences</span>
          </h1>
          <p className="text-xs sm:text-base text-gray-300 mb-2 max-w-xl mx-auto px-2">
            Découvrez nos guides pratiques et ebooks thématiques optimisés pour votre apprentissage.
          </p>
          <p className="text-[10px] sm:text-xs text-gray-400 mb-6 sm:mb-8">
            Fichiers PDF accessibles immédiatement • Mises à jour incluses
          </p>

          {/* Quick metrics */}
          <div className="flex justify-center gap-6 sm:gap-8 max-w-md mx-auto border-t border-white/10 pt-5 sm:pt-6">
            {[
              { value: books.length || '12', label: 'Ressources' },
              { value: '4.8 / 5', label: 'Satisfaction' },
              { value: '500+', label: 'Lecteurs' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-base sm:text-xl font-black text-gold">{stat.value}</div>
                <div className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter bar */}
      <section className="sticky top-16 z-30 bg-white/95 dark:bg-gray-950/95 border-b border-[var(--border)] shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, mot-clé..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-gold text-xs font-medium placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              <Filter className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gold text-midnight shadow'
                      : 'bg-[var(--bg-surface)] border border-[var(--border)] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <section className="py-8 sm:py-10 max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white dark:bg-gray-900 border border-[var(--border)] rounded-3xl shadow-sm">
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-base font-bold text-midnight dark:text-white mb-1.5">Aucune ressource trouvée</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto px-4">
              {searchQuery ? "Votre recherche n'a retourné aucun résultat." : 'Les guides et PDF arrivent très prochainement.'}
            </p>
          </div>
        ) : (
          <>
            {/* Spotlight */}
            {featuredBook && (
              <div className="mb-8 sm:mb-10">
                <div className="flex items-center gap-1.5 mb-4">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">A la Une</h2>
                </div>
                <BookCard book={featuredBook} featured />
              </div>
            )}

            {/* Grid */}
            {regularBooks.length > 0 && (
              <div>
                {featuredBook && (
                  <div className="flex items-center gap-1.5 mb-4 sm:mb-5 pb-2.5 border-b border-[var(--border)]">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tous nos guides</h2>
                    <span className="ml-auto text-[10px] font-bold bg-[var(--bg-surface)] border border-[var(--border)] px-2 py-0.5 rounded text-gray-500">
                      {regularBooks.length} ressources
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {(searchQuery !== '' || !featuredBook ? filteredBooks : regularBooks).map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <PopupDisplay currentPage="library" />
    </div>
  );
};

export default Library;