import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Mail, Globe, Heart, MapPin, MessageSquare, BookOpen, Sparkles, Camera, ShieldCheck, Users, Edit3, Settings, ChevronLeft, Save, X } from 'lucide-react';
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
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    totalComments: 0,
    totalLikes: 0,
    articlesCommented: 0,
    booksReviewed: 0,
    contributionsScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({ username: '', avatar_url: '', bio: '', website: '', location: '' });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [username, currentUser]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const lookupUsername = username?.trim() || currentUser?.user_metadata?.username || currentUser?.email?.split('@')[0] || '';
      if (!lookupUsername) {
        setProfile(null);
        setError('Nom d’utilisateur introuvable');
        return;
      }
      const { data, error } = await supabase
        .from('users')
        .select('id,email,username,avatar_url,bio,created_at')
        .eq('username', lookupUsername)
        .maybeSingle();

      if (error) {
        console.error('[ProfileOverview] users query failed', error, { lookupUsername });
        if ((error as any).code !== 'PGRST116') throw error;
      }

      if (!data) {
        if (
          currentUser &&
          lookupUsername &&
          (currentUser.user_metadata?.username === lookupUsername || currentUser.email?.split('@')[0] === lookupUsername)
        ) {
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
          setFormData({
            username: fallbackProfile.username,
            avatar_url: '',
            bio: fallbackProfile.bio || '',
            website: '',
            location: '',
          });
        } else {
          setProfile(null);
          setError('Profil introuvable');
          return;
        }
      } else {
        const profileData = data as ProfileData;
        setProfile(profileData);
        setFormData({
          username: profileData.username || '',
          avatar_url: profileData.avatar_url || '',
          bio: profileData.bio || '',
          website: profileData.website || '',
          location: profileData.location || '',
        });
      }

      const userId = data?.id || currentUser?.id;
      const [{ data: blogComments }, { data: blogLikes }, { data: bookComments }, { data: bookLikes }] = await Promise.all([
        supabase.from('blog_comments').select('id').eq('user_id', userId),
        supabase.from('blog_likes').select('id').eq('user_id', userId),
        supabase.from('book_comments').select('id').eq('user_id', userId),
        supabase.from('book_likes').select('id').eq('user_id', userId),
      ]);

      const commentCount = (blogComments?.length || 0) + (bookComments?.length || 0);
      const likeCount = (blogLikes?.length || 0) + (bookLikes?.length || 0);

      setStats({
        totalComments: commentCount,
        totalLikes: likeCount,
        articlesCommented: blogComments?.length || 0,
        booksReviewed: bookComments?.length || 0,
        contributionsScore: commentCount * 2 + likeCount,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    try {
      setUploadingAvatar(true);
      setError('');
      const uploadedUrl = await uploadFileToCloudinary(file, `mideessi/avatars/${currentUser.id}`);
      setFormData((prev) => ({ ...prev, avatar_url: uploadedUrl }));
      setSuccessMessage('Avatar téléchargé avec succès.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec du téléchargement de l’avatar');
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!currentUser || !profile) return;
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const validation = validateProfileData({
        username: formData.username,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
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
        const { error } = await supabase
          .from('users')
          .upsert(payload, { onConflict: 'id' });

        if (!error) {
          lastError = null;
          break;
        }

        lastError = error as Error;
      }

      if (lastError) throw lastError;

      setProfile({
        ...profile,
        username: formData.username.trim(),
        avatar_url: formData.avatar_url?.trim() || null,
        bio: formData.bio?.trim() || null,
        website: formData.website?.trim() || null,
        location: formData.location?.trim() || null,
      });
      setSuccessMessage('Profil mis à jour avec succès.');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de mettre à jour le profil');
    } finally {
      setSaving(false);
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
          <p className="text-[var(--text-secondary)] font-semibold">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--brand-midnight)] mb-2">Profil introuvable</h1>
          <p className="text-[var(--text-secondary)] mb-8">L'utilisateur recherché n'existe pas ou a été supprimé.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-[var(--brand-midnight)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-900 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] pt-20 pb-16">
      <SEO title="Mon profil | MIDEESSI" description="Découvrez un profil complet, moderne et social sur MIDEESSI." />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cover & Header Card */}
        <div className="bg-white rounded-[32px] border border-[var(--border)] shadow-soft overflow-hidden mb-6 relative">
          {/* Cover Image Placeholder (Gradient) */}
          <div className="h-40 sm:h-48 bg-gradient-to-r from-[var(--brand-midnight)] via-blue-900 to-blue-800 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          </div>
          
          <div className="px-6 sm:px-10 pb-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
              <div className="flex items-end gap-5">
                <div className="relative group">
                  <div className="p-1.5 bg-white rounded-full inline-block">
                    <Avatar
                      name={profile?.username || 'Utilisateur'}
                      src={profile?.avatar_url}
                      size="lg"
                      className="h-28 w-28 sm:h-32 sm:w-32 rounded-full ring-4 ring-white shadow-md bg-gray-100"
                    />
                  </div>
                  {isOwnProfile && (
                    <button className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-gold)] text-midnight shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      <ShieldCheck className="h-3 w-3" /> Vérifié
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-800">
                      Membre
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[var(--brand-midnight)]">@{profile?.username || 'inconnu'}</h1>
                </div>
              </div>

              {isOwnProfile && (
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--brand-gold)] transition-colors"
                    >
                      <Edit3 className="w-4 h-4" /> Modifier
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--brand-midnight)] hover:opacity-90 transition-colors disabled:opacity-70"
                      >
                        <Save className="w-4 h-4" /> {saving ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setError('');
                          setSuccessMessage('');
                        }}
                        className="inline-flex items-center justify-center rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-2.5 text-[var(--text-secondary)] hover:text-[var(--brand-midnight)] hover:border-gray-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button className="inline-flex items-center justify-center rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-2.5 text-[var(--text-secondary)] hover:text-[var(--brand-midnight)] hover:border-gray-300 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}
            {successMessage && (
              <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">{successMessage}</div>
            )}

            {isEditing ? (
              <div className="space-y-3 mb-8">
                <input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-gold)]"
                  placeholder="Nom d’utilisateur"
                />
                <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-4">
                  <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Avatar</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="block w-full text-sm text-[var(--text-secondary)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--brand-gold)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--brand-midnight)] hover:file:opacity-90"
                  />
                  {uploadingAvatar && <p className="mt-2 text-sm text-[var(--text-secondary)]">Téléchargement en cours...</p>}
                  {formData.avatar_url && (
                    <div className="mt-3 flex items-center gap-3">
                      <Avatar name={formData.username || profile?.username || 'Utilisateur'} src={formData.avatar_url} size="sm" className="h-12 w-12 rounded-full border border-[var(--border)]" />
                      <p className="text-sm text-[var(--text-secondary)]">Avatar prêt à être enregistré.</p>
                    </div>
                  )}
                </div>
                <input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-gold)]"
                  placeholder="Localisation"
                />
                <input
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-gold)]"
                  placeholder="Site web"
                />
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-gold)]"
                  placeholder="Bio"
                />
              </div>
            ) : (
              <p className="max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] mb-8">
                {profile?.bio || 'Ajoutez une bio pour raconter votre histoire et donner plus de personnalité à votre profil. C’est ici que vous pouvez partager vos passions et vos projets.'}
              </p>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 border-t border-[var(--border)] pt-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-1">Activité</p>
                <p className="text-xl font-bold text-[var(--brand-midnight)]">{stats.totalComments + stats.totalLikes}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-1">Articles</p>
                <p className="text-xl font-bold text-[var(--brand-midnight)]">{stats.articlesCommented}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-1">Membre depuis</p>
                <p className="text-xl font-bold text-[var(--brand-midnight)]">{joinDate ? joinDate.split(' ')[2] : '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            {/* Completion Widget */}
            {isOwnProfile && profileCompletion < 100 && (
              <div className="bg-gradient-to-br from-gold/20 to-yellow-400/20 rounded-[24px] p-5 border border-gold/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-16 h-16" />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-yellow-800 font-bold mb-2">Profil à {profileCompletion}%</p>
                <h3 className="text-lg font-bold text-[var(--brand-midnight)] mb-2">Complétez votre profil</h3>
                <div className="w-full h-1.5 bg-white/50 rounded-full mb-4 overflow-hidden">
                  <div className="h-full bg-[var(--brand-gold)] rounded-full" style={{ width: `${profileCompletion}%` }} />
                </div>
                <Link to="/profile/edit" className="text-xs font-bold text-yellow-900 hover:underline">
                  Ajouter les infos manquantes →
                </Link>
              </div>
            )}

            {/* Contact & Info */}
            <div className="bg-white rounded-[24px] border border-[var(--border)] p-6 shadow-soft">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--brand-midnight)] mb-5">Informations</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--bg-surface)] rounded-lg text-[var(--brand-gold)]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">Email</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] break-all">{profile?.email || '—'}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--bg-surface)] rounded-lg text-[var(--brand-gold)]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">Localisation</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{profile?.location || 'Non renseignée'}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--bg-surface)] rounded-lg text-[var(--brand-gold)]">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">Site web</p>
                    {profile?.website ? (
                      <a href={profile.website} target="_blank" rel="noreferrer" className="text-sm font-medium text-[var(--brand-gold)] hover:underline break-all">{profile.website}</a>
                    ) : (
                      <p className="text-sm font-medium text-[var(--text-primary)]">Non renseigné</p>
                    )}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--bg-surface)] rounded-lg text-[var(--brand-gold)]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">Réseaux sociaux</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {profile?.social_links && Object.keys(profile.social_links).length > 0 
                        ? Object.keys(profile.social_links).join(', ') 
                        : 'Aucun lien ajouté'}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column (Main Content) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Activity Overview */}
            <div className="bg-white rounded-[24px] border border-[var(--border)] p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-[var(--brand-gold)]" />
                <h3 className="text-lg font-bold text-[var(--brand-midnight)]">Activité récente</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--brand-gold)]/50 transition-colors">
                  <MessageSquare className="w-6 h-6 text-blue-500 mb-3" />
                  <p className="text-2xl font-black text-[var(--brand-midnight)] mb-1">{stats.articlesCommented}</p>
                  <p className="text-xs font-semibold text-[var(--text-secondary)]">Articles de blog commentés</p>
                </div>
                
                <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--brand-gold)]/50 transition-colors">
                  <BookOpen className="w-6 h-6 text-emerald-500 mb-3" />
                  <p className="text-2xl font-black text-[var(--brand-midnight)] mb-1">{stats.booksReviewed}</p>
                  <p className="text-xs font-semibold text-[var(--text-secondary)]">Livres consultés / likés</p>
                </div>
              </div>
            </div>

            {/* Empty State for feed (Placeholder) */}
            <div className="bg-white rounded-[24px] border border-[var(--border)] p-10 text-center shadow-soft flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[var(--bg-surface)] rounded-full flex items-center justify-center mb-4 border border-[var(--border)]">
                <Heart className="w-6 h-6 text-gray-300" />
              </div>
              <h4 className="text-base font-bold text-[var(--brand-midnight)] mb-2">Aucune publication</h4>
              <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
                Le fil d'actualité et la galerie de contenus arriveront prochainement. Participez au blog pour voir votre activité ici !
              </p>
              <Link to="/blog" className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400 px-6 py-2.5 text-sm font-bold text-[var(--brand-midnight)] shadow-sm hover:scale-105 transition-all">
                Explorer le blog
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
