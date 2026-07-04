import { useState, useEffect } from 'react';
import { Flame, MessageCircle, Trash2, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface BlogComment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  users?: {
    username: string;
    avatar_url: string | null;
  };
}

interface BlogLikesCommentsProps {
  blogId: string;
  blogTitle?: string;
}

export default function BlogLikesComments({ blogId, blogTitle }: BlogLikesCommentsProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLikesAndComments();
  }, [blogId, user?.id]);

  const fetchLikesAndComments = async () => {
    try {
      setLoading(true);

      // Fetch likes count
      const { data: likesData, error: likesError } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('blog_id', blogId);

      if (!likesError) {
        setLikes(likesData?.length || 0);
      }

      // Check if current user has liked
      if (user?.id) {
        const { data: userLike } = await supabase
          .from('blog_likes')
          .select('id')
          .eq('blog_id', blogId)
          .eq('user_id', user.id)
          .single();

        setIsLiked(!!userLike);
      }

      // Fetch comments with user info
      const { data: commentsData, error: commentsError } = await supabase
        .from('blog_comments')
        .select(`
          id,
          content,
          user_id,
          created_at,
          users (username, avatar_url)
        `)
        .eq('blog_id', blogId)
        .order('created_at', { ascending: false });

      if (!commentsError) {
        setComments(commentsData || []);
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
          .from('blog_likes')
          .delete()
          .eq('blog_id', blogId)
          .eq('user_id', user.id);

        setLikes(Math.max(0, likes - 1));
        setIsLiked(false);
      } else {
        // Add like
        await supabase
          .from('blog_likes')
          .insert([{ blog_id: blogId, user_id: user.id }]);

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
        .from('blog_comments')
        .insert([{
          blog_id: blogId,
          user_id: user.id,
          content: newComment.trim()
        }])
        .select(`
          id,
          content,
          user_id,
          created_at,
          users (username, avatar_url)
        `);

      if (insertError) throw insertError;

      if (data) {
        setComments([data[0], ...comments]);
        setNewComment('');
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
        .from('blog_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user?.id);

      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
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
      {/* Likes Section */}
      <div className="border-t pt-8">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
            isLiked
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              : 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          <Flame className={isLiked ? 'fill-current text-orange-500' : ''} size={20} />
          <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-poppins flex items-center gap-2">
          <MessageCircle size={24} />
          Commentaires ({comments.length})
        </h3>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleAddComment} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600/30 flex items-start gap-2">
                <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Écrivez votre commentaire..."
              className="w-full px-4 py-3 rounded-lg border bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none font-poppins"
              rows={4}
              disabled={submitting}
            />

            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-2 rounded-lg font-bold bg-gradient-to-r from-gold to-yellow-400 text-slate-900 hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-50 transition font-poppins"
            >
              {submitting ? 'Envoi...' : 'Publier le commentaire'}
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
              {' '}pour commenter cet article.
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-center py-8 text-slate-500 dark:text-slate-400 font-poppins">
              Pas encore de commentaire. Soyez le premier à commenter!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600/50 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white font-poppins">
                      {comment.users?.username || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {user?.id === comment.user_id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition text-red-600 dark:text-red-400"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap font-poppins">
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
