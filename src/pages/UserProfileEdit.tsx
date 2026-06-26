import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

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
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email || '',
          username: formData.username,
          avatar_url: formData.avatar_url || null,
          bio: formData.bio || null,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 pt-20 pb-12">
      <SEO
        title="Modifier mon profil | MIDEESSI"
        description="Mettez à jour votre profil utilisateur MIDEESSI."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gold hover:text-yellow-400 font-semibold transition font-poppins"
          >
            ← Retour
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-poppins">Modifier mon profil</h1>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
          <p className="text-slate-600 dark:text-slate-400 mb-6 font-poppins">Personnalisez votre username, avatar et bio.</p>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700 p-4 text-sm text-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700 p-4 text-sm text-green-700 dark:text-green-200">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 font-poppins">Nom d'utilisateur</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 font-poppins">Avatar URL</label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 font-poppins">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Parlez-nous de vous..."
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 font-poppins">
                Email lié : <span className="font-semibold text-slate-800 dark:text-white">{user.email}</span>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-gold to-yellow-400 px-5 py-3 text-sm font-bold text-slate-900 hover:from-yellow-400 hover:to-yellow-500 transition disabled:opacity-75"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-sm text-slate-500 dark:text-slate-400 font-poppins">
          <Link to={`/profile/${formData.username}`} className="text-gold hover:text-yellow-400 font-semibold">Voir mon profil</Link>
        </div>
      </div>
    </div>
  );
}
