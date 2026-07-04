import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Eye, Share2, Clock, Facebook, Twitter, Linkedin, Link as LinkIcon, Check, Bookmark, Flame, MessageSquare, Send } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase, BlogPost } from '../lib/supabase';
import { toCloudinaryUrl } from '../utils/cloudinaryImage';

// -----------------------------------------------------------------------------
// SKELETON
// -----------------------------------------------------------------------------
const PostSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse flex gap-8">
    <div className="hidden lg:block w-16 space-y-4 pt-32">
      <div className="w-12 h-12 bg-gray-200 rounded-full" />
      <div className="w-12 h-12 bg-gray-200 rounded-full" />
      <div className="w-12 h-12 bg-gray-200 rounded-full" />
    </div>
    <div className="flex-1 max-w-3xl">
      <div className="h-8 bg-gray-200 rounded-full w-40 mb-10" />
      <div className="space-y-6 mb-10">
        <div className="h-4 bg-gray-200 rounded-full w-32" />
        <div className="h-16 bg-gray-200 rounded-2xl w-full" />
      </div>
      <div className="h-[400px] bg-gray-200 rounded-3xl mb-10" />
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded-full" style={{ width: `${Math.random() * 30 + 70}%` }} />
        ))}
      </div>
    </div>
  </div>
);

