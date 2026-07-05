import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  BookOpen, LogOut, Heart, Search, BookOpenCheck, Clock, Bookmark, 
  Download, ChevronRight, BookOpen as BookIcon, Star, Users, 
  FileText, Sparkles, Plus, Share2, Eye, X, BookMarked, Play
} from 'lucide-react';
import SEO from '../components/SEO';
import PdfReader from '../components/PdfReader';

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
  pdf_url?: string;
  buy_url?: string;
  created_at?: string;
}

interface BookLikeJoin {
  book_id: string;
  books: Book | null;
}

type ReadingStatus = 'to-read' | 'reading' | 'completed';

export default function MyLibrary() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [likedBooks, setLikedBooks] = useState<Book[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReadingStatus>('all');
  const [readingStatuses, setReadingStatuses] = useState<Record<string, ReadingStatus>>({});
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [readingPdfUrl, setReadingPdfUrl] = useState<string | null>(null);
  const [readingPdfTitle, setReadingPdfTitle] = useState('');
  const [progressions, setProgressions] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Time-based greeting helper
  const [greeting, setGreeting] = useState('Bienvenue');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 18) {
      setGreeting('Bonjour');
    } else {
      setGreeting('Bonsoir');
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchLibrary();
    loadReadingStatuses();
  }, [user, navigate]);

  // Load study notes for currently selected book
  useEffect(() => {
    if (selectedBook) {
      const dbNote = notes[selectedBook.id] || '';
      setNoteText(dbNote);
    }
  }, [selectedBook, notes]);

  const handleSaveNote = (text: string) => {
    if (!selectedBook || !user) return;
    setNoteText(text);
    
    // Update local state first
    setNotes(prev => ({ ...prev, [selectedBook.id]: text }));

    // Debounce save to Supabase (500ms delay)
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await supabase.from('book_progress').upsert({
          book_id: selectedBook.id,
          user_id: user.id,
          study_notes: text,
          last_read_at: new Date().toISOString()
        }, { onConflict: 'book_id,user_id' });
      } catch (err) {
        console.error('Error saving study notes to Supabase:', err);
      }
    }, 500);
  };

  const loadReadingStatuses = () => {
    if (!user) return;
    try {
      const saved = localStorage.getItem(`reading_status_${user.id}`);
      if (saved) {
        setReadingStatuses(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error loading reading statuses:', err);
    }
  };

  const updateReadingStatus = (bookId: string, status: ReadingStatus) => {
    if (!user) return;
    const updated = { ...readingStatuses, [bookId]: status };
    setReadingStatuses(updated);
    localStorage.setItem(`reading_status_${user.id}`, JSON.stringify(updated));
  };

  const fetchLibrary = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const [{ data: profileData }, { data: likesData, error: likesError }] = await Promise.all([
        supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single(),
        supabase
          .from('book_likes')
          .select('book_id, books(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (profileData) {
        setUsername(profileData.username || user.email || null);
      }

      if (likesError) {
        throw likesError;
      }

      const books = (likesData || [])
        .map((item: BookLikeJoin) => item.books)
        .filter((book): book is Book => Boolean(book));

      setLikedBooks(books);
      if (books.length > 0) {
        setSelectedBook(books[0]);
      }

      // Récupérer la progression réelle et les notes pour chaque livre de l'utilisateur
      const { data: progressData } = await supabase
        .from('book_progress')
        .select('book_id, progress_percent, study_notes')
        .eq('user_id', user.id);

      if (progressData) {
        const progMap: Record<string, number> = {};
        const noteMap: Record<string, string> = {};
        progressData.forEach((p: any) => {
          progMap[p.book_id] = Number(p.progress_percent || 0);
          noteMap[p.book_id] = p.study_notes || '';
        });
        setProgressions(progMap);
        setNotes(noteMap);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger votre bibliothèque');
      console.error('Erreur MyLibrary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    navigate('/');
  };

  const getStatusLabel = (status: ReadingStatus) => {
    switch (status) {
      case 'to-read': return 'À lire';
      case 'reading': return 'En cours';
      case 'completed': return 'Terminé';
    }
  };

  const getStatusColor = (status: ReadingStatus) => {
    switch (status) {
      case 'to-read': return 'text-gray-400 bg-gray-100 dark:bg-gray-800';
      case 'reading': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400';
      case 'completed': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400';
    }
  };

  const getProgressPercentage = (bookId: string, status: ReadingStatus) => {
    if (progressions[bookId] !== undefined) {
      return progressions[bookId];
    }
    switch (status) {
      case 'to-read': return 0;
      case 'reading': return 0;
      case 'completed': return 100;
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'Débutant': return 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-500/20';
      case 'Intermédiaire': return 'bg-blue-500/10 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-500/20';
      case 'Avancé': return 'bg-purple-500/10 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400 border border-gray-500/20';
    }
  };

  const shareBook = (book: Book) => {
    const url = `${window.location.origin}/library/${book.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(book.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredBooks = likedBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (book.category && book.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const bookStatus = readingStatuses[book.id] || 'to-read';
    const matchesStatus = statusFilter === 'all' || bookStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalReading = likedBooks.filter(b => readingStatuses[b.id] === 'reading').length;
  const totalCompleted = likedBooks.filter(b => readingStatuses[b.id] === 'completed').length;

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setIsMobileDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] pb-16">
      <SEO
        title="Ma Bibliothèque | MIDEESSI"
        description="Accédez à vos ebooks préférés, vos PDF sauvegardés et votre espace personnel MIDEESSI."
      />

      {/* Header */}
      <header className="relative bg-[var(--brand-midnight)] text-white pt-20 pb-8 sm:pt-24 sm:pb-10 border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-[var(--brand-gold)]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/20 text-[var(--brand-gold)] text-[9px] font-black uppercase tracking-wider">
                <Sparkles size={10} />
                <span>Mon Espace Étude</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Ma Bibliothèque
              </h1>
              <p className="text-xs sm:text-sm text-gray-300/80 max-w-lg leading-relaxed font-light">
                Retrouvez vos ebooks likés, continuez votre lecture et prenez des notes.
              </p>
            </div>

            <div className="flex flex-row gap-2 w-full md:w-auto">
              <Link
                to="/library"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-midnight)] px-4 py-2 font-black text-xs hover:opacity-90 transition-opacity shadow-lg"
              >
                <BookIcon size={12} /> Parcourir
              </Link>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 border border-white/20 text-white px-4 py-2 font-bold text-xs hover:bg-white/15 transition-all"
              >
                <LogOut size={12} /> Déconnexion
              </button>
            </div>
          </div>

          {/* Stats shelf - Responsive columns */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {[
              { label: greeting, value: username || user?.email?.split('@')[0] || '—', sub: 'Espace MIDEESSI', isName: true },
              { label: 'Livres likés', value: likedBooks.length.toString(), sub: 'Collection', isName: false },
              { label: 'En cours', value: totalReading.toString(), sub: 'Lectures', isName: false },
              { label: 'Terminés', value: totalCompleted.toString(), sub: 'Lectures terminées', isName: false },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-xl bg-white/5 border border-white/8 p-3 sm:p-4 hover:bg-white/8 hover:border-[var(--brand-gold)]/25 transition-all"
              >
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">{card.label}</span>
                <p className={`mt-0.5 font-black text-white truncate ${card.isName ? 'text-sm sm:text-base' : 'text-xl sm:text-2xl text-[var(--brand-gold)]'}`}>
                  {card.value}
                </p>
                <p className="text-[9px] text-gray-400 mt-0.5">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl text-xs text-red-600 dark:text-red-400 font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel: Filters & Search */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search */}
            <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-4 shadow-sm">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Titre, thème..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--brand-gold)] dark:text-white transition-colors"
                />
              </div>
            </div>

            {/* Folders - Horizontal scroll on mobile, vertical stack on desktop */}
            <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-4 shadow-sm">
              <label className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Mes dossiers</label>
              <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 lg:flex-col lg:overflow-x-visible lg:gap-1 scrollbar-none">
                {[
                  { id: 'all', label: 'Tout', count: likedBooks.length, icon: BookOpen },
                  { id: 'to-read', label: 'À lire', count: likedBooks.filter(b => (readingStatuses[b.id] || 'to-read') === 'to-read').length, icon: Bookmark },
                  { id: 'reading', label: 'En cours', count: totalReading, icon: Clock },
                  { id: 'completed', label: 'Terminés', count: totalCompleted, icon: BookOpenCheck },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setStatusFilter(tab.id as any); setSelectedBook(likedBooks[0] || null); }}
                    className={`flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 lg:w-full lg:flex-shrink-0 lg:whitespace-normal ${
                      statusFilter === tab.id
                        ? 'bg-[var(--brand-midnight)] text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-[var(--bg-surface)] bg-gray-50 dark:bg-gray-800 lg:bg-transparent lg:dark:bg-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <tab.icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center panel: Book List */}
          <div className="lg:col-span-5 flex flex-col">
            {loading ? (
              <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                <div className="mb-3 h-8 w-8 rounded-full border-2 border-[var(--brand-gold)] border-t-transparent animate-spin" />
                <p className="text-xs font-semibold text-gray-400">Chargement de votre bibliothèque...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-12 h-12 rounded-full bg-[var(--brand-gold)]/10 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-5 h-5 text-[var(--brand-gold)]" />
                </div>
                <h3 className="text-xs font-bold text-[var(--brand-midnight)] dark:text-white">Votre espace est vide</h3>
                <p className="text-[10px] text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  Découvrez les ebooks MIDEESSI et cliquez sur le cœur pour les ajouter ici.
                </p>
                <Link
                  to="/library"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand-midnight)] text-[var(--brand-gold)] font-black text-[10px] px-4 py-2 hover:opacity-90 transition-opacity shadow-sm"
                >
                  <Plus size={12} /> Explorer la bibliothèque
                </Link>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl shadow-sm divide-y divide-[var(--border)]">
                <div className="overflow-y-auto max-h-[500px] lg:max-h-[580px] divide-y divide-[var(--border)] scrollbar-thin">
                  {filteredBooks.map((book) => {
                    const status = readingStatuses[book.id] || 'to-read';
                    const isSelected = selectedBook?.id === book.id;
                    const progress = getProgressPercentage(book.id, status);

                    return (
                      <div
                        key={book.id}
                        onClick={() => handleBookSelect(book)}
                        className={`w-full text-left p-3.5 flex items-start gap-3.5 cursor-pointer group transition-colors ${
                          isSelected
                            ? 'bg-[var(--brand-midnight)]/4 dark:bg-[var(--brand-gold)]/5'
                            : 'hover:bg-[var(--bg-surface)]'
                        }`}
                      >
                        <div className="w-11 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 shadow-sm">
                          {book.cover_image ? (
                            <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[var(--brand-midnight)] flex items-center justify-center">
                              <BookIcon className="w-4 h-4 text-[var(--brand-gold)]/50" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-grow min-w-0 space-y-1">
                          <div>
                            <span className="text-[8px] uppercase tracking-wider text-[var(--brand-gold)] font-bold">
                              {book.category || 'Ebook'}
                            </span>
                            <h4 className={`text-xs font-black truncate transition-colors ${isSelected ? 'text-[var(--brand-midnight)] dark:text-[var(--brand-gold)]' : 'text-[var(--brand-midnight)] dark:text-white group-hover:text-[var(--brand-gold)]'}`}>
                              {book.title}
                            </h4>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-0.5">
                            <div className="flex items-center justify-between text-[8px] text-gray-400">
                              <span>Progression</span>
                              <span className="font-semibold">{progress}%</span>
                            </div>
                            <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  progress === 100
                                    ? 'bg-emerald-500'
                                    : progress > 0
                                    ? 'bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400'
                                    : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 pt-0.5">
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${getLevelColor(book.level)}`}>
                              {book.level || 'Général'}
                            </span>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${getStatusColor(status)}`}>
                              {getStatusLabel(status)}
                            </span>
                          </div>
                        </div>
                        
                        <ChevronRight className={`w-3.5 h-3.5 self-center flex-shrink-0 transition-colors ${isSelected ? 'text-[var(--brand-gold)]' : 'text-gray-300'}`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right panel: Details & Study Notes */}
          <div className="hidden lg:block lg:col-span-4">
            {selectedBook ? (
              <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl shadow-sm sticky top-24 overflow-hidden">
                {/* Cover banner */}
                <div className="relative h-44 bg-[var(--brand-midnight)] overflow-hidden">
                  {selectedBook.cover_image ? (
                    <img
                      src={selectedBook.cover_image}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover opacity-60"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--brand-midnight)] via-blue-950 to-slate-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-midnight)] via-transparent to-transparent" />

                  <div className="absolute bottom-3 left-4">
                    <span className="px-2.5 py-1 bg-[var(--brand-gold)] text-[var(--brand-midnight)] text-[9px] font-black uppercase tracking-wider rounded-lg shadow">
                      {selectedBook.category || 'Ebook'}
                    </span>
                  </div>

                  <button
                    onClick={() => shareBook(selectedBook)}
                    className="absolute top-3 right-3 p-2 bg-black/30 hover:bg-black/50 border border-white/10 rounded-lg text-white transition-all backdrop-blur-sm"
                    title="Copier le lien"
                  >
                    <Share2 size={12} />
                  </button>
                  {copiedId === selectedBook.id && (
                    <span className="absolute top-3 right-14 px-2 py-1 bg-emerald-500 text-white text-[9px] font-bold rounded-lg shadow">
                      Lien copié !
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-[var(--brand-midnight)] dark:text-white leading-snug">
                      {selectedBook.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded ${getLevelColor(selectedBook.level)}`}>
                        {selectedBook.level || 'Tous niveaux'}
                      </span>
                      {selectedBook.pages && (
                        <span className="text-[9px] text-gray-400 font-semibold">{selectedBook.pages} pages</span>
                      )}
                      {selectedBook.rating && (
                        <span className="flex items-center gap-0.5 text-[9px] text-yellow-500 font-bold">
                          <Star size={9} className="fill-yellow-500" /> {selectedBook.rating}/5
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {selectedBook.description}
                  </p>

                  {/* Progress */}
                  {(() => {
                    const status = readingStatuses[selectedBook.id] || 'to-read';
                    const progress = getProgressPercentage(selectedBook.id, status);
                    return (
                      <div className="space-y-1.5 p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)]">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-[var(--brand-midnight)] dark:text-white">Progression de lecture</span>
                          <span className="font-black text-[var(--brand-gold)]">{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              progress === 100
                                ? 'bg-emerald-500'
                                : 'bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400'
                            }`}
                            style={{ width: `${Math.max(progress, 0)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-[var(--brand-midnight)] dark:text-white">
                      <FileText size={13} className="text-[var(--brand-gold)]" />
                      <span>Mes Notes d'Études</span>
                    </div>
                    <textarea
                      placeholder="Notez vos idées, questions ou résumés de ce livre..."
                      value={noteText}
                      onChange={(e) => handleSaveNote(e.target.value)}
                      rows={4}
                      className="w-full p-3 text-xs bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--brand-gold)] text-[var(--brand-midnight)] dark:text-white resize-none transition-colors"
                    />
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</span>
                      <select
                        value={readingStatuses[selectedBook.id] || 'to-read'}
                        onChange={(e) => updateReadingStatus(selectedBook.id, e.target.value as ReadingStatus)}
                        className="bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-bold rounded-lg px-2.5 py-1.5 text-[var(--brand-midnight)] dark:text-white focus:outline-none focus:border-[var(--brand-gold)] transition-colors"
                      >
                        <option value="to-read">À lire</option>
                        <option value="reading">En cours</option>
                        <option value="completed">Terminé</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/library/${selectedBook.id}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-bold py-2.5 transition-colors text-[var(--brand-midnight)] dark:text-white"
                      >
                        <Eye size={13} /> Fiche
                      </Link>
                      {selectedBook.pdf_url ? (
                        <button
                          onClick={() => {
                            setReadingPdfUrl(selectedBook.pdf_url!);
                            setReadingPdfTitle(selectedBook.title);
                          }}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--brand-midnight)] text-[var(--brand-gold)] hover:opacity-90 text-xs font-black py-2.5 transition-opacity shadow-sm"
                        >
                          <Play size={12} className="fill-current" /> Lire PDF
                        </button>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs font-bold py-2.5 cursor-not-allowed"
                        >
                          Bientôt
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-8 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px] sticky top-24">
                <div className="w-12 h-12 rounded-full bg-[var(--brand-midnight)]/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <BookMarked className="w-5 h-5 text-[var(--brand-gold)]" />
                </div>
                <h3 className="text-sm font-bold text-[var(--brand-midnight)] dark:text-white">Sélectionnez un document</h3>
                <p className="text-[10px] text-gray-400 max-w-xs mt-2 leading-relaxed">
                  Cliquez sur un livre pour voir ses détails, lire le PDF et ajouter vos notes.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Mobile Details Bottom Sheet */}
      {isMobileDetailOpen && selectedBook && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 lg:hidden"
          onClick={(e) => { if (e.target === e.currentTarget) setIsMobileDetailOpen(false); }}
        >
          <div className="bg-white dark:bg-gray-900 w-full max-h-[88vh] rounded-t-3xl p-5 overflow-y-auto space-y-4 shadow-2xl border-t border-[var(--border)]">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[10px] font-black uppercase text-[var(--brand-gold)] tracking-widest">
                Détails du document
              </span>
              <button 
                onClick={() => setIsMobileDetailOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400"
              >
                <X size={16} />
              </button>
            </div>

            {/* Book info */}
            <div className="flex gap-4 items-start">
              <div className="w-14 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 shadow-sm">
                {selectedBook.cover_image ? (
                  <img src={selectedBook.cover_image} alt={selectedBook.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[var(--brand-midnight)] flex items-center justify-center">
                    <BookIcon className="w-5 h-5 text-[var(--brand-gold)]/50" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] uppercase tracking-wider text-[var(--brand-gold)] font-bold block">
                  {selectedBook.category || 'Ebook'}
                </span>
                <h3 className="text-sm font-black text-[var(--brand-midnight)] dark:text-white leading-snug">
                  {selectedBook.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded ${getLevelColor(selectedBook.level)}`}>
                    {selectedBook.level || 'Tous niveaux'}
                  </span>
                  {copiedId === selectedBook.id && (
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">Lien copié !</span>
                  )}
                </div>
              </div>
            </div>

            {/* Progress */}
            {(() => {
              const status = readingStatuses[selectedBook.id] || 'to-read';
              const progress = getProgressPercentage(selectedBook.id, status);
              return progress > 0 ? (
                <div className="space-y-1.5 p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)]">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[var(--brand-midnight)] dark:text-white">Progression</span>
                    <span className="font-black text-[var(--brand-gold)]">{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : null;
            })()}

            {/* Description */}
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
              {selectedBook.description}
            </p>

            {/* Mobile Study Notes */}
            <div className="space-y-2 pt-1 border-t border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-xs font-black text-[var(--brand-midnight)] dark:text-white pt-1">
                <FileText size={13} className="text-[var(--brand-gold)]" />
                <span>Mes Notes d'Études</span>
              </div>
              <textarea
                placeholder="Notez vos résumés ou points clés..."
                value={noteText}
                onChange={(e) => handleSaveNote(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--brand-gold)] text-[var(--brand-midnight)] dark:text-white resize-none transition-colors"
              />
            </div>

            {/* Actions & Status */}
            <div className="pt-2 border-t border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</span>
                <select
                  value={readingStatuses[selectedBook.id] || 'to-read'}
                  onChange={(e) => updateReadingStatus(selectedBook.id, e.target.value as ReadingStatus)}
                  className="bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-bold rounded-lg px-2.5 py-1.5 text-[var(--brand-midnight)] dark:text-white focus:outline-none"
                >
                  <option value="to-read">À lire</option>
                  <option value="reading">En cours</option>
                  <option value="completed">Terminé</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => shareBook(selectedBook)}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-xs font-bold py-2.5 transition-colors text-[var(--brand-midnight)] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Share2 size={12} /> Partager
                </button>
                <Link
                  to={`/library/${selectedBook.id}`}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-xs font-bold py-2.5 transition-colors text-[var(--brand-midnight)] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Eye size={12} /> Fiche
                </Link>
                {selectedBook.pdf_url ? (
                  <button
                    onClick={() => {
                      setReadingPdfUrl(selectedBook.pdf_url!);
                      setReadingPdfTitle(selectedBook.title);
                      setIsMobileDetailOpen(false);
                    }}
                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-[var(--brand-midnight)] text-[var(--brand-gold)] text-xs font-black py-2.5 transition-opacity hover:opacity-90 shadow-sm"
                  >
                    <Play size={11} className="fill-current" /> PDF
                  </button>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs font-bold py-2.5 cursor-not-allowed"
                  >
                    Bientôt
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Reader Modal */}
      {readingPdfUrl && (
        <PdfReader
          pdfUrl={readingPdfUrl}
          title={readingPdfTitle}
          modal
          onClose={() => {
            setReadingPdfUrl(null);
            fetchLibrary(); // Recharger pour afficher la progression mise à jour
          }}
        />
      )}
    </div>
  );
}
