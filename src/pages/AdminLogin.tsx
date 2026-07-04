import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Debugging: log auth response for troubleshooting in browser console
      // (temporary) — helpful when production shows 'connexion' without error.
      // Remove these logs once the issue is resolved.
      // eslint-disable-next-line no-console
      console.log('Admin login response:', { authData, authError });

      if (authError) throw authError;

      if (authData.user) {
        const { data: adminData } = await supabase
          .from('admins')
          .select('id')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (!adminData) {
          await supabase.auth.signOut();
          throw new Error('Accès non autorisé. Vous devez être administrateur.');
        }

        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Admin login error:', err);
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-12">
          <div className="hidden lg:block">
            <img src="/admin-illustration.png" alt="Admin" className="w-full rounded-2xl shadow-md" />
          </div>

          <div className="w-full">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-midnight dark:text-white mb-2">Administration</h1>
                <p className="text-corporate-600 dark:text-corporate-300">Connectez-vous pour gérer le blog</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-corporate-700 dark:text-corporate-200 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-corporate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-corporate-50 dark:bg-gray-700 border border-corporate-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white"
                      placeholder="admin@mideessi.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-corporate-700 dark:text-corporate-200 mb-2">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-corporate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-corporate-50 dark:bg-gray-700 border border-corporate-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg transition-colors"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-corporate-600 dark:text-corporate-300">Accès réservé aux administrateurs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-40 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-lg lg:hidden">
        <div className="max-w-6xl mx-auto flex justify-between items-center h-20 px-4">
          <button className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-slate-600">
            <Lock className="w-5 h-5" />
            <span>Admin</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-slate-600">
            <Mail className="w-5 h-5" />
            <span>Contact</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