// -----------------------------------------------------------------------------
// COMMENT SECTION COMPONENT
// -----------------------------------------------------------------------------
const CommentSection = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<Array<{
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    parent_id: string | null;
    users?: { username: string | null; avatar_url: string | null };
  }>>([]);
  const [commentLikes, setCommentLikes] = useState<Record<string, { count: number; liked: boolean }>>({});
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const refreshComments = async () => {
    const { data: userData } = await supabase.auth.getUser();
    setCurrentUserId(userData.user?.id || null);

    const { data, error } = await supabase
      .from('blog_comments')
      .select('id, content, created_at, user_id, parent_id, users (username, avatar_url)')
      .eq('blog_id', postId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments(data || []);

      const commentIds = (data || []).map(comment => comment.id);
      if (commentIds.length > 0) {
        const { data: likesData } = await supabase
          .from('blog_comment_likes')
          .select('comment_id, user_id')
          .in('comment_id', commentIds);

        const likesMap: Record<string, { count: number; liked: boolean }> = {};
        commentIds.forEach(commentId => {
          likesMap[commentId] = { count: 0, liked: false };
        });

        (likesData || []).forEach((like: { comment_id: string; user_id: string }) => {
          likesMap[like.comment_id] = {
            count: (likesMap[like.comment_id]?.count || 0) + 1,
            liked: userData.user?.id === like.user_id || likesMap[like.comment_id]?.liked || false
          };
        });

        setCommentLikes(likesMap);
      } else {
        setCommentLikes({});
      }
    }
  };

  useEffect(() => {
    refreshComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent, parentId: string | null = null, draftValue: string = newComment) => {
    e.preventDefault();
    const trimmedValue = draftValue.trim();
    if (!trimmedValue) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Vous devez être connecté pour interagir avec les commentaires.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const { error } = await supabase
      .from('blog_comments')
      .insert([{ blog_id: postId, user_id: user.id, content: trimmedValue, parent_id: parentId }]);

    if (!error) {
      setNewComment('');
      setReplyContent('');
      setReplyTo(null);
      await refreshComments();
    } else {
      setError(error.message || 'Impossible d\'ajouter le commentaire.');
    }

    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;

    const { error } = await supabase.from('blog_comments').delete().eq('id', commentId).eq('user_id', currentUserId || '');
    if (!error) {
      await refreshComments();
    } else {
      setError(error.message || 'Impossible de supprimer ce commentaire.');
    }
  };

  const handleEditComment = async (commentId: string) => {
    const trimmedValue = editContent.trim();
    if (!trimmedValue) return;

    const { error } = await supabase
      .from('blog_comments')
      .update({ content: trimmedValue, updated_at: new Date().toISOString() })
      .eq('id', commentId)
      .eq('user_id', currentUserId || '');

    if (!error) {
      setEditingCommentId(null);
      setEditContent('');
      await refreshComments();
    } else {
      setError(error.message || 'Impossible de modifier ce commentaire.');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Vous devez être connecté pour liker un commentaire.');
      return;
    }

    const isLiked = commentLikes[commentId]?.liked;
    if (isLiked) {
      await supabase.from('blog_comment_likes').delete().eq('comment_id', commentId).eq('user_id', user.id);
    } else {
      await supabase.from('blog_comment_likes').insert([{ comment_id: commentId, user_id: user.id }]);
    }

    await refreshComments();
  };

  const renderComment = (comment: { id: string; content: string; created_at: string; user_id: string; parent_id: string | null; users?: { username: string | null; avatar_url: string | null } }, depth = 0) => {
    const isAuthor = currentUserId === comment.user_id;
    const isEditing = editingCommentId === comment.id;
    const likes = commentLikes[comment.id];
    const children = comments.filter(item => item.parent_id === comment.id);

    return (
      <div key={comment.id} className={`rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm ${depth > 0 ? 'ml-4 border-l-2 border-l-gold/40' : ''}`}>
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-yellow-500 text-midnight font-bold flex items-center justify-center flex-shrink-0">
            {(comment.users?.username || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="font-bold text-[var(--brand-midnight)] dark:text-white">{comment.users?.username || 'Utilisateur'}</span>
              <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString('fr-FR')}</span>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleEditComment(comment.id)} className="rounded-lg bg-gold px-3 py-2 text-sm font-semibold text-midnight">Enregistrer</button>
                  <button onClick={() => { setEditingCommentId(null); setEditContent(''); }} className="rounded-lg border px-3 py-2 text-sm">Annuler</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{comment.content}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
              <button onClick={() => handleLikeComment(comment.id)} className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition ${likes?.liked ? 'bg-orange-50 text-orange-500' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <Flame className={`w-3.5 h-3.5 ${likes?.liked ? 'fill-current' : ''}`} />
                {likes?.count || 0}
              </button>
              <button onClick={() => { setReplyTo(comment.id); setReplyContent(''); setEditingCommentId(null); }} className="hover:text-[var(--brand-midnight)] dark:hover:text-white">Répondre</button>
              {isAuthor && !isEditing && (
                <>
                  <button onClick={() => { setEditingCommentId(comment.id); setEditContent(comment.content); }} className="hover:text-[var(--brand-midnight)] dark:hover:text-white">Modifier</button>
                  <button onClick={() => handleDeleteComment(comment.id)} className="hover:text-red-500">Supprimer</button>
                </>
              )}
            </div>

            {replyTo === comment.id && (
              <form onSubmit={(e) => handleSubmit(e, comment.id, replyContent)} className="mt-3 space-y-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={2}
                  placeholder="Répondre à ce commentaire..."
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm"
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={isSubmitting || !replyContent.trim()} className="rounded-lg bg-[var(--brand-midnight)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Publier</button>
                  <button type="button" onClick={() => { setReplyTo(null); setReplyContent(''); }} className="rounded-lg border px-3 py-2 text-sm">Annuler</button>
                </div>
              </form>
            )}

            {children.length > 0 && (
              <div className="mt-4 space-y-3">
                {children.map(child => renderComment(child, depth + 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-16 pt-10 border-t-2 border-gray-100 dark:border-gray-800" id="comments">
      <h3 className="text-2xl font-black text-[var(--brand-midnight)] dark:text-white mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-gold" />
        Commentaires ({comments.filter(item => item.parent_id === null).length})
      </h3>

      <form onSubmit={(e) => handleSubmit(e, null, newComment)} className="mb-10 relative">
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Partagez votre avis sur cet article..."
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 pr-16 focus:ring-2 focus:ring-gold focus:border-transparent outline-none resize-none transition-all dark:text-white"
          rows={3}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!newComment.trim() || isSubmitting}
          className="absolute bottom-4 right-4 w-10 h-10 bg-[var(--brand-midnight)] hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all shadow-md"
        >
          {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>

      <div className="space-y-4">
        {comments.filter(item => item.parent_id === null).length === 0 ? (
          <p className="text-sm text-gray-500">Aucun commentaire pour le moment. Soyez le premier à réagir.</p>
        ) : comments.filter(item => item.parent_id === null).map(comment => renderComment(comment))}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// MAIN PAGE
// -----------------------------------------------------------------------------
const NewBlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (slug) {
      fetchPost();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPost = async () => {
    try {
      setLoading(true);

      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (data) {
        setPost(data);

        const { data: likesData } = await supabase
          .from('blog_likes')
          .select('id', { count: 'exact' })
          .eq('blog_id', data.id);

        setLikeCount(likesData?.length || 0);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userLike } = await supabase
            .from('blog_likes')
            .select('id')
            .eq('blog_id', data.id)
            .eq('user_id', user.id)
            .maybeSingle();
          setLiked(!!userLike);
        }

        // Incrémenter les vues
        await supabase
          .from('blog_posts')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', data.id);

        // Charger les articles similaires
        const { data: related } = await supabase
          .from('blog_posts')
          .select('id, slug, title, excerpt, image_url, category, published_at, author')
          .eq('is_published', true)
          .eq('category', data.category)
          .neq('id', data.id)
          .order('published_at', { ascending: false })
          .limit(3);

        if (related) setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateReadingTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  const handleShare = () => {
    const shareUrl = `https://share.mideessi.com/blog/${post?.slug}`;
    if (navigator.share) {
      navigator.share({
        title: post?.title || 'MIDEESSI',
        text: post?.excerpt || 'Découvrez cet article sur MIDEESSI',
        url: shareUrl,
      }).catch((error) => {
        console.error('Erreur lors du partage:', error);
        setShareMenuOpen(!shareMenuOpen);
      });
    } else {
      setShareMenuOpen(!shareMenuOpen);
    }
  };

  const copyToClipboard = () => {
    const shareUrl = `https://share.mideessi.com/blog/${post?.slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform: string) => {
    const shareUrl = encodeURIComponent(`https://share.mideessi.com/blog/${post?.slug}`);
    const title = encodeURIComponent(post?.title || '');
    
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const toggleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (liked) {
      await supabase.from('blog_likes').delete().eq('blog_id', post?.id).eq('user_id', user.id);
      setLikeCount(prev => Math.max(0, prev - 1));
      setLiked(false);
    } else {
      await supabase.from('blog_likes').insert([{ blog_id: post?.id, user_id: user.id }]);
      setLikeCount(prev => prev + 1);
      setLiked(true);
    }
  };

  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.startsWith('# ')) {
          return <h1 key={index} className="text-3xl md:text-4xl font-black text-[var(--brand-midnight)] dark:text-white mt-12 mb-6 leading-tight">{paragraph.replace(/^# /, '')}</h1>;
        }
        if (paragraph.startsWith('## ')) {
          return <h2 key={index} className="text-2xl md:text-3xl font-bold text-[var(--brand-midnight)] dark:text-white mt-10 mb-5 leading-tight">{paragraph.replace(/^## /, '')}</h2>;
        }
        if (paragraph.startsWith('### ')) {
          return <h3 key={index} className="text-xl md:text-2xl font-bold text-[var(--brand-midnight)] dark:text-white mt-8 mb-4 leading-tight">{paragraph.replace(/^### /, '')}</h3>;
        }
        if (paragraph.startsWith('- ')) {
          const items = paragraph.split('\n');
          return (
            <ul key={index} className="space-y-3 my-6 pl-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-[var(--brand-gold)] rounded-full mt-2.5 flex-shrink-0"></span>
                  <span>{item.replace(/^- /, '')}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (paragraph.startsWith('> ')) {
          return (
            <blockquote key={index} className="my-8 pl-6 py-2 border-l-4 border-gold bg-gray-50/50 dark:bg-gray-800/30 rounded-r-xl">
              <p className="text-lg italic text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                {paragraph.replace(/^> /, '')}
              </p>
            </blockquote>
          );
        }
        const imgMatch = paragraph.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imgMatch) {
          return (
            <figure key={index} className="my-10">
              <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-100">
                <img src={toCloudinaryUrl(imgMatch[2], { width: 1400, height: 900, quality: 80, crop: 'fill' })} alt={imgMatch[1]} loading="lazy" className="w-full h-auto" />
              </div>
              {imgMatch[1] && <figcaption className="text-sm text-center text-gray-500 mt-3 italic">{imgMatch[1]}</figcaption>}
            </figure>
          );
        }
        let formattedText = paragraph
          .replace(/\*\*([^*]+?)\*\*/g, '<strong class="font-bold text-[var(--brand-midnight)] dark:text-white">$1</strong>')
          .replace(/\*([^*]+?)\*/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 dark:text-gold dark:hover:text-yellow-400 font-medium underline underline-offset-4 decoration-2 decoration-blue-600/30 hover:decoration-blue-600" target="_blank" rel="noopener noreferrer">$1</a>');

        return (
          <p
            key={index}
            className="text-lg text-gray-700 dark:text-gray-300 leading-[1.8] mb-6 font-serif"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
      });
  };

  if (loading) return <div className="min-h-screen pt-16 bg-white dark:bg-gray-900"><PostSkeleton /></div>;

  if (!post) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center px-4">
          <h1 className="text-3xl font-bold text-midnight dark:text-white mb-4">Article introuvable</h1>
          <Link to="/blog" className="inline-flex items-center px-6 py-3 bg-gold text-midnight font-bold rounded-full">Retour au blog</Link>
        </div>
      </div>
    );
  }

  // SOCIAL TOOLBAR (Vertical on desktop, horizontal on mobile)
  const SocialToolbar = ({ className = "" }) => (
    <div className={`flex items-center gap-4 ${className}`}>
      <button
        onClick={toggleLike}
        className={`group flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
          liked ? 'border-orange-500 bg-orange-50 text-orange-500' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-orange-500 hover:text-orange-500'
        }`}
      >
        <div className="flex flex-col items-center">
          <Flame className={`w-5 h-5 ${liked ? 'fill-current' : ''} group-hover:scale-110 transition-transform`} />
          <span className="text-[10px] font-bold mt-0.5">{likeCount}</span>
        </div>
      </button>
      
      <a
        href="#comments"
        className="group flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all"
      >
        <div className="flex flex-col items-center">
          <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold mt-0.5">💬</span>
        </div>
      </a>

      <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 hidden lg:block my-2" />
      
      <button
        onClick={handleShare}
        className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gold hover:text-gold transition-all"
      >
        <Share2 className="w-5 h-5" />
      </button>

      <button
        onClick={() => setBookmarked(!bookmarked)}
        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
          bookmarked ? 'border-midnight bg-midnight text-white dark:border-white dark:bg-white dark:text-midnight' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-midnight hover:text-midnight dark:hover:border-white dark:hover:text-white'
        }`}
      >
        <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 selection:bg-gold/30">
      <SEO
        title={`${post.title} | Blog MIDEESSI`}
        description={post.excerpt}
        image={toCloudinaryUrl(post.image_url, { width: 1400, height: 900, quality: 80, crop: 'fill' })}
        type="article"
      />

      <div className="fixed top-16 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-800 z-50">
        <div className="h-full bg-gold transition-all duration-150" style={{ width: `${readingProgress}%` }} />
      </div>

      {/* Main Layout: Sticky Sidebar + Article Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
        
        {/* Left Sticky Sidebar (Desktop only) */}
        <div className="hidden lg:block w-16 flex-shrink-0">
          <div className="sticky top-32 flex flex-col items-center gap-4">
            <SocialToolbar className="flex-col" />
          </div>
        </div>

        {/* Article Content */}
        <article className="flex-1 max-w-3xl w-full mx-auto lg:mx-0">
          
          <Link to="/blog" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gold mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour au journal
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-gold text-midnight rounded-md font-bold text-xs uppercase tracking-wider">
                {post.category}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                {new Date(post.published_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                <Clock className="w-4 h-4" /> {calculateReadingTime(post.content)} min
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[var(--brand-midnight)] dark:text-white leading-[1.1] mb-6">
              {post.title}
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-8 border-l-4 border-gold pl-4 py-1">
              {post.excerpt}
            </p>

            {/* Author Block */}
            <div className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <p className="font-bold text-[var(--brand-midnight)] dark:text-white">Par {post.author}</p>
                <p className="text-sm text-gray-500">Rédaction MIDEESSI</p>
              </div>
            </div>
          </header>

          <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl bg-gray-100 dark:bg-gray-800">
            <img src={toCloudinaryUrl(post.image_url, { width: 1600, height: 900, quality: 80, crop: 'fill' })} alt={post.title} className="w-full h-auto object-cover max-h-[600px]" />
          </div>

          <div className="prose-container">
            {formatContent(post.content)}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-10 py-6 border-y border-gray-100 dark:border-gray-800">
            {post.tags.map((tag, index) => (
              <span key={index} className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gold hover:text-midnight transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>

          {/* Mobile Social Toolbar */}
          <div className="lg:hidden mt-8 flex justify-center">
            <SocialToolbar className="flex-row" />
          </div>

          {/* Comment Section (Mocked) */}
          <CommentSection postId={post.id} />
          
        </article>

        {/* Right Sidebar (Optional for related posts or ads) */}
        <div className="hidden xl:block w-[300px] flex-shrink-0">
          <div className="sticky top-32">
            <h3 className="font-black text-lg text-[var(--brand-midnight)] dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <div className="w-2 h-2 bg-gold rounded-full" /> À lire aussi
            </h3>
            <div className="space-y-6">
              {relatedPosts.map(related => (
                <Link key={related.id} to={`/blog/${related.slug}`} className="group block">
                  <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-gray-100">
                    <img src={toCloudinaryUrl(related.image_url, { width: 600, height: 340, quality: 80, crop: 'fill' })} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h4 className="font-bold text-sm text-[var(--brand-midnight)] dark:text-white line-clamp-2 group-hover:text-gold transition-colors">{related.title}</h4>
                </Link>
              ))}
            </div>
            
            <div className="mt-10 p-6 bg-gradient-to-br from-[var(--brand-midnight)] to-black rounded-3xl text-center">
              <h4 className="text-white font-bold mb-2">Projet Digital ?</h4>
              <p className="text-gray-400 text-xs mb-4">Passez à la vitesse supérieure avec nos experts.</p>
              <Link to="/offres" className="block w-full py-2 bg-gold text-midnight font-bold rounded-xl text-sm hover:scale-105 transition-transform">
                Voir nos offres
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {shareMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShareMenuOpen(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4 text-center">Partager cet article</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => shareOnSocial('facebook')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                <Facebook className="w-6 h-6" /> <span className="text-sm font-medium">Facebook</span>
              </button>
              <button onClick={() => shareOnSocial('twitter')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors">
                <Twitter className="w-6 h-6" /> <span className="text-sm font-medium">Twitter</span>
              </button>
              <button onClick={() => shareOnSocial('linkedin')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                <Linkedin className="w-6 h-6" /> <span className="text-sm font-medium">LinkedIn</span>
              </button>
              <button onClick={copyToClipboard} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
                {copied ? <Check className="w-6 h-6 text-green-500" /> : <LinkIcon className="w-6 h-6" />} <span className="text-sm font-medium">{copied ? 'Copié !' : 'Lien'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewBlogPost;