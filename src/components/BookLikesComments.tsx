import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, BadgeCheck, Trash2, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar } from './ui/Avatar';

interface BookComment {
  id: string;
  content: string;
  rating: number | null;
  user_id: string;
  parent_id: string | null;
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
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [commentLikes, setCommentLikes] = useState<Record<string, { count: number; liked: boolean }>>({});
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
          parent_id,
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

      if (commentsData?.length) {
        const commentIds = commentsData.map((comment) => comment.id);
        const { data: likesData, error: likesError } = await supabase
          .from('book_comment_likes')
          .select('comment_id, user_id')
          .in('comment_id', commentIds);

        if (!likesError) {
          const likesMap: Record<string, { count: number; liked: boolean }> = {};
          commentIds.forEach((commentId) => {
            likesMap[commentId] = { count: 0, liked: false };
          });

          likesData?.forEach((like: { comment_id: string; user_id: string }) => {
            likesMap[like.comment_id] = {
              count: (likesMap[like.comment_id]?.count || 0) + 1,
              liked: user?.id === like.user_id || likesMap[like.comment_id]?.liked || false,
            };
          });

          setCommentLikes(likesMap);
        }
      } else {
        setCommentLikes({});
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
        await supabase
          .from('book_likes')
          .delete()
          .eq('book_id', bookId)
          .eq('user_id', user.id);

        setLikes(Math.max(0, likes - 1));
        setIsLiked(false);
      } else {
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

  const handleLikeComment = async (commentId: string) => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    const isCommentLiked = commentLikes[commentId]?.liked;

    try {
      if (isCommentLiked) {
        await supabase
          .from('book_comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('book_comment_likes')
          .insert([{ comment_id: commentId, user_id: user.id }]);
      }

      await fetchLikesAndComments();
    } catch (err) {
      console.error('Erreur like commentaire:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent, parentId: string | null = null, draftValue: string = newComment) => {
    e.preventDefault();

    if (!user?.id) {
      navigate('/login');
      return;
    }

    const content = draftValue.trim();
    if (!content) {
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
          content,
          rating: parentId ? null : rating,
          parent_id: parentId,
        }])
        .select(`
          id,
          content,
          rating,
          user_id,
          parent_id,
          created_at,
          users (username, avatar_url)
        `);

      if (insertError) throw insertError;

      if (data) {
        setNewComment('');
        setRating(5);
        setReplyTo(null);
        setReplyContent('');
        await fetchLikesAndComments();
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

      await fetchLikesAndComments();
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

  const renderComment = (comment: BookComment, depth = 0) => {
    const isAuthor = user?.id === comment.user_id;
    const children = comments.filter((item) => item.parent_id === comment.id);
    const likes = commentLikes[comment.id];

    return (
      <div
        key={comment.id}
        className={`rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 ${depth > 0 ? 'ml-4 border-l-2 border-gold/40' : ''}`}
      >
        <div className="flex gap-3">
          <Avatar
            name={comment.users?.username || 'Utilisateur'}
            src={comment.users?.avatar_url || null}
            size="sm"
            className="flex-shrink-0"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <Link
                to={`/profile/${encodeURIComponent(comment.users?.username || 'utilisateur')}`}
                className="font-bold text-slate-900 dark:text-white hover:text-gold transition"
              >
                {comment.users?.username || 'Utilisateur'}
              </Link>
              <span className="text-xs text-slate-500">
                {new Date(comment.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">{comment.content}</p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
              <button
                onClick={() => handleLikeComment(comment.id)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition ${likes?.liked ? 'bg-orange-50 text-orange-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <Heart className={`w-3.5 h-3.5 ${likes?.liked ? 'fill-current' : ''}`} />
                {likes?.count || 0}
              </button>
              <button
                onClick={() => {
                  setReplyTo(comment.id);
                  setReplyContent('');
                }}
                className="hover:text-[var(--brand-midnight)] dark:hover:text-white"
              >
                Répondre
              </button>
              {isAuthor && (
                <button onClick={() => handleDeleteComment(comment.id)} className="hover:text-red-500">
                  Supprimer
                </button>
              )}
            </div>

            {replyTo === comment.id && (
              <form onSubmit={(e) => handleAddComment(e, comment.id, replyContent)} className="mt-3 space-y-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={2}
                  placeholder="Répondre à ce commentaire..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-sm"
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={submitting || !replyContent.trim()} className="rounded-lg bg-gold px-3 py-2 text-sm font-semibold text-midnight">
                    Publier
                  </button>
                  <button type="button" onClick={() => { setReplyTo(null); setReplyContent(''); }} className="rounded-lg border px-3 py-2 text-sm">
                    Annuler
                  </button>
                </div>
              </form>
            )}

            {children.length > 0 && (
              <div className="mt-4 space-y-3">
                {children.map((child) => renderComment(child, depth + 1))}
              </div>
            )}
          </div>
        </div>
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
          Avis et commentaires ({comments.filter((comment) => comment.parent_id === null).length})
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
          {comments.filter((comment) => comment.parent_id === null).length === 0 ? (
            <p className="text-center py-8 text-slate-500 dark:text-slate-400 font-poppins">
              Pas encore d'avis. Soyez le premier à commenter!
            </p>
          ) : (
            comments
              .filter((comment) => comment.parent_id === null)
              .map((comment) => renderComment(comment))
          )}
        </div>
      </div>
    </div>
  );
}
