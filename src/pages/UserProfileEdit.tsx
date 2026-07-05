import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { uploadFileToCloudinary } from '../lib/cloudinary';
import SEO from '../components/SEO';
import { validateProfileData } from '../utils/authProfile';
import { Avatar } from '../components/ui/Avatar';
import { Camera, Check, X, ArrowLeft, User, FileText, Link2, Loader2 } from 'lucide-react';

interface ProfileForm {
  username: string;
  avatar_url: string;
  bio: string;
}

export default function UserProfileEdit() {
  const navigate = useNavigate();
  const { user, refreshUserProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProfileForm>({
    username: '',
    avatar_url: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from('users')
        .select('username, avatar_url, bio')
        .eq('id', user.id)
        .maybeSingle();

      setFormData({
        username: data?.username || (user.user_metadata?.username as string | undefined)?.trim() || user.email?.split('@')[0] || '',
        avatar_url: data?.avatar_url || (user.user_metadata?.avatar_url as string | undefined) || '',
        bio: data?.bio || '',
      });
    } catch (err: any) {
      setError(err.message || 'Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image (JPG, PNG, WebP, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image doit faire moins de 5 Mo');
      return;
    }

    setUploadingAvatar(true);
    setError('');
    try {
      const url = await uploadFileToCloudinary(file, 'mideessi/avatars', 'auto');
      setFormData(prev => ({ ...prev, avatar_url: url }));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'upload de l\'avatar');
    } finally {
      setUploadingAvatar(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const profileValidation = validateProfileData({
        username: formData.username,
        avatar_url: formData.avatar_url,
        bio: formData.bio,
      });

      if (!profileValidation.valid) {
        setError(profileValidation.message || 'Profil invalide');
        setSaving(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email || '',
          username: formData.username.trim(),
          avatar_url: formData.avatar_url?.trim() || null,
          bio: formData.bio?.trim() || null,
        }, { onConflict: 'id' });

      if (updateError) throw updateError;

      // Refresh the global profile context so Navbar & comments update immediately
      await refreshUserProfile();
      setSuccess('Profil mis à jour avec succès !');
    } catch (err: any) {
      setError(err.message || 'Impossible de mettre à jour le profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--brand-gold)] border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] pt-24 pb-16 px-4">
      <SEO title="Modifier mon profil | MIDEESSI" description="Personnalisez votre profil utilisateur MIDEESSI." />

      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[var(--brand-gold)] transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Retour
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--brand-gold)]">Mon compte</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-[var(--brand-midnight)] dark:text-white">
            Modifier mon profil
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Personnalisez votre identité sur MIDEESSI. Votre avatar apparaîtra sur tous vos commentaires et likes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload Section */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-[var(--border)] p-6 shadow-sm">
            <h2 className="text-sm font-black text-[var(--brand-midnight)] dark:text-white mb-4 flex items-center gap-2">
              <Camera size={16} className="text-[var(--brand-gold)]" />
              Photo de profil
            </h2>

            <div className="flex items-center gap-5">
              {/* Avatar preview */}
              <div className="relative flex-shrink-0">
                <Avatar
                  name={formData.username || 'M'}
                  src={formData.avatar_url || null}
                  size="xl"
                  className="ring-4 ring-[var(--brand-gold)]/20"
                />
                {uploadingAvatar && (
                  <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                    <Loader2 size={20} className="text-white animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2.5">
                {/* Upload button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                  id="avatar-upload-input"
                />
                <label
                  htmlFor="avatar-upload-input"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brand-midnight)] text-[var(--brand-gold)] text-xs font-black cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <Camera size={13} />
                  {uploadingAvatar ? 'Upload en cours...' : 'Choisir une photo'}
                </label>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  JPG, PNG ou WebP · Max 5 Mo<br />
                  Si vous êtes connecté avec Google, votre avatar Google est chargé automatiquement.
                </p>

                {/* Manual URL input */}
                <div className="relative">
                  <Link2 size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--brand-gold)] dark:text-white transition-colors placeholder:text-gray-400"
                    placeholder="Ou coller un lien d'image..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Username */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-[var(--border)] p-6 shadow-sm">
            <h2 className="text-sm font-black text-[var(--brand-midnight)] dark:text-white mb-4 flex items-center gap-2">
              <User size={16} className="text-[var(--brand-gold)]" />
              Nom d'utilisateur
            </h2>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 text-sm bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--brand-gold)] dark:text-white transition-colors"
              required
              minLength={3}
              placeholder="Ex: mideessi_user"
            />
            <p className="mt-1.5 text-[10px] text-gray-400">Minimum 3 caractères. Visible sur vos commentaires.</p>
          </div>

          {/* Bio */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-[var(--border)] p-6 shadow-sm">
            <h2 className="text-sm font-black text-[var(--brand-midnight)] dark:text-white mb-4 flex items-center gap-2">
              <FileText size={16} className="text-[var(--brand-gold)]" />
              Biographie
            </h2>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 text-sm bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--brand-gold)] dark:text-white resize-none transition-colors"
              placeholder="Parlez-nous de vous, de votre activité ou de vos centres d'intérêt..."
            />
          </div>

          {/* Messages */}
          {error && (
            <div className="flex items-start gap-2 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-sm text-red-700 dark:text-red-400">
              <X size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-sm text-emerald-700 dark:text-emerald-400">
              <Check size={16} className="flex-shrink-0 mt-0.5" />
              {success}
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <p className="text-xs text-gray-400">
              Email : <span className="font-semibold text-[var(--brand-midnight)] dark:text-white">{user?.email}</span>
            </p>
            <div className="flex items-center gap-3">
              <Link
                to={`/profile/${formData.username}`}
                className="text-xs font-semibold text-[var(--brand-gold)] hover:text-yellow-500 transition-colors"
              >
                Voir le profil →
              </Link>
              <button
                type="submit"
                disabled={saving || uploadingAvatar}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--brand-midnight)] text-[var(--brand-gold)] text-sm font-black hover:opacity-90 disabled:opacity-60 transition-all shadow-lg"
              >
                {saving ? (
                  <><Loader2 size={14} className="animate-spin" /> Enregistrement...</>
                ) : (
                  <><Check size={14} /> Enregistrer</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
