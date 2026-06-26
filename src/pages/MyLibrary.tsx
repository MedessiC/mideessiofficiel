import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BookOpen, ArrowLeft, Download, LogOut, Heart } from 'lucide-react';
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
  pdf_url?: string;
  buy_url?: string;
  created_at?: string;
}

interface BookLikeJoin {
  book_id: string;
  books: Book | null;
}

export default function MyLibrary() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [likedBooks, setLikedBooks] = useState<Book[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchLibrary();
  }, [user, navigate]);

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

  const getLevelStyle = (level?: string) => {
    switch (level) {
      case 'Débutant':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermédiaire':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Avancé':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <SEO
        title="Ma Bibliothèque | MIDEESSI"
        description="Accédez à vos ebooks préférés, vos PDF sauvegardés et votre espace personnel MIDEESSI."
      />

      <header className="relative overflow-hidden bg-gradient-to-br from-midnight via-blue-900 to-black text-white py-10 sm:py-14 lg:py-16">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(248,209,85,0.25),_transparent_35%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-center">
            <div className="max-w-3xl">
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold font-semibold mb-3">Mon espace</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Ma Bibliothèque
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-xl">
                Retrouvez vos PDF likés, vos ressources favorites et continuez votre apprentissage avec MIDEESSI.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row items-start sm:items-center">
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-midnight px-5 py-3 font-semibold shadow-lg shadow-black/10 hover:bg-slate-100 transition"
              >
                <LogOut size={18} />
                {loading ? 'Déconnexion...' : 'Se déconnecter'}
              </button>
              <Link
                to="/library"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white hover:bg-white/20 transition"
              >
                <BookOpen size={18} />
                Parcourir la bibliothèque
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-4 sm:p-6 shadow-2xl shadow-black/20">
              <p className="text-[11px] sm:text-xs uppercase text-slate-300 tracking-[0.2em] mb-3">Bienvenue</p>
              <h2 className="text-xl sm:text-2xl font-bold">{username || user.email}</h2>
              <p className="mt-2 text-[11px] sm:text-sm text-slate-300">Votre espace personnel MIDEESSI.</p>
            </div>

            <div className="rounded-3xl bg-white/10 border border-white/10 p-4 sm:p-6 shadow-2xl shadow-black/10">
              <p className="text-[11px] sm:text-xs uppercase text-slate-300 tracking-[0.2em] mb-3">Livres likés</p>
              <p className="text-2xl sm:text-3xl font-bold">{likedBooks.length}</p>
              <p className="mt-2 text-[11px] sm:text-sm text-slate-300">Ressources que vous avez ajoutées à votre bibliothèque.</p>
            </div>

            <div className="rounded-3xl bg-white/10 border border-white/10 p-4 sm:p-6 shadow-2xl shadow-black/10">
              <p className="text-[11px] sm:text-xs uppercase text-slate-300 tracking-[0.2em] mb-3">Catégories</p>
              <p className="text-2xl sm:text-3xl font-bold">{new Set(likedBooks.map((book) => book.category)).size}</p>
              <p className="mt-2 text-[11px] sm:text-sm text-slate-300">Thèmes différents dans votre collection.</p>
            </div>

            <div className="rounded-3xl bg-white/10 border border-white/10 p-4 sm:p-6 shadow-2xl shadow-black/10">
              <p className="text-[11px] sm:text-xs uppercase text-slate-300 tracking-[0.2em] mb-3">Action rapide</p>
              <p className="text-2xl sm:text-3xl font-bold">Voir</p>
              <p className="mt-2 text-[11px] sm:text-sm text-slate-300">Explorez la bibliothèque MIDEESSI ou téléchargez direct.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <div className="rounded-3xl bg-red-500/10 border border-red-500/20 p-4 text-red-700 mb-8">
            {error}
          </div>
        )}

        <section className="rounded-[32px] bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/10 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gold font-semibold mb-2">Ma collection</p>
              <h2 className="text-2xl font-bold">PDF enregistrés</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/library')}
                className="rounded-full bg-gold px-5 py-3 text-midnight font-bold hover:bg-yellow-500 transition"
              >
                Ajouter un PDF
              </button>
              <button
                onClick={fetchLibrary}
                className="rounded-full border border-slate-300 dark:border-slate-700 px-5 py-3 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Rafraîchir
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-gold border-t-transparent animate-spin" />
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Chargement de votre bibliothèque...</p>
            </div>
          ) : likedBooks.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-gold text-3xl">
                <Heart />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">Votre bibliothèque est vide</h3>
              <p className="max-w-lg mx-auto text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6">
                Ajoutez des PDF à votre collection pour retrouver facilement vos meilleures ressources.
              </p>
              <button
                onClick={() => navigate('/library')}
                className="rounded-full bg-gold px-5 py-3 text-sm sm:text-base text-midnight font-bold hover:bg-yellow-500 transition"
              >
                Explorer la bibliothèque
              </button>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {likedBooks.map((book) => (
                <div
                  key={book.id}
                  className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">{book.category || 'PDF'}</p>
                      <h3 className="text-lg sm:text-xl font-bold line-clamp-2">{book.title}</h3>
                    </div>
                    <span className={`text-[11px] font-semibold uppercase rounded-full px-3 py-1 ${getLevelStyle(book.level)}`}>
                      {book.level || 'Tous niveaux'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600 dark:text-slate-300 mb-5 line-clamp-3">
                    {book.description || 'Description non disponible.'}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {book.students ? <span>{book.students} lecteurs</span> : null}
                    {book.rating ? <span>{book.rating}/5 note</span> : null}
                    {book.pages ? <span>{book.pages} pages</span> : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link
                      to={`/library/${book.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <BookOpen size={16} />
                      Voir
                    </Link>
                    {book.pdf_url ? (
                      <a
                        href={book.pdf_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 text-sm font-semibold text-midnight hover:bg-yellow-500 transition"
                      >
                        <Download size={16} />
                        Télécharger
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-500 dark:text-slate-400"
                      >
                        <Download size={16} />
                        Indisponible
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
