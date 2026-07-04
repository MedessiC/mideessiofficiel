import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Mail, Globe, Heart, MapPin, MessageSquare, BookOpen, Sparkles, 
  Camera, ShieldCheck, Users, Edit3, Settings, ChevronLeft, Save, 
  X, Trash2, ShieldAlert, Award, Lock
} from 'lucide-react';
import SEO from '../components/SEO';
import { Avatar } from '../components/ui/Avatar';
import { validateProfileData } from '../utils/authProfile';
import { uploadFileToCloudinary } from '../lib/cloudinary';
import { getProfileSavePayloadAttempts } from '../utils/profilePersistence';

interface ProfileData {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  website?: string | null;
  location?: string | null;
  phone?: string | null;
  social_links?: Record<string, string> | null;
  is_library_public?: boolean;
}

interface ProfileStats {
  totalComments: number;
  totalLikes: number;
  articlesCommented: number;
  booksReviewed: number;
  contributionsScore: number;
}

export default function ProfileOverview() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    totalComments: 0,
    totalLikes: 0,
    articlesCommented: 0,
    booksReviewed: 0,
    contributionsScore: 0,
    attemptsCount: 0,
    avgQuizScore: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({ username: '', avatar_url: '', bio: '', website: '', location: '' });
  
  const [activeTab, setActiveTab] = useState<'activity' | 'about' | 'settings'>('activity');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [isLibraryPublic, setIsLibraryPublic] = useState(true);
  const [readBooks, setReadBooks] = useState<{ id: string; title: string; cover_url: string | null; progress_percent: number }[]>([]);

  useEffect(() => {
    fetchProfile();
  }, [username, currentUser]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      const lookupUsername = username?.trim() || currentUser?.user_metadata?.username || currentUser?.email?.split('@')[0] || '';
      
      if (!lookupUsername) {
        setProfile(null);
        setError('Nom d’utilisateur introuvable');
        return;
      }

      let result = await supabase
        .from('users')
        .select('id,email,username,avatar_url,bio,website,location,social_links,created_at,is_library_public')
        .eq('username', lookupUsername)
        .maybeSingle();

      if (result.error && (result.error.code === '42703' || result.error.status === 400)) {
        result = await supabase
          .from('users')
          .select('id,email,username,avatar_url,bio,created_at')
          .eq('username', lookupUsername)
          .maybeSingle();
      }

      const { data, error } = result;

      if (error && (error as any).code !== 'PGRST116') throw error;

      if (!data) {
        if (currentUser && (currentUser.user_metadata?.username === lookupUsername || currentUser.email?.split('@')[0] === lookupUsername)) {
          const emailUsername = currentUser.email?.split('@')[0] || 'utilisateur';
          const fallbackProfile = {
            id: currentUser.id,
            email: currentUser.email || '',
            username: emailUsername,
            avatar_url: null,
            bio: 'Bienvenue sur votre profil MIDEESSI.',
            created_at: currentUser.created_at || new Date().toISOString(),
          };
          setProfile(fallbackProfile as ProfileData);
          setFormData({ username: fallbackProfile.username, avatar_url: '', bio: fallbackProfile.bio || '', website: '', location: '' });
        } else {
          setProfile(null);
          setError('Profil introuvable');
          return;
        }
      } else {
        const profileData = data as ProfileData;
        setProfile(profileData);
        setIsLibraryPublic(profileData.is_library_public !== false); // default true
        setFormData({
          username: profileData.username || '',
          avatar_url: profileData.avatar_url || '',
          bio: profileData.bio || '',
          website: profileData.website || '',
          location: profileData.location || '',
        });
      }

      const userId = data?.id || currentUser?.id;
      if (userId) {
        const [{ data: blogComments }, { data: blogLikes }, { data: bookComments }, { data: bookLikes }, { data: quizAttempts }] = await Promise.all([
          supabase.from('blog_comments').select('id').eq('user_id', userId),
          supabase.from('blog_likes').select('id').eq('user_id', userId),
          supabase.from('book_comments').select('id').eq('user_id', userId),
          supabase.from('book_likes').select('id').eq('user_id', userId),
          supabase.from('user_quiz_attempts').select('score, total_questions').eq('user_id', userId),
        ]);

        const commentCount = (blogComments?.length || 0) + (bookComments?.length || 0);
        const likeCount = (blogLikes?.length || 0) + (bookLikes?.length || 0);

        let totalCorrect = 0;
        let totalQuestions = 0;
        if (quizAttempts) {
          quizAttempts.forEach((a: any) => {
            totalCorrect += Number(a.score || 0);
            totalQuestions += Number(a.total_questions || 0);
          });
        }
        const avgScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        setStats({
          totalComments: commentCount,
          totalLikes: likeCount,
          articlesCommented: blogComments?.length || 0,
          booksReviewed: bookComments?.length || 0,
          contributionsScore: commentCount * 2 + likeCount + (totalCorrect * 5),
          attemptsCount: quizAttempts?.length || 0,
          avgQuizScore: avgScore
        });

        // Fetch read books (from book_progress joined with books)
        const profileIsPublic = (data as any)?.is_library_public !== false;
        const canSeeBooks = profileIsPublic || data?.id === currentUser?.id;
        if (canSeeBooks) {
          const { data: progressData } = await supabase
            .from('book_progress')
            .select('progress_percent, books(id, title, cover_url)')
            .eq('user_id', userId)
            .gte('progress_percent', 5)
            .order('updated_at', { ascending: false })
            .limit(12);

          if (progressData) {
            setReadBooks(
              progressData
                .filter((p: any) => p.books)
                .map((p: any) => ({
                  id: p.books.id,
                  title: p.books.title,
                  cover_url: p.books.cover_url,
                  progress_percent: p.progress_percent,
                }))
            );
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setUploadingAvatar(true);
    setError('');
    try {
      const url = await uploadFileToCloudinary(file, `mideessi/avatars/${currentUser.id}`);
      setFormData(prev => ({ ...prev, avatar_url: url }));
      setSuccessMessage('Avatar téléversé avec succès. N’oubliez pas de sauvegarder.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du téléversement de l’image');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser || !profile) return;
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const validation = validateProfileData({
        username: formData.username.trim(),
        bio: formData.bio,
      });

      if (!validation.valid) {
        setError(validation.message || 'Profil invalide');
        return;
      }

      const payloadAttempts = getProfileSavePayloadAttempts({
        id: currentUser.id,
        email: currentUser.email || '',
        username: formData.username.trim(),
        avatar_url: formData.avatar_url,
        bio: formData.bio,
        website: formData.website,
        location: formData.location,
      });

      let lastError: Error | null = null;
      for (const payload of payloadAttempts) {
        const fullPayload = { ...payload, is_library_public: isLibraryPublic };
        const { error } = await supabase.from('users').upsert(fullPayload, { onConflict: 'id' });
        if (!error) { lastError = null; break; }
        lastError = error as Error;
      }

      if (lastError) throw lastError;

      setProfile({
        ...profile,
        id: profile?.id || currentUser.id,
        email: profile?.email || currentUser.email || '',
        created_at: profile?.created_at || new Date().toISOString(),
        username: formData.username.trim(),
        avatar_url: formData.avatar_url?.trim() || null,
        bio: formData.bio?.trim() || null,
        website: formData.website?.trim() || null,
        location: formData.location?.trim() || null,
      });
      setSuccessMessage('Profil mis à jour avec succès.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de mettre à jour le profil');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    setDeletingAccount(true);
    setError('');

    try {
      const { error: rpcError } = await supabase.rpc('delete_user_account');
      if (rpcError) {
        const { error: dbError } = await supabase.from('users').delete().eq('id', currentUser.id);
        if (dbError) throw dbError;
      }
      await signOut();
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de supprimer votre compte.');
    } finally {
      setDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  const joinDate = profile ? new Date(profile.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : '';
  const isOwnProfile = profile?.id === currentUser?.id;
  const profileCompletion = profile
    ? Math.min(100, Math.round(([profile.username, profile.bio, profile.avatar_url, profile.website, profile.location].filter(Boolean).length / 5) * 100))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--brand-gold)]"></div>
          <p className="text-[var(--text-secondary)] font-semibold text-xs uppercase tracking-wider">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--brand-midnight)] dark:text-white mb-2">Profil introuvable</h1>
          <p className="text-[var(--text-secondary)] mb-8">L'utilisateur recherché n'existe pas ou a été supprimé.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-[var(--brand-midnight)] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-95 transition-opacity">
            <ChevronLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] dark:bg-gray-950 pt-20 pb-16 font-poppins text-[var(--text-primary)]">
      <SEO title={`@${profile.username} | Espace MIDEESSI`} description={`Profil d'apprentissage et de contribution MIDEESSI.`} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-3xl overflow-hidden shadow-md mb-6">
          <div className="h-44 sm:h-64 bg-gradient-to-r from-[var(--brand-midnight)] via-blue-900 to-indigo-950 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 -mt-16 sm:-mt-24 mb-5 border-b border-[var(--border)] pb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                <div className="relative group">
                  <div className="p-1 bg-white dark:bg-gray-900 rounded-full inline-block shadow-lg">
                    <Avatar
                      name={profile.username}
                      src={profile.avatar_url}
                      className="h-28 w-28 sm:h-36 sm:w-36 rounded-full border border-gray-100 dark:border-gray-800"
                    />
                  </div>
                  {isOwnProfile && (
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-gold)] hover:bg-yellow-400 text-midnight shadow-md transition-all active:scale-95"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-1.5 pb-2">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-midnight dark:text-white">
                      @{profile.username}
                    </h1>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-500/10 text-blue-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                      <ShieldCheck className="h-3 w-3" /> Vérifié
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm sm:max-w-none">
                    {profile.bio || 'Aucune biographie rédigée.'}
                  </p>
                </div>
              </div>
              {isOwnProfile && (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                      activeTab === 'settings' 
                        ? 'bg-[var(--brand-midnight)] text-white' 
                        : 'bg-[var(--bg-surface)] border border-[var(--border)] text-midnight dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" /> Éditer le profil
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-2.5 text-midnight dark:text-white hover:border-red-300 transition-colors"
                  >
                    <Settings className="w-4.5 h-4.5" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-2 text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400">
              <button
                onClick={() => setActiveTab('activity')}
                className={`pb-1 px-3 border-b-2 transition-all ${
                  activeTab === 'activity' 
                    ? 'border-[var(--brand-gold)] text-midnight dark:text-white font-black' 
                    : 'border-transparent hover:text-midnight dark:hover:text-white'
                }`}
              >
                Activité
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`pb-1 px-3 border-b-2 transition-all ${
                  activeTab === 'about' 
                    ? 'border-[var(--brand-gold)] text-midnight dark:text-white font-black' 
                    : 'border-transparent hover:text-midnight dark:hover:text-white'
                }`}
              >
                À propos
              </button>
              {isOwnProfile && (
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`pb-1 px-3 border-b-2 transition-all ${
                    activeTab === 'settings' 
                      ? 'border-[var(--brand-gold)] text-midnight dark:text-white font-black' 
                      : 'border-transparent hover:text-midnight dark:hover:text-white'
                  }`}
                >
                  Paramètres
                </button>
              )}
            </div>
          </div>
        </div>
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">{error}</div>
        )}
        {successMessage && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3.5 text-xs font-semibold text-green-700">{successMessage}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {activeTab !== 'settings' && (
            <div className="md:col-span-4 space-y-6">
              <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-midnight dark:text-white">Intro</h3>
                <ul className="space-y-3.5 text-xs text-gray-700 dark:text-gray-300">
                  {profile.location && (
                    <li className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                      <span>Habite à <span className="font-bold">{profile.location}</span></span>
                    </li>
                  )}
                  {profile.website && (
                    <li className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <a href={profile.website} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate">
                        {profile.website.replace(/(^\w+:|^)\/\//, '')}
                      </a>
                    </li>
                  )}
                  <li className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Membre depuis {joinDate}</span>
                  </li>
                </ul>
                {isOwnProfile && profileCompletion < 100 && (
                  <div className="pt-3 border-t border-[var(--border)] space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500">
                      <span>Profil complété</span>
                      <span>{profileCompletion}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${profileCompletion}%` }} />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Quiz progress card (Midnight/Gold style) */}
              <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-midnight dark:text-white flex items-center gap-1.5">
                  <Award size={14} className="text-gold" /> Quiz Académiques
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Quiz complétés</span>
                    <span className="font-bold text-midnight dark:text-white">{stats.attemptsCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Score de réussite moyen</span>
                    <span className="font-bold text-gold">{stats.avgQuizScore}%</span>
                  </div>
                  
                  {stats.attemptsCount > 0 && (
                    <div className="pt-2 border-t border-[var(--border)] space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-gray-500">
                        <span>Réussite moyenne</span>
                        <span>{stats.avgQuizScore}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400 rounded-full transition-all" 
                          style={{ width: `${stats.avgQuizScore}%` }} 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-wider text-midnight dark:text-white flex items-center gap-1">
                  <Award size={14} className="text-gold" /> Contributions
                </h3>
                <div className="mt-4 text-center py-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl">
                  <span className="text-2xl font-black text-midnight dark:text-white">{stats.contributionsScore}</span>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black mt-1">Score d'Apprentissage</p>
                </div>
              </div>
            </div>
          )}
          <div className={`${activeTab === 'settings' ? 'md:col-span-12' : 'md:col-span-8'} space-y-6`}>
            {activeTab === 'activity' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-5 shadow-sm">
                    <MessageSquare className="w-6 h-6 text-blue-500 mb-2" />
                    <p className="text-xl font-black text-midnight dark:text-white">{stats.totalComments}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Commentaires postés</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-5 shadow-sm">
                    <Heart className="w-6 h-6 text-red-500 mb-2" />
                    <p className="text-xl font-black text-midnight dark:text-white">{stats.totalLikes}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Favoris & Likes</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-8 text-center shadow-sm">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-5 h-5 text-gray-400" />
                  </div>
                  <h4 className="text-sm font-bold text-midnight dark:text-white">Fil d'activité</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1 leading-normal">
                    Toutes vos contributions sur les ebooks et vos activités d'apprentissage MIDEESSI apparaîtront ici.
                  </p>
                  <Link 
                    to="/blog" 
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gold text-midnight font-black text-xs px-5 py-2.5 hover:bg-yellow-400 transition-all shadow-sm"
                  >
                    Parcourir les articles
                  </Link>
                </div>

                {/* Bibliothèque lue */}
                <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-5 shadow-sm">
                  <h3 className="text-sm font-black text-midnight dark:text-white mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--brand-gold)]" />
                    Bibliothèque lue
                    {!isOwnProfile && !profile.is_library_public && (
                      <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400">
                        <Lock className="w-3 h-3" /> Privée
                      </span>
                    )}
                  </h3>
                  {readBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {readBooks.map((book) => (
                        <Link
                          key={book.id}
                          to={`/library/${book.id}`}
                          className="group flex flex-col gap-2 p-2 rounded-xl border border-[var(--border)] hover:border-[var(--brand-gold)]/40 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                        >
                          <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {book.cover_url ? (
                              <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] font-bold text-midnight dark:text-white line-clamp-2 leading-tight">{book.title}</p>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1">
                            <div
                              className="bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400 h-1 rounded-full transition-all"
                              style={{ width: `${Math.min(book.progress_percent, 100)}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-gray-400 font-semibold">{book.progress_percent}% lu</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      {!isOwnProfile && !profile.is_library_public ? (
                        <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" /> Cet utilisateur a rendu sa bibliothèque privée.
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400">Aucun livre lu pour le moment.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-black text-midnight dark:text-white mb-2">Description</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                    {profile.bio || "Cet utilisateur n'a pas encore partagé d'histoire."}
                  </p>
                </div>
                <div className="pt-5 border-t border-[var(--border)] grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email</span>
                    <span className="font-semibold text-midnight dark:text-white">{profile.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Identifiant</span>
                    <span className="font-semibold text-midnight dark:text-white">@{profile.username}</span>
                  </div>
                  {profile.location && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Adresse</span>
                      <span className="font-semibold text-midnight dark:text-white">{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Site internet</span>
                      <a href={profile.website} target="_blank" rel="noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        {profile.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'settings' && isOwnProfile && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-midnight dark:text-white pb-2 border-b border-[var(--border)]">
                    Modifier les informations
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Nom d'utilisateur</label>
                      <input
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs text-midnight dark:text-white outline-none focus:border-gold"
                        placeholder="Nom d’utilisateur"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Avatar de profil</label>
                      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-surface)] p-4 flex flex-col sm:flex-row items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="block w-full text-xs text-gray-500 file:mr-4 file:rounded-xl file:border-0 file:bg-midnight file:text-white file:px-4 file:py-2 file:text-xs file:font-bold hover:file:opacity-90 cursor-pointer"
                        />
                        {uploadingAvatar && <p className="text-[10px] text-gray-400">Téléversement...</p>}
                        {formData.avatar_url && (
                          <div className="flex-shrink-0">
                            <Avatar name={formData.username} src={formData.avatar_url} className="h-10 w-10 rounded-full border" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Localisation</label>
                      <input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs text-midnight dark:text-white outline-none focus:border-gold"
                        placeholder="Ex: Cotonou, Bénin"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Site internet</label>
                      <input
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs text-midnight dark:text-white outline-none focus:border-gold"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Biographie</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs text-midnight dark:text-white outline-none focus:border-gold resize-none"
                        placeholder="Parlez-nous de vous..."
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[var(--border)] flex gap-2 justify-end">
                    <button
                      onClick={() => setActiveTab('activity')}
                      className="inline-flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-midnight dark:hover:text-white text-xs font-bold px-4 py-2.5 transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gold text-midnight text-xs font-black px-5 py-2.5 hover:bg-yellow-400 transition-all shadow-sm disabled:opacity-50"
                    >
                      <Save size={13} /> {saving ? 'Enregistrement...' : 'Sauvegarder'}
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-3">
                    <h3 className="text-sm font-black text-midnight dark:text-white pb-2 border-b border-[var(--border)]">
                      Compte
                    </h3>
                    <p className="text-[10px] text-gray-400 leading-normal">
                      Votre compte est actuellement actif et configuré. Les informations ci-dessus définissent votre présence publique.
                    </p>
                  </div>

                  {/* Privacy toggle */}
                  <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-midnight dark:text-white pb-2 border-b border-[var(--border)] flex items-center gap-2">
                      <ShieldCheck size={15} className="text-emerald-500" /> Confidentialité
                    </h3>
                    <div className="flex items-start gap-3">
                      <button
                        id="library-public-toggle"
                        onClick={() => setIsLibraryPublic(p => !p)}
                        className={`relative flex-shrink-0 mt-0.5 w-10 h-5 rounded-full transition-all duration-300 focus:outline-none ${
                          isLibraryPublic ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        aria-label="Rendre la bibliothèque publique"
                      >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
                          isLibraryPublic ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                      <div>
                        <p className="text-xs font-bold text-midnight dark:text-white">
                          Bibliothèque publique
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                          {isLibraryPublic
                            ? 'Votre liste de livres lus est visible par tous les autres utilisateurs sur votre profil.'
                            : 'Votre bibliothèque est privée. Seul vous pouvez voir vos livres lus.'}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-normal border-t border-[var(--border)] pt-3">
                      ⚠️ Votre score de quiz reste toujours visible publiquement.
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-5 shadow-sm space-y-3.5">
                    <h3 className="text-sm font-black text-red-700 dark:text-red-400 flex items-center gap-1.5">
                      <ShieldAlert size={16} /> Zone de danger
                    </h3>
                    <p className="text-[11px] text-red-600/90 dark:text-red-300 leading-normal">
                      La suppression de votre compte est définitive. Toutes vos données d'apprentissage, vos likes et vos configurations seront immédiatement effacés.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 transition-all shadow-sm active:scale-95"
                    >
                      <Trash2 size={13} /> Supprimer mon compte
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 border border-[var(--border)] max-w-sm w-full rounded-2xl p-5 shadow-2xl space-y-4 text-center animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-black text-midnight dark:text-white">Confirmer la suppression</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                Êtes-vous absolument sûr de vouloir supprimer définitivement votre compte MIDEESSI ? Cette action est irréversible.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletingAccount}
                className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-white text-xs font-bold py-2.5 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black py-2.5 transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                {deletingAccount ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
