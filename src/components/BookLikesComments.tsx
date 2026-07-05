import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, BadgeCheck, Trash2, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Avatar } from './ui/Avatar';

interface BookComment {
  id: string;
  content: string;
  rating: number | null;
  user_id: string;
  created_at: string;
  users?: {
    username: string;
    avatar_url: string | null;
  };
}

interface BookLikesCommentsProps {
  bookId: string;
  bookTitle?: string;
}

export default function BookLikesComments({ bookId, bookTitle }: BookLikesCommentsProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currentUserProfile } = useAuth();
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<BookComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [averageRating, setAverageRating] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as user types
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    fetchLikesAndComments();
  }, [bookId, user?.id]);

  const fetchLikesAndComments = async () => {
    try {
      setLoading(true);

      // Fetch likes count
      const { data: likesData, error: likesError } = await supabase
        .from('book_likes')
        .select('id')
        .eq('book_id', bookId);

      if (!likesError) {
        setLikes(likesData?.length || 0);
      }

      // Check if current user has liked
      if (user?.id) {
        const { data: userLike } = await supabase
          .from('book_likes')
          .select('id')
          .eq('book_id', bookId)
          .eq('user_id', user.id)
          .single();

        setIsLiked(!!userLike);
      }

      // Fetch comments with user info
      const { data: commentsData, error: commentsError } = await supabase
        .from('book_comments')
        .select(`
          id,
          content,
          rating,
          user_id,
          created_at,
          users (username, avatar_url)
        `)
        .eq('book_id', bookId)
        .order('created_at', { ascending: false });

      if (!commentsError && commentsData) {
        setComments(commentsData);

        // Calculate average rating
        const ratings = commentsData.filter(c => c.rating).map(c => c.rating || 0);
        if (ratings.length > 0) {
          const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
          setAverageRating(Number(avg.toFixed(1)));
        }
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    try {
      if (isLiked) {
        // Remove like
        await supabase
          .from('book_likes')
          .delete()
          .eq('book_id', bookId)
          .eq('user_id', user.id);

        setLikes(Math.max(0, likes - 1));
        setIsLiked(false);
      } else {
        // Add like
        await supabase
          .from('book_likes')
          .insert([{ book_id: bookId, user_id: user.id }]);

        setLikes(likes + 1);
        setIsLiked(true);
      }
    } catch (err) {
      console.error('Erreur likes:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      setError('Le commentaire ne peut pas être vide');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const { data, error: insertError } = await supabase
        .from('book_comments')
        .insert([{
          book_id: bookId,
          user_id: user.id,
          content: newComment.trim(),
          rating: rating
        }])
        .select(`
          id,
          content,
          rating,
          user_id,
          created_at,
          users (username, avatar_url)
        `);

      if (insertError) throw insertError;

      if (data) {
        setComments([data[0], ...comments]);
        setNewComment('');
        setRating(5);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout du commentaire');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire?')) return;

    try {
      await supabase
        .from('book_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user?.id);

      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  const renderStars = (count: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && setRating(star)}
            disabled={!interactive}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            <BadgeCheck
              size={interactive ? 24 : 16}
              className={`${
                star <= (hoverRating || count)
                  ? 'text-gold fill-gold'
                  : 'text-slate-300 dark:text-slate-600'
              } transition`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-8">
      {/* Stats Section */}
      <div className="border-t pt-8 space-y-4">
        <div className="flex flex-wrap items-center gap-6">
          {/* Likes */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              isLiked
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <Heart className={isLiked ? 'fill-current' : ''} size={20} />
            <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>
          </button>

          {/* Rating */}
          {averageRating > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {renderStars(Math.round(averageRating), false)}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 font-poppins">
                {averageRating} ({comments.filter(c => c.rating).length} avis)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-poppins flex items-center gap-2">
          <MessageCircle size={24} />
          Avis et commentaires ({comments.length})
        </h3>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleAddComment} className="space-y-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600/50">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600/30 flex items-start gap-2">
                <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Current user avatar + textarea */}
            <div className="flex items-start gap-3">
              <Avatar
                name={currentUserProfile?.username || user.email?.split('@')[0] || 'M'}
                src={currentUserProfile?.avatar_url || null}
                size="sm"
                className="mt-0.5 flex-shrink-0"
              />
              <div className="flex-1">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-200 font-poppins">
                    Note
                  </label>
                  {renderStars(rating, true)}
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Partagez votre avis sur ce livre..."
                  className="w-full mt-3 px-4 py-3 rounded-lg border bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none font-poppins"
                  rows={4}
                  disabled={submitting}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-2 rounded-lg font-bold bg-gradient-to-r from-gold to-yellow-400 text-slate-900 hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-50 transition font-poppins"
            >
              {submitting ? 'Envoi...' : 'Publier mon avis'}
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600/30">
            <p className="text-sm text-blue-700 dark:text-blue-400 font-poppins">
              <button
                onClick={() => navigate('/login')}
                className="font-semibold hover:underline"
              >
                Connectez-vous
              </button>
              {' '}pour laisser un avis.
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-center py-8 text-slate-500 dark:text-slate-400 font-poppins">
              Pas encore d'avis. Soyez le premier à commenter!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600/50 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  {/* Avatar */}
                  <Avatar
                    name={comment.users?.username || 'Utilisateur'}
                    src={comment.users?.avatar_url || null}
                    size="sm"
                    className="flex-shrink-0"
                  />
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="font-semibold text-slate-900 dark:text-white font-poppins text-sm">
                        {comment.users?.username || 'Utilisateur'}
                      </p>
                      {comment.rating && (
                        <div className="flex gap-0.5">
                          {renderStars(comment.rating, false)}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {user?.id === comment.user_id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition text-red-600 dark:text-red-400 flex-shrink-0"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap font-poppins pl-12">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
