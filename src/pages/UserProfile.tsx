import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Mail, MapPin, Calendar, BookOpen, ArrowLeft, Edit2 } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ likes: 0, booksRead: 0, pagesRead: 0 });

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Récupérer les données de l'utilisateur
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      setUserData(data);

      // Récupérer les stats de lecture si disponibles
      if (data) {
        const { data: statsData } = await supabase
          .from('reading_stats')
          .select('*')
          .eq('user_id', data.id)
          .single();

        if (statsData) {
          setStats({
            likes: 0, // À implémenter selon vos statistiques de likes
            booksRead: statsData.books_completed,
            pagesRead: statsData.total_pages_read,
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#ffd700] to-[#ffed4e] animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#ffd700] hover:text-[#ffed4e] font-semibold mb-8 transition"
          >
            <ArrowLeft size={20} /> Retour
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profil non trouvé</h1>
            <p className="text-gray-600 dark:text-gray-400">Cet utilisateur n'existe pas</p>
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
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#ffd700] hover:text-[#ffed4e] font-semibold mb-8 transition"
        >
          <ArrowLeft size={20} /> Retour
        </button>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-[#ffd700]/20 shadow-2xl overflow-hidden">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-[#191970] via-[#2d2990] to-[#191970]"></div>

          {/* Profile Content */}
          <div className="px-6 pb-8">
            <div className="flex flex-col sm:flex-row gap-6 -mt-16 mb-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#ffd700] to-[#ffed4e] border-4 border-white dark:border-gray-800 shadow-xl flex items-center justify-center">
                  <span className="text-5xl font-bold text-[#191970]">
                    {userData.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-grow mt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-[#191970] dark:text-white mb-1" style={{ fontFamily: 'Montserrat' }}>
                      @{userData.username}
                    </h1>
                    {userData.bio && (
                      <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">{userData.bio}</p>
                    )}
                  </div>
                  {isOwnProfile && (
                    <Link
                      to="/profile/edit"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#191970] rounded-lg font-semibold hover:shadow-lg transition"
                    >
                      <Edit2 size={18} /> Modifier
                    </Link>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-[#ffd700]" />
                    {userData.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-[#ffd700]" />
                    Membre depuis {joinDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t-2 border-[#ffd700]/20">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stats.booksRead}</div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">Livres complétés</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{stats.pagesRead}</div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">Pages lues</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-6 border border-amber-200 dark:border-amber-700">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">{stats.likes}</div>
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-amber-600 dark:text-amber-400" />
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">Ebooks likés</p>
                </div>
              </div>
            </div>

            {/* Coming Soon */}
            {isOwnProfile && (
              <div className="mt-8 p-6 bg-[#ffd700]/10 border-2 border-[#ffd700]/30 rounded-lg">
                <h3 className="text-lg font-bold text-[#191970] dark:text-[#ffd700] mb-2">📚 Mes Ebooks</h3>
                <p className="text-gray-600 dark:text-gray-400">La section pour gérer vos ebooks sera bientôt disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
