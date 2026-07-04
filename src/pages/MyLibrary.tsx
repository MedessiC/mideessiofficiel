import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  BookOpen, LogOut, Heart, Search, BookOpenCheck, Clock, Bookmark, 
  Download, ChevronRight, BookOpen as BookIcon, Star, Users, 
  FileText, Sparkles, Plus, Share2, Eye, X, BookMarked
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

  // Load and Save book notes from localStorage
  useEffect(() => {
    if (selectedBook && user) {
      const savedNote = localStorage.getItem(`book_note_${user.id}_${selectedBook.id}`) || '';
      setNoteText(savedNote);
    }
  }, [selectedBook, user]);

  const handleSaveNote = (text: string) => {
    if (!selectedBook || !user) return;
    setNoteText(text);
    localStorage.setItem(`book_note_${user.id}_${selectedBook.id}`, text);
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

  const getProgressPercentage = (status: ReadingStatus) => {
    switch (status) {
      case 'to-read': return 0;
      case 'reading': return 45;
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

  const totalCategories = new Set(likedBooks.map((book) => book.category).filter(Boolean)).size;
  const totalReading = likedBooks.filter(b => readingStatuses[b.id] === 'reading').length;
  const totalCompleted = likedBooks.filter(b => readingStatuses[b.id] === 'completed').length;

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setIsMobileDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] dark:bg-gray-950 text-[var(--text-primary)] font-poppins selection:bg-gold selection:text-midnight pb-12">
      <SEO
        title="Ma Bibliothèque | MIDEESSI"
        description="Accédez à vos ebooks préférés, vos PDF sauvegardés et votre espace personnel MIDEESSI."
      />

      {/* Modern Glassmorphic Header */}
      <header className="relative overflow-hidden bg-[var(--brand-midnight)] text-white py-12 sm:py-16 border-b border-white/5 shadow-2xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <Sparkles size={12} className="animate-spin-slow" />
                <span>Mon Espace Étude</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-gold bg-clip-text text-transparent">
                Ma Bibliothèque
              </h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed font-light">
                Retrouvez vos PDF likés, vos ressources favorites et continuez votre apprentissage avec MIDEESSI.
              </p>
            </div>

            <div className="flex flex-row gap-3 w-full md:w-auto">
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-white text-midnight px-5 py-3.5 font-bold text-xs hover:bg-gray-100 transition-all shadow-lg active:scale-95 duration-200"
              >
                <LogOut size={14} /> <span>Se déconnecter</span>
              </button>
              <Link
                to="/library"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 text-white px-5 py-3.5 font-bold text-xs hover:bg-white/20 transition-all backdrop-blur-md"
              >
                <BookIcon size={14} /> <span>Parcourir</span>
              </Link>
            </div>
          </div>

          {/* Metrics Shelf - Mobile Friendly Grid */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card: Welcome */}
            <div className="group rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5 shadow-lg backdrop-blur-md transition-all hover:bg-white/[0.08] hover:border-gold/30">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{greeting}</span>
              <h2 className="text-base sm:text-xl font-black text-white truncate mt-1 group-hover:text-gold transition-colors">
                {username || user?.email?.split('@')[0]}
              </h2>
              <p className="mt-2 text-[10px] sm:text-xs text-gray-400 leading-normal">
                Votre espace personnel MIDEESSI.
              </p>
            </div>

            {/* Card: Liked Books */}
            <div className="group rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5 shadow-lg backdrop-blur-md transition-all hover:bg-white/[0.08] hover:border-gold/30">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">LIVRES LIKÉS</span>
              <p className="text-2xl sm:text-3xl font-black text-gold mt-1">
                {likedBooks.length}
              </p>
              <p className="mt-2 text-[10px] sm:text-xs text-gray-400 leading-normal">
                Ressources que vous avez ajoutées à votre bibliothèque.
              </p>
            </div>

            {/* Card: Categories */}
            <div className="group rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5 shadow-lg backdrop-blur-md transition-all hover:bg-white/[0.08] hover:border-gold/30">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">CATÉGORIES</span>
              <p className="text-2xl sm:text-3xl font-black text-gold mt-1">
                {totalCategories}
              </p>
              <p className="mt-2 text-[10px] sm:text-xs text-gray-400 leading-normal">
                Thèmes différents dans votre collection.
              </p>
            </div>

            {/* Card: Quick Action */}
            <div className="group rounded-2xl bg-gradient-to-br from-gold/10 to-transparent border border-gold/30 p-4 sm:p-5 shadow-lg backdrop-blur-md transition-all hover:from-gold/20 hover:border-gold/50">
              <span className="text-[10px] font-bold text-gold uppercase tracking-widest block">ACTION RAPIDE</span>
              <button 
                onClick={() => navigate('/library')}
                className="mt-2 inline-flex items-center gap-1 text-xs font-black text-white hover:text-gold transition-colors"
              >
                <Plus size={14} className="text-gold" /> Ajouter des PDFs
              </button>
              <p className="mt-2 text-[10px] sm:text-xs text-gray-400 leading-normal">
                Explorez la bibliothèque publique et ajoutez-en.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Filters & Search */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-4 shadow-md transition-all hover:shadow-lg">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, thème..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-gold dark:text-white"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-4 shadow-md space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Mes Dossiers</label>
              {[
                { id: 'all', label: 'Toutes les ressources', count: likedBooks.length, icon: BookOpen },
                { id: 'to-read', label: 'À lire', count: likedBooks.filter(b => (readingStatuses[b.id] || 'to-read') === 'to-read').length, icon: Bookmark },
                { id: 'reading', label: 'En cours', count: totalReading, icon: Clock },
                { id: 'completed', label: 'Terminés', count: totalCompleted, icon: BookOpenCheck }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setStatusFilter(tab.id as any); setSelectedBook(likedBooks[0] || null); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === tab.id
                      ? 'bg-[var(--brand-midnight)] text-white shadow-lg shadow-blue-900/10'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-[var(--bg-surface)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Center panel: Book List */}
          <div className="lg:col-span-5 flex flex-col">
            {loading ? (
              <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-12 text-center shadow-md h-full flex flex-col items-center justify-center min-h-[350px]">
                <div className="mb-3 h-10 w-10 rounded-full border-4 border-gold border-t-transparent animate-spin" />
                <p className="text-xs font-bold text-gray-500">Chargement de votre bibliothèque...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-12 text-center shadow-md h-full flex flex-col items-center justify-center min-h-[350px]">
                <Heart className="w-12 h-12 text-gold/30 mb-4 animate-bounce" />
                <h3 className="text-sm sm:text-base font-bold text-midnight dark:text-white">Votre espace est vide</h3>
                <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">
                  Découvrez les ebooks et documents MIDEESSI puis cliquez sur le cœur pour les ajouter ici.
                </p>
                <Link
                  to="/library"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gold text-midnight font-bold text-xs px-5 py-2.5 hover:bg-yellow-400 transition-all shadow-md"
                >
                  <Plus size={14} /> Explorer
                </Link>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-4 shadow-md flex-grow overflow-y-auto max-h-[600px] space-y-3">
                {filteredBooks.map((book) => {
                  const status = readingStatuses[book.id] || 'to-read';
                  const isSelected = selectedBook?.id === book.id;
                  const progress = getProgressPercentage(status);

                  return (
                    <div
                      key={book.id}
                      onClick={() => handleBookSelect(book)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-4 cursor-pointer group ${
                        isSelected
                          ? 'bg-gold/5 border-gold/70 shadow-sm'
                          : 'bg-[var(--bg-surface)] border-transparent hover:border-gold/30 hover:shadow-sm'
                      }`}
                    >
                      <div className="w-12 h-16 sm:w-14 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200/50 shadow-sm transition-transform group-hover:scale-105">
                        {book.cover_image ? (
                          <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-midnight flex items-center justify-center">
                            <BookIcon className="w-6 h-6 text-white/40" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow min-w-0 space-y-1.5">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-gold font-bold">
                            {book.category || 'Ebook'}
                          </span>
                          <h4 className="text-xs sm:text-sm font-black text-midnight dark:text-white truncate group-hover:text-gold transition-colors">
                            {book.title}
                          </h4>
                        </div>

                        {/* Progress Bar Mini */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[9px] text-gray-400">
                            <span>Progression</span>
                            <span className="font-semibold">{progress}%</span>
                          </div>
                          <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 rounded-full ${
                                progress === 100 ? 'bg-emerald-500' : progress > 0 ? 'bg-blue-500' : 'bg-gray-300'
                              }`} 
                              style={{ width: `${progress}%` }} 
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-0.5">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${getLevelColor(book.level)}`}>
                            {book.level || 'Général'}
                          </span>
                          <span className="text-[9px] text-gray-400 font-semibold bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                            {getStatusLabel(status)}
                          </span>
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-gray-400 self-center group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right panel: Details & Study Notes (Hidden on mobile unless selected) */}
          <div className="hidden lg:block lg:col-span-4 h-full">
            {selectedBook ? (
              <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-5 shadow-md flex flex-col h-full sticky top-6">
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm border border-gray-200/50">
                    {selectedBook.cover_image ? (
                      <img src={selectedBook.cover_image} alt={selectedBook.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--brand-midnight)] to-blue-950 flex items-center justify-center">
                        <BookIcon className="w-12 h-12 text-white/30 animate-pulse" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      <button 
                        onClick={() => shareBook(selectedBook)}
                        className="p-2 bg-white/90 dark:bg-gray-950/80 hover:bg-white rounded-lg shadow transition-all text-midnight dark:text-white"
                        title="Copier le lien"
                      >
                        <Share2 size={12} />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 bg-gold text-midnight text-[9px] font-black uppercase tracking-wider rounded-lg shadow">
                        {selectedBook.category || 'Guide'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-midnight dark:text-white leading-snug">
                      {selectedBook.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded ${getLevelColor(selectedBook.level)}`}>
                        {selectedBook.level || 'Tous niveaux'}
                      </span>
                      {copiedId === selectedBook.id && (
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">Lien copié !</span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed dark:text-gray-400">
                    {selectedBook.description}
                  </p>

                  {/* Study Notes Feature */}
                  <div className="space-y-2 pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center gap-1 text-xs font-bold text-midnight dark:text-white">
                      <FileText size={14} className="text-gold" />
                      <span>Mes Notes d'Études</span>
                    </div>
                    <textarea
                      placeholder="Notez vos idées, questions ou résumés de ce livre ici..."
                      value={noteText}
                      onChange={(e) => handleSaveNote(e.target.value)}
                      rows={4}
                      className="w-full p-2.5 text-xs bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-gold text-midnight dark:text-white resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)] space-y-3 mt-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Statut</span>
                    <select
                      value={readingStatuses[selectedBook.id] || 'to-read'}
                      onChange={(e) => updateReadingStatus(selectedBook.id, e.target.value as ReadingStatus)}
                      className="bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-bold rounded-lg px-2.5 py-1 text-midnight dark:text-white focus:outline-none focus:border-gold"
                    >
                      <option value="to-read">À lire</option>
                      <option value="reading">En cours</option>
                      <option value="completed">Terminé</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to={`/library/${selectedBook.id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold py-2.5 transition-all text-midnight dark:text-white"
                    >
                      <Eye size={14} /> Fiche
                    </Link>
                    {selectedBook.pdf_url ? (
                      <button
                        onClick={() => {
                          setReadingPdfUrl(selectedBook.pdf_url!);
                          setReadingPdfTitle(selectedBook.title);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gold text-midnight hover:bg-yellow-400 text-xs font-black py-2.5 transition-all shadow-md active:scale-95"
                      >
                        <Download size={14} /> Lire PDF
                      </button>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold py-2.5 cursor-not-allowed dark:bg-gray-800"
                      >
                        Bientôt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-6 text-center shadow-md h-full flex flex-col items-center justify-center min-h-[350px] sticky top-6">
                <BookMarked className="w-12 h-12 text-gold/30 mb-3" />
                <h3 className="text-sm font-bold text-midnight dark:text-white">Sélectionnez un document</h3>
                <p className="text-[10px] text-gray-500 max-w-xs mt-2">
                  Cliquez sur n'importe quel livre à gauche pour l'étudier, télécharger son PDF ou ajouter vos notes de lecture.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Mobile Details Modal Sheet (Fits mobile screen size perfectly) */}
      {isMobileDetailOpen && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300">
          <div className="bg-white dark:bg-gray-900 w-full max-h-[85vh] rounded-t-3xl p-5 overflow-y-auto space-y-4 shadow-2xl border-t border-white/10 animate-slide-up">
            
            {/* Header control */}
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[10px] font-black uppercase text-gold tracking-widest">
                Détails du document
              </span>
              <button 
                onClick={() => setIsMobileDetailOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Book Header info */}
            <div className="flex gap-4 items-start">
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border shadow-sm">
                {selectedBook.cover_image ? (
                  <img src={selectedBook.cover_image} alt={selectedBook.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-midnight flex items-center justify-center">
                    <BookIcon className="w-6 h-6 text-white/40" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-gold font-bold">
                  {selectedBook.category || 'Guide'}
                </span>
                <h3 className="text-sm font-black text-midnight dark:text-white leading-snug">
                  {selectedBook.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded ${getLevelColor(selectedBook.level)}`}>
                    {selectedBook.level || 'Tous niveaux'}
                  </span>
                  {copiedId === selectedBook.id && (
                    <span className="text-[8px] text-emerald-600 font-bold">Lien copié !</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 leading-relaxed dark:text-gray-400">
              {selectedBook.description}
            </p>

            {/* Mobile Study Notes */}
            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
              <div className="flex items-center gap-1 text-xs font-bold text-midnight dark:text-white">
                <FileText size={13} className="text-gold" />
                <span>Mes Notes d'Études</span>
              </div>
              <textarea
                placeholder="Notez vos résumés ou points clés..."
                value={noteText}
                onChange={(e) => handleSaveNote(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-gold text-midnight dark:text-white resize-none"
              />
            </div>

            {/* Actions & Status */}
            <div className="pt-3 border-t border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Statut</span>
                <select
                  value={readingStatuses[selectedBook.id] || 'to-read'}
                  onChange={(e) => updateReadingStatus(selectedBook.id, e.target.value as ReadingStatus)}
                  className="bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-bold rounded-lg px-2.5 py-1 text-midnight dark:text-white focus:outline-none"
                >
                  <option value="to-read">À lire</option>
                  <option value="reading">En cours</option>
                  <option value="completed">Terminé</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => shareBook(selectedBook)}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-xs font-bold py-2.5 transition-all text-midnight dark:text-white"
                >
                  <Share2 size={13} /> Partager
                </button>
                <Link
                  to={`/library/${selectedBook.id}`}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-xs font-bold py-2.5 transition-all text-midnight dark:text-white"
                >
                  <Eye size={13} /> Fiche
                </Link>
                {selectedBook.pdf_url ? (
                  <button
                    onClick={() => {
                      setReadingPdfUrl(selectedBook.pdf_url!);
                      setReadingPdfTitle(selectedBook.title);
                      setIsMobileDetailOpen(false);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gold text-midnight hover:bg-yellow-400 text-xs font-black py-2.5 transition-all shadow-md"
                  >
                    <Download size={13} /> PDF
                  </button>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold py-2.5 cursor-not-allowed dark:bg-gray-800"
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
          onClose={() => setReadingPdfUrl(null)}
        />
      )}
    </div>
  );
}

