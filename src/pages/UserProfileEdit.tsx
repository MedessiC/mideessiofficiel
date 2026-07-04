import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import { validateProfileData } from '../utils/authProfile';

interface ProfileForm {
  username: string;
  avatar_url: string;
  bio: string;
}

export default function UserProfileEdit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProfileForm>({
    username: '',
    avatar_url: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      const { data, error } = await supabase
        .from('users')
        .select('username, avatar_url, bio')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setFormData({
          username: data.username || '',
          avatar_url: data.avatar_url || '',
          bio: data.bio || '',
        });
      } else {
        setFormData({
          username: (user.user_metadata?.username as string | undefined)?.trim() || user.email?.split('@')[0] || '',
          avatar_url: '',
          bio: '',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Impossible de charger le profil');
    } finally {
      setLoading(false);
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

      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email || '',
          username: formData.username.trim(),
          avatar_url: formData.avatar_url?.trim() || null,
          bio: formData.bio?.trim() || null,
        }, { onConflict: 'id' });

      if (error) throw error;
      setSuccess('Profil mis à jour avec succès.');
    } catch (err: any) {
      setError(err.message || 'Impossible de mettre à jour le profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold to-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-poppins">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.08),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] pt-20 pb-12 dark:bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.1),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]">
      <SEO title="Modifier mon profil | MIDEESSI" description="Personnalisez votre profil utilisateur MIDEESSI." />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Profil</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Personnaliser votre profil</h1>
          </div>
          <button onClick={() => navigate(-1)} className="text-sm font-semibold text-slate-600 transition hover:text-gold dark:text-slate-300">
            ← Retour
          </button>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
          <p className="mb-6 text-sm leading-6 text-slate-600 dark:text-slate-400">Rendez votre profil plus vivant avec une photo, une bio et des informations qui reflètent votre identité.</p>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700/30 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-700/30 dark:bg-green-900/20 dark:text-green-200">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Nom d’utilisateur</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                required
                minLength={3}
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">URL d’avatar</label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                placeholder="https://..."
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={5}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                placeholder="Parlez-nous de vous, de votre activité ou de votre style..."
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Email associé : <span className="font-semibold text-slate-800 dark:text-white">{user?.email}</span>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-gold to-yellow-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:opacity-90 disabled:opacity-70"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer le profil'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            <Link to={`/profile/${formData.username}`} className="font-semibold text-gold hover:text-yellow-400">Voir le profil final</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
