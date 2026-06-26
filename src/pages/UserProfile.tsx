import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Mail, Calendar, ArrowLeft, Edit2, MessageSquare, Heart, BookOpen, FileText } from 'lucide-react';
import SEO from '../components/SEO';

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

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', lookupUsername)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setUserData(data);

        const { data: blogComments } = await supabase
          .from('blog_comments')
          .select('id')
          .eq('user_id', data.id);

        const { data: blogLikes } = await supabase
          .from('blog_likes')
          .select('id')
          .eq('user_id', data.id);

        const { data: bookComments } = await supabase
          .from('book_comments')
          .select('id')
          .eq('user_id', data.id);

        const { data: bookLikes } = await supabase
          .from('book_likes')
          .select('id')
          .eq('user_id', data.id);

        setStats({
          totalComments: (blogComments?.length || 0) + (bookComments?.length || 0),
          totalLikes: (blogLikes?.length || 0) + (bookLikes?.length || 0),
          articlesCommented: blogComments?.length || 0,
          booksReviewed: bookComments?.length || 0
        });
        return;
      }

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
          avatar_url: null,
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold to-yellow-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-poppins">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gold hover:text-yellow-400 font-semibold mb-8 transition font-poppins"
          >
            <ArrowLeft size={20} /> Retour
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-poppins">Profil non trouvé</h1>
            <p className="text-slate-600 dark:text-slate-400 font-poppins">Cet utilisateur n'existe pas</p>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userData.id;
  const joinDate = new Date(userData.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <SEO
        title={`Profil de ${userData.username} | MIDEESSI`}
        description={`Consultez le profil de ${userData.username} - ${stats.totalComments} commentaires, ${stats.totalLikes} likes`}
        keywords={['profil', 'utilisateur', userData.username]}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gold hover:text-yellow-400 font-semibold mb-8 transition font-poppins"
          >
            <ArrowLeft size={20} /> Retour
          </button>

          {/* Profile Card */}
          <div className="rounded-2xl shadow-2xl overflow-hidden border bg-white/95 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">
            {/* Header Background */}
            <div className="h-40 bg-gradient-to-r from-midnight via-blue-900 to-midnight"></div>

            {/* Profile Content */}
            <div className="px-6 sm:px-8 pb-8">
              <div className="flex flex-col sm:flex-row gap-6 -mt-20 mb-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-gold to-yellow-500 border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center">
                    <span className="text-6xl font-bold text-slate-900 font-poppins">
                      {userData.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-grow mt-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 font-poppins">
                        @{userData.username}
                      </h1>
                      {userData.bio && (
                        <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl font-poppins">{userData.bio}</p>
                      )}
                    </div>
                    {isOwnProfile && (
                      <Link
                        to="/profile/edit"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold to-yellow-400 text-slate-900 rounded-lg font-bold hover:shadow-lg transition font-poppins whitespace-nowrap"
                      >
                        <Edit2 size={18} /> Modifier
                      </Link>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-6 mt-6 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="text-gold" />
                      <span className="font-poppins">{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-gold" />
                      <span className="font-poppins">Membre depuis {joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700/50">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700/50">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 font-poppins">
                    {stats.totalComments}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-2 font-poppins">
                    <MessageSquare size={16} /> Commentaires
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-6 border border-red-200 dark:border-red-700/50">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2 font-poppins">
                    {stats.totalLikes}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-2 font-poppins">
                    <Heart size={16} /> Likes donnés
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700/50">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2 font-poppins">
                    {stats.articlesCommented}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-2 font-poppins">
                    <FileText size={16} /> Articles commentés
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-6 border border-amber-200 dark:border-amber-700/50">
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2 font-poppins">
                    {stats.booksReviewed}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-2 font-poppins">
                    <BookOpen size={16} /> Livres examinés
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              {!isOwnProfile && (
                <div className="mt-8 p-6 bg-gold/5 dark:bg-gold/10 border border-gold/30 rounded-lg">
                  <p className="text-slate-700 dark:text-slate-300 font-poppins">
                    Intéressé par les contributions de @{userData.username}?{' '}
                    <Link to="/login" className="font-bold text-gold hover:text-yellow-400 transition">
                      Consultez l'article complet
                    </Link>
                  </p>
                </div>
              )}

              {isOwnProfile && (
                <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-700/30 border border-slate-300 dark:border-slate-600/50 rounded-lg">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-poppins flex items-center gap-2">
                    <FileText size={20} /> Vos contributions
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-poppins">
                    Vous avez écrit {stats.totalComments} commentaire{stats.totalComments !== 1 ? 's' : ''} et donné {stats.totalLikes} like{stats.totalLikes !== 1 ? 's' : ''} à la communauté MIDEESSI. Continuez comme ça! 🎉
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
