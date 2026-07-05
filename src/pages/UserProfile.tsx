import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Mail, Calendar, ArrowLeft, Edit2, MessageSquare, Heart, BookOpen, FileText, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { Avatar } from '../components/ui/Avatar';

interface UserData {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

interface UserStats {
  totalComments: number;
  totalLikes: number;
  articlesCommented: number;
  booksReviewed: number;
}

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<UserStats>({
    totalComments: 0,
    totalLikes: 0,
    articlesCommented: 0,
    booksReviewed: 0
  });

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const lookupUsername = username?.trim();
      if (!lookupUsername) {
        setUserData(null);
        setError('Nom d\'utilisateur introuvable');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', lookupUsername)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setUserData(data);

        const [
          { data: blogComments },
          { data: blogLikes },
          { data: bookComments },
          { data: bookLikes },
        ] = await Promise.all([
          supabase.from('blog_comments').select('id').eq('user_id', data.id),
          supabase.from('blog_likes').select('id').eq('user_id', data.id),
          supabase.from('book_comments').select('id').eq('user_id', data.id),
          supabase.from('book_likes').select('id').eq('user_id', data.id),
        ]);

        setStats({
          totalComments: (blogComments?.length || 0) + (bookComments?.length || 0),
          totalLikes: (blogLikes?.length || 0) + (bookLikes?.length || 0),
          articlesCommented: blogComments?.length || 0,
          booksReviewed: bookComments?.length || 0
        });
        return;
      }

      // Fallback for current user if not yet in DB
      const metadataUsername = currentUser?.user_metadata?.username?.toString().trim();
      const emailPrefix = currentUser?.email?.split('@')[0]?.toLowerCase();
      const isCurrentUserProfile = Boolean(
        currentUser &&
        lookupUsername &&
        (metadataUsername?.toLowerCase() === lookupUsername.toLowerCase() ||
          emailPrefix?.toLowerCase() === lookupUsername.toLowerCase())
      );

      if (isCurrentUserProfile) {
        setUserData({
          id: currentUser.id,
          email: currentUser.email || '',
          username: lookupUsername || metadataUsername || emailPrefix || 'utilisateur',
          avatar_url: (currentUser.user_metadata?.avatar_url as string | null) || null,
          bio: null,
          created_at: currentUser.created_at || new Date().toISOString(),
        });
        setStats({ totalComments: 0, totalLikes: 0, articlesCommented: 0, booksReviewed: 0 });
        setError('');
        return;
      }

      setUserData(null);
      setError('Profil introuvable');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--brand-gold)] border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-poppins">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] pt-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[var(--brand-gold)] hover:text-yellow-400 font-semibold mb-8 transition font-poppins text-sm"
          >
            <ArrowLeft size={18} /> Retour
          </button>
          <div className="w-16 h-16 rounded-full bg-[var(--brand-midnight)] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">😕</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--brand-midnight)] dark:text-white mb-2">Profil non trouvé</h1>
          <p className="text-gray-500 dark:text-gray-400">Cet utilisateur n'existe pas sur MIDEESSI.</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userData.id;
  const joinDate = new Date(userData.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
  });

  const statCards = [
    { label: 'Commentaires', value: stats.totalComments, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50' },
    { label: 'Likes donnés', value: stats.totalLikes, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50' },
    { label: 'Articles', value: stats.articlesCommented, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/50' },
    { label: 'Livres critiqués', value: stats.booksReviewed, icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50' },
  ];

  return (
    <>
      <SEO
        title={`Profil de ${userData.username} | MIDEESSI`}
        description={`Consultez le profil de ${userData.username} - ${stats.totalComments} commentaires, ${stats.totalLikes} likes`}
        keywords={['profil', 'utilisateur', userData.username]}
      />

      <div className="min-h-screen bg-[var(--bg-page)] pb-16">
        {/* Hero header */}
        <div className="relative bg-[var(--brand-midnight)] pt-24 pb-32 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-[var(--brand-gold)]/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-blue-900/15 rounded-full blur-[80px]" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-[var(--brand-gold)] transition-colors mb-6"
            >
              <ArrowLeft size={14} /> Retour
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar
                  name={userData.username}
                  src={userData.avatar_url}
                  size="xl"
                  className="ring-4 ring-white/20 shadow-2xl"
                />
                {isOwnProfile && (
                  <Link
                    to="/profile/edit"
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--brand-gold)] flex items-center justify-center shadow-lg hover:bg-yellow-400 transition-colors"
                    title="Modifier mon avatar"
                  >
                    <Edit2 size={12} className="text-[var(--brand-midnight)]" />
                  </Link>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[var(--brand-gold)]">
                        <Sparkles size={8} className="inline mr-0.5" /> Membre MIDEESSI
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white">@{userData.username}</h1>
                    {userData.bio && (
                      <p className="mt-1 text-sm text-gray-300/80 max-w-xl leading-relaxed">{userData.bio}</p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-[var(--brand-gold)]" />
                        Membre depuis {joinDate}
                      </span>
                      {isOwnProfile && (
                        <span className="flex items-center gap-1">
                          <Mail size={12} className="text-[var(--brand-gold)]" />
                          {userData.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {isOwnProfile && (
                    <Link
                      to="/profile/edit"
                      className="flex items-center gap-1.5 px-4 py-2 bg-[var(--brand-gold)] text-[var(--brand-midnight)] rounded-xl font-black text-xs hover:bg-yellow-400 transition-colors shadow-lg"
                    >
                      <Edit2 size={12} /> Modifier mon profil
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statCards.map(card => (
              <div
                key={card.label}
                className={`rounded-2xl border p-4 sm:p-5 shadow-sm ${card.bg} bg-white dark:bg-gray-900`}
              >
                <div className={`flex items-center gap-1.5 mb-2 ${card.color}`}>
                  <card.icon size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">{card.label}</span>
                </div>
                <p className={`text-2xl sm:text-3xl font-black ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Contributions message */}
          <div className="mt-6 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-[var(--border)] shadow-sm">
            {isOwnProfile ? (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[var(--brand-gold)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles size={14} className="text-[var(--brand-gold)]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[var(--brand-midnight)] dark:text-white mb-1">Vos contributions</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Vous avez écrit <strong className="text-[var(--brand-midnight)] dark:text-white">{stats.totalComments}</strong> commentaire{stats.totalComments !== 1 ? 's' : ''} et donné{' '}
                    <strong className="text-[var(--brand-midnight)] dark:text-white">{stats.totalLikes}</strong> like{stats.totalLikes !== 1 ? 's' : ''} à la communauté. Continuez comme ça ! 🎉
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <Avatar name={userData.username} src={userData.avatar_url} size="sm" />
                <div>
                  <h3 className="text-sm font-black text-[var(--brand-midnight)] dark:text-white mb-1">
                    À propos de @{userData.username}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {userData.bio || `Membre actif de la communauté MIDEESSI avec ${stats.totalComments} contribution${stats.totalComments !== 1 ? 's' : ''}.`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
