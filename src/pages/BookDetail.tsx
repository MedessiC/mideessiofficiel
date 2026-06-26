import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Download, ExternalLink, Eye, BadgeCheck } from 'lucide-react';
import SEO from '../components/SEO';
import BookLikesComments from '../components/BookLikesComments';
import { supabase } from '../lib/supabase';

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
  pdf_url?: string;
  created_at?: string;
  updated_at?: string;
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBook();
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold to-yellow-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-poppins">Chargement du livre...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/library')}
            className="flex items-center gap-2 text-gold hover:text-yellow-400 font-semibold mb-8 transition font-poppins"
          >
            <ArrowLeft size={20} /> Retour à la bibliothèque
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-poppins">Livre non trouvé</h1>
            <p className="text-slate-600 dark:text-slate-400 font-poppins">Ce livre n'existe pas ou a été supprimé.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${book.title} | MIDEESSI Learn`}
        description={book.description}
        image={book.cover_image}
        type="article"
        keywords={['livre', 'PDF', book.category || '', book.level || '']}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/library')}
            className="flex items-center gap-2 text-gold hover:text-yellow-400 font-semibold mb-8 transition font-poppins"
          >
            <ArrowLeft size={20} /> Retour à la bibliothèque
          </button>

          {/* Content Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white/95 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/50 p-4">
                {book.cover_image ? (
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-auto rounded-lg object-cover shadow-lg"
                  />
                ) : (
                  <div
                    className="w-full aspect-[3/4] rounded-lg flex items-center justify-center text-white font-bold text-2xl text-center p-4"
                    style={{ backgroundColor: book.cover_color || '#191970' }}
                  >
                    {book.title}
                  </div>
                )}

                {/* Badges */}
                <div className="mt-4 space-y-2">
                  {book.is_bestseller && (
                    <div className="px-3 py-2 bg-gold/20 text-gold rounded-lg text-sm font-bold text-center font-poppins">
                      Bestseller
                    </div>
                  )}
                  {book.is_new && (
                    <div className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold text-center font-poppins">
                      Nouveau
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Book Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl shadow-2xl p-6 sm:p-8 border bg-white/95 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">
                {/* Title & Category */}
                <div className="space-y-3 mb-6">
                  {book.category && (
                    <span className="inline-block px-3 py-1 bg-gold/20 text-gold rounded-full text-sm font-bold font-poppins uppercase">
                      {book.category}
                    </span>
                  )}
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-poppins">
                    {book.title}
                  </h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-slate-200 dark:border-slate-700/50 mb-6">
                  {book.rating && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <BadgeCheck className="text-gold" size={16} />
                        <span className="font-bold text-slate-900 dark:text-white font-poppins">
                          {book.rating}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-poppins">Note</p>
                    </div>
                  )}

                  {book.level && (
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white font-poppins text-sm">
                        {book.level}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-poppins">Niveau</p>
                    </div>
                  )}

                  {book.pages && (
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white font-poppins text-sm">
                        {book.pages}p
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-poppins">Pages</p>
                    </div>
                  )}

                  {book.students && (
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white font-poppins text-sm">
                        {Math.floor(book.students / 1000)}k+
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-poppins">Lecteurs</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-4 mb-6">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-poppins">
                    {book.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {book.pdf_url && (
                    <a
                      href={book.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-yellow-400 text-slate-900 rounded-lg font-bold hover:from-yellow-400 hover:to-yellow-500 transition font-poppins flex-1"
                    >
                      <Download size={20} />
                      Télécharger le PDF
                    </a>
                  )}

                  {book.buy_url && (
                    <a
                      href={book.buy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gold text-gold rounded-lg font-bold hover:bg-gold/10 transition font-poppins flex-1"
                    >
                      <ExternalLink size={20} />
                      Lire en ligne
                    </a>
                  )}
                </div>

                {/* Price */}
                {book.price && (
                  <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700/30 rounded-lg text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 font-poppins">Prix</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white font-poppins">
                      {typeof book.price === 'number' ? `${book.price}€` : book.price}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="rounded-2xl shadow-2xl p-6 sm:p-8 border bg-white/95 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">
            <BookLikesComments bookId={book.id} bookTitle={book.title} />
          </div>

          {/* Related Books CTA */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-poppins">
              Découvrez d'autres ressources
            </h2>
            <Link
              to="/library"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-yellow-400 text-slate-900 rounded-lg font-bold hover:from-yellow-400 hover:to-yellow-500 transition font-poppins"
            >
              <BookOpen size={20} />
              Retour à la bibliothèque
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
