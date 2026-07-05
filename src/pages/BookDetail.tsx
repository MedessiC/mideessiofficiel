import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, BookOpen, Download, ExternalLink, Star, Users, FileText,
  Award, Bookmark, BookMarked, Share2, Eye, ChevronRight, Play, X,
  BarChart2, Clock, Zap, Heart, MessageCircle, CheckCircle, BookmarkCheck
} from 'lucide-react';
import SEO from '../components/SEO';
import BookLikesComments from '../components/BookLikesComments';
import PdfReader from '../components/PdfReader';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from '../components/ui/Avatar';

interface TopReader {
  username: string;
  avatar_url: string | null;
  score: number;
  total_questions: number;
}

interface Book {
  id: string;
  title: string;
  description: string;
  author?: string;
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
  pdf_url?: string;
  week_added?: string;
  created_at?: string;
  updated_at?: string;
}

const LEVEL_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  'Débutant':      { bg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', label: '🟢 Débutant' },
  'Intermédiaire': { bg: 'bg-blue-500/15',    text: 'text-blue-600 dark:text-blue-400',       label: '🔵 Intermédiaire' },
  'Avancé':        { bg: 'bg-purple-500/15',  text: 'text-purple-600 dark:text-purple-400',   label: '🟣 Avancé' },
};

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shareToast, setShareToast] = useState(false);
  const [topReaders, setTopReaders] = useState<TopReader[]>([]);
  const [readerCount, setReaderCount] = useState(0);

  const readerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBook();
    window.scrollTo({ top: 0 });
  }, [id]);

  // Increment views via secure RPC when page loads
  useEffect(() => {
    if (!id) return;

    const incrementViews = async () => {
      try {
        await supabase.rpc('increment_book_views', { p_book_id: id });
      } catch (err) {
        console.error('Failed to increment book views:', err);
      }
    };

    incrementViews();
  }, [id]);

  const fetchBook = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      setBook(data);

      // Fetch related books
      if (data?.category) {
        const { data: related } = await supabase
          .from('books')
          .select('id, title, cover_image, cover_color, level, category, rating')
          .eq('category', data.category)
          .neq('id', id)
          .limit(3);
        setRelatedBooks(related || []);
      }

      // Fetch like status and count
      if (user) {
        const { data: likeData } = await supabase
          .from('book_likes')
          .select('id')
          .eq('book_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        setIsLiked(!!likeData);

        // Fetch save status
        const { data: saveData } = await supabase
          .from('book_saves')
          .select('id')
          .eq('book_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        setIsSaved(!!saveData);
      }

      // Like count (public)
      const { count } = await supabase
        .from('book_likes')
        .select('id', { count: 'exact', head: true })
        .eq('book_id', id);
      setLikeCount(count || 0);

      // Use books.views as public reader count (includes anonymous)
      setReaderCount(data.views || 0);

      // Try to fetch leaderboard from the public view `book_leaderboard`
      try {
        const { data: board } = await supabase
          .from('book_leaderboard')
          .select('user_id, username, avatar_url, total_score, total_questions')
          .eq('book_id', id)
          .order('total_score', { ascending: false })
          .limit(3);

        if (board && board.length > 0) {
          const mapped = board.map((b: any) => ({ username: b.username, avatar_url: b.avatar_url, score: Number(b.total_score || 0), total_questions: Number(b.total_questions || 0) }));
          setTopReaders(mapped);
        }
      } catch (err) {
        console.error('Error fetching public leaderboard view:', err);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareType = navigator.share ? 'native' : 'clipboard';
    if (navigator.share) {
      await navigator.share({ title: book?.title || '', url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
    // Log share to database (fire-and-forget)
    if (book?.id) {
      supabase.from('book_shares').insert({
        book_id: book.id,
        user_id: user?.id || null,
        share_type: shareType,
      }).then(() => {});
    }
  };

  const handleToggleSave = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data, error } = await supabase.rpc('toggle_book_save', { p_book_id: book!.id });
      if (!error && data) {
        setIsSaved(data.saved);
      }
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
    }
  };

  const handleReadClick = () => {
    if (book?.pdf_url) {
      setShowPdfModal(true);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 border-[var(--brand-gold)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-poppins">Chargement du livre…</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !book) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-poppins">Livre non trouvé</h1>
          <p className="text-slate-500 mb-6">Ce livre n'existe pas ou a été supprimé.</p>
          <button
            onClick={() => navigate('/library')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-midnight)] text-[var(--brand-gold)] rounded-xl font-bold"
          >
            <ArrowLeft size={18} /> Retour à la bibliothèque
          </button>
        </div>
      </div>
    );
  }

  const levelStyle = LEVEL_STYLES[book.level || ''] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: book.level || '' };
  const heroGradient = book.cover_color
    ? `bg-gradient-to-br ${book.cover_color}`
    : 'bg-gradient-to-br from-[var(--brand-midnight)] to-[#2d2daa]';

  return (
    <>
      <SEO
        title={`${book.title} | MIDEESSI Learn`}
        description={book.description}
        image={book.cover_image}
        type="article"
        keywords={['ebook', 'PDF', book.category || '', book.level || '', 'MIDEESSI']}
      />

      {/* ── PDF Reader Modal ── */}
      {showPdfModal && book.pdf_url && (
        <PdfReader
          pdfUrl={book.pdf_url}
          title={book.title}
          modal
          onClose={() => setShowPdfModal(false)}
        />
      )}

      {/* ── Share toast ── */}
      {shareToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-gray-900 text-white text-sm font-semibold rounded-full shadow-xl">
          <CheckCircle className="w-4 h-4 text-green-400" />
          Lien copié !
        </div>
      )}

      <div className="min-h-screen bg-[var(--bg-page)] dark:bg-slate-950 pt-20 pb-16">
        {/* ── Hero Banner ───────────────────────────────────────────────────── */}
        <div className={`relative overflow-hidden ${heroGradient}`}>
          {/* Background image blur */}
          {book.cover_image && (
            <div className="absolute inset-0">
              <img
                src={book.cover_image}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover opacity-20 blur-sm scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
            </div>
          )}

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            {/* Back */}
            <button
              onClick={() => navigate('/library')}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium text-sm mb-6 transition-colors"
            >
              <ArrowLeft size={16} /> Bibliothèque
            </button>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
              {/* Cover thumbnail */}
              <div className="flex-shrink-0 w-36 sm:w-44 lg:w-52">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 aspect-[3/4]">
                  {book.cover_image ? (
                    <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full ${heroGradient} flex items-center justify-center`}>
                      <BookOpen className="w-12 h-12 text-white/40" />
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {book.category && (
                    <span className="px-3 py-1 bg-white/10 border border-white/20 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                      {book.category}
                    </span>
                  )}
                  {book.is_bestseller && (
                    <span className="px-3 py-1 bg-[var(--brand-gold)] text-[var(--brand-midnight)] text-xs font-black rounded-full flex items-center gap-1">
                      <Award className="w-3 h-3" /> BESTSELLER
                    </span>
                  )}
                  {book.is_new && (
                    <span className="px-3 py-1 bg-emerald-400 text-white text-xs font-black rounded-full">
                      ✨ NOUVEAU
                    </span>
                  )}
                  {book.level && (
                    <span className={`px-3 py-1 ${levelStyle.bg} ${levelStyle.text} text-xs font-semibold rounded-full border border-white/10`}>
                      {levelStyle.label}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-2 font-poppins">
                  {book.title}
                </h1>
                {book.author && (
                  <p className="text-white/60 text-sm mb-4">par <span className="text-white/80 font-semibold">{book.author}</span></p>
                )}

                {/* Stats row */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {book.rating && (
                    <div className="flex items-center gap-1.5 text-white/80 text-sm">
                      <Star className="w-4 h-4 fill-[var(--brand-gold)] text-[var(--brand-gold)]" />
                      <span className="font-bold text-white">{book.rating}</span>/5
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-white/80 text-sm">
                    <Users className="w-4 h-4 text-blue-300" />
                    <span>{readerCount.toLocaleString()} lecteur{readerCount !== 1 ? 's' : ''}</span>
                  </div>
                  {book.pages ? (
                    <div className="flex items-center gap-1.5 text-white/80 text-sm">
                      <FileText className="w-4 h-4 text-emerald-300" />
                      <span>{book.pages} pages</span>
                    </div>
                  ) : null}
                  {book.week_added && (
                    <div className="flex items-center gap-1.5 text-white/80 text-sm">
                      <Clock className="w-4 h-4 text-purple-300" />
                      <span>{book.week_added}</span>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3">
                  {book.pdf_url && (
                    <button
                      onClick={handleReadClick}
                      id="btn-read-pdf"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--brand-gold)] hover:bg-yellow-400 text-[var(--brand-midnight)] font-black rounded-xl transition-all shadow-lg shadow-black/30 active:scale-95 text-sm sm:text-base"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Lire le PDF
                    </button>
                  )}
                  {book.buy_url && (
                    <a
                      href={book.buy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/30 hover:border-white/60 text-white font-bold rounded-xl transition-all text-sm sm:text-base"
                    >
                      <Download className="w-4 h-4" />
                      Acheter
                      <span className="ml-1 text-[var(--brand-gold)]">{book.price === 0 ? 'Gratuit' : `${Number(book.price).toLocaleString()} F`}</span>
                    </a>
                  )}
                  {/* Save button */}
                  <button
                    onClick={handleToggleSave}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all text-sm border ${
                      isSaved
                        ? 'bg-[var(--brand-gold)] border-[var(--brand-gold)] text-[var(--brand-midnight)]'
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                    }`}
                    title={isSaved ? 'Retirer des favoris' : 'Sauvegarder'}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all text-sm border border-white/20"
                    title="Partager"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Main column ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Description */}
              <div className="bg-white dark:bg-slate-800/70 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-700/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-poppins flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-[var(--brand-gold)]" /> À propos de ce livre
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                  {book.description}
                </p>
              </div>

              {/* PDF Reader (inline) */}
              {book.pdf_url && (
                <div ref={readerRef}>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white font-poppins flex items-center gap-2">
                      <Eye className="w-5 h-5 text-[var(--brand-gold)]" /> Lecteur intégré
                    </h2>
                    <button
                      onClick={() => setShowPdfModal(true)}
                      className="text-xs text-[var(--brand-midnight)] dark:text-[var(--brand-gold)] hover:underline flex items-center gap-1"
                    >
                      Plein écran <Zap className="w-3 h-3" />
                    </button>
                  </div>
                  <PdfReader pdfUrl={book.pdf_url} title={book.title} />
                </div>
              )}

              {/* Likes & Comments */}
              <div className="bg-white dark:bg-slate-800/70 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-700/50">
                <BookLikesComments bookId={book.id} bookTitle={book.title} />
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-6">

              {/* Quick info card */}
              <div className="bg-white dark:bg-slate-800/70 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50 sticky top-24">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-base flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[var(--brand-gold)]" /> Infos du livre
                </h3>

                <ul className="space-y-3">
                  {[
                    { icon: Star, label: 'Note', value: book.rating ? `${book.rating} / 5` : '—', color: 'text-yellow-500' },
                    { icon: FileText, label: 'Pages', value: book.pages ? `${book.pages} pages` : '—', color: 'text-blue-500' },
                    { icon: Users, label: 'Lecteurs', value: readerCount.toLocaleString(), color: 'text-emerald-500' },
                    { icon: BookOpen, label: 'Niveau', value: book.level || '—', color: 'text-purple-500' },
                    { icon: Clock, label: 'Ajouté', value: book.week_added || '—', color: 'text-gray-400' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <li key={label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Icon className={`w-4 h-4 ${color}`} />
                        {label}
                      </span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{value}</span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                {book.price !== undefined && book.price !== null && (
                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700 text-center">
                    <p className="text-xs text-gray-400 mb-1">Prix</p>
                    <p className="text-3xl font-black text-[var(--brand-midnight)] dark:text-[var(--brand-gold)]">
                      {book.price === 0 ? 'Gratuit' : Number(book.price).toLocaleString()}
                      {book.price !== 0 && <span className="text-lg font-bold ml-1">FCFA</span>}
                    </p>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-5 space-y-2">
                  {book.pdf_url && (
                    <button
                      onClick={handleReadClick}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[var(--brand-midnight)] hover:bg-[var(--brand-midnight-dark)] text-[var(--brand-gold)] font-bold rounded-xl transition-all text-sm"
                    >
                      <Play className="w-4 h-4 fill-current" /> Lire le PDF
                    </button>
                  )}
                  {book.buy_url && (
                    <a
                      href={book.buy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 border-2 border-[var(--brand-midnight)] dark:border-[var(--brand-gold)] text-[var(--brand-midnight)] dark:text-[var(--brand-gold)] font-bold rounded-xl transition-all text-sm hover:bg-[var(--brand-midnight)]/5"
                    >
                      <Download className="w-4 h-4" /> Acheter
                    </a>
                  )}
                  {book.article_url && (
                    <a
                      href={book.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all text-sm hover:bg-gray-200 dark:hover:bg-slate-600"
                    >
                      <ExternalLink className="w-4 h-4" /> Lire l'article
                    </a>
                  )}
                  <button
                    onClick={handleShare}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 font-semibold rounded-xl transition-all text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
                  >
                    <Share2 className="w-4 h-4" /> Partager
                  </button>
                </div>
              </div>

              {/* Leaderboard Top 3 Readers */}
              {topReaders.length > 0 && (
                <div className="bg-gradient-to-br from-[var(--brand-midnight)] to-blue-950 rounded-2xl p-5 border border-gold/20 shadow-xl text-white">
                  <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-white">
                    <Award className="w-5 h-5 text-gold" /> Top Lecteurs
                  </h3>
                  <div className="space-y-3">
                    {topReaders.map((reader, index) => {
                      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
                      return (
                        <Link
                          key={reader.username}
                          to={`/profile/${reader.username}`}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-gold/30 hover:bg-white/10 transition-all group"
                        >
                          <span className="text-base font-bold">{medal}</span>
                          <Avatar
                            src={reader.avatar_url || undefined}
                            name={reader.username}
                            className="w-8 h-8 rounded-full border border-white/10"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate group-hover:text-gold transition-colors">
                              @{reader.username}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {reader.score} / {reader.total_questions} réponses
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Related books */}
              {relatedBooks.length > 0 && (
                <div className="bg-white dark:bg-slate-800/70 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-base flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[var(--brand-gold)]" /> Livres similaires
                  </h3>
                  <div className="space-y-3">
                    {relatedBooks.map((rb) => (
                      <Link
                        key={rb.id}
                        to={`/library/${rb.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group"
                      >
                        <div className={`w-12 h-16 rounded-lg flex-shrink-0 overflow-hidden bg-gradient-to-br ${rb.cover_color || 'from-[var(--brand-midnight)] to-[#2d2daa]'}`}>
                          {rb.cover_image && (
                            <img src={rb.cover_image} alt={rb.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[var(--brand-midnight)] dark:group-hover:text-[var(--brand-gold)] transition-colors">
                            {rb.title}
                          </p>
                          {rb.level && (
                            <p className="text-xs text-gray-400 mt-0.5">{rb.level}</p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--brand-gold)] flex-shrink-0 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Browse more CTA */}
          <div className="mt-12 text-center">
            <Link
              to="/library"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--brand-midnight)] to-[#2d2daa] text-[var(--brand-gold)] rounded-2xl font-bold hover:shadow-xl transition-all text-sm sm:text-base"
            >
              <BookOpen className="w-5 h-5" /> Explorer la bibliothèque
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
