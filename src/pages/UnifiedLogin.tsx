import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle, LogIn, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useClientAuth } from '../contexts/ClientContext';
import SEO from '../components/SEO';
import { clearStoredRedirectTarget, getStoredRedirectTarget, getRedirectTargetFromLocation, persistRedirectTarget, peekStoredRedirectTarget } from '../utils/authRedirect';

type UserType = 'user' | 'client';

const UnifiedLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithProvider, loading: authLoading, user, userRole } = useAuth();
  const { signIn: signInClient, loading: clientLoading, user: clientUser, error: clientError } = useClientAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>('user');

  const isLoading = authLoading || clientLoading;

  const buildProfileRoute = (authUser: typeof user | null) => {
    const metadataUsername = authUser?.user_metadata?.username?.toString().trim();
    const emailPrefix = authUser?.email?.split('@')[0]?.toLowerCase();
    const baseUsername = (metadataUsername || emailPrefix || `user${authUser?.id?.slice(0, 8)}` || 'profil')
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .toLowerCase()
      .slice(0, 24) || 'profil';

    return baseUsername;
  };

  useEffect(() => {
    const redirectFromLocation = getRedirectTargetFromLocation(location);
    if (redirectFromLocation) {
      persistRedirectTarget(redirectFromLocation);
    }
  }, [location]);

  // Redirect if already logged in
  useEffect(() => {
    if (user && userRole && userType !== 'client') {
      const storedRedirect = peekStoredRedirectTarget();
      if (storedRedirect && storedRedirect !== '/login' && storedRedirect !== '/signup') {
        navigate(storedRedirect, { replace: true });
        clearStoredRedirectTarget();
        return;
      }

      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRole === 'user') {
        navigate('/profile/' + buildProfileRoute(user), { replace: true });
      }
    }
    
    if (clientUser && userType === 'client') {
      const storedRedirect = peekStoredRedirectTarget();
      if (storedRedirect && storedRedirect !== '/login' && storedRedirect !== '/signup') {
        navigate(storedRedirect, { replace: true });
        clearStoredRedirectTarget();
      } else {
        navigate('/clients/dashboard', { replace: true });
      }
    }
  }, [user, userRole, clientUser, userType, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Email et mot de passe requis');
        setLoading(false);
        return;
      }

      if (userType === 'client') {
        // Use ClientContext for client login
        try {
          await signInClient(email, password);
          // Redirect happens in useEffect above
        } catch (err: any) {
          setError(clientError || err.message || 'Erreur de connexion');
        }
      } else {
        // Use AuthContext for user/admin login
        const { error } = await signIn(email, password);

        if (error) {
          setError(error);
          setLoading(false);
          return;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSignIn = async (provider: 'google') => {
    setError('');
    setLoading(true);

    try {
      const { error } = await signInWithProvider(provider);
      if (error) {
        setError(error);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion sociale');
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--brand-gold)]"></div>
          <p className="text-[var(--text-secondary)] font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Connexion | MIDEESSI"
        description="Connectez-vous à votre compte MIDEESSI"
        keywords={['connexion', 'login', 'authentification', 'MIDEESSI']}
      />

      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[var(--bg-page)] relative overflow-hidden">
        {/* Background Decorative elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[var(--brand-gold)]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[420px] relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--brand-gold)] transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>

          {/* Login Card */}
          <div className="bg-white rounded-[32px] shadow-soft border border-[var(--border)] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--brand-midnight)] to-blue-900 p-8 text-center text-white">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <Lock className="w-7 h-7 text-[var(--brand-gold)]" />
              </div>
              <h1 className="text-2xl font-bold mb-1">Bon retour !</h1>
              <p className="text-sm text-gray-300">Connectez-vous pour continuer</p>
            </div>

            <div className="p-8">
              {/* User Type Toggle */}
              <div className="mb-8 flex p-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl">
                {(['user', 'client'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setUserType(type);
                      setError('');
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      userType === type
                        ? 'bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400 text-[var(--brand-midnight)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {type === 'user' ? 'Utilisateur' : 'Espace Client'}
                  </button>
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold mb-2 text-[var(--text-primary)] dark:text-[#191970] uppercase tracking-wider">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      placeholder="votre@email.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--brand-gold)] focus:ring-4 focus:ring-[var(--brand-gold)]/10 transition-all disabled:opacity-50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2 text-[var(--text-primary)] dark:text-[#191970] uppercase tracking-wider">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3.5 rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--brand-gold)] focus:ring-4 focus:ring-[var(--brand-gold)]/10 transition-all disabled:opacity-50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[var(--brand-gold)] focus:ring-[var(--brand-gold)]" />
                    <span className="text-xs text-[var(--text-secondary)]">Se souvenir de moi</span>
                  </label>
                  <Link to="/forgot-password" className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[var(--brand-gold)]/10 hover:bg-[var(--brand-gold)]/20 font-semibold text-[var(--brand-gold)] hover:text-[#ffed4e] transition-all hover:scale-105 active:scale-95">
                    Mot de passe oublié ?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--brand-midnight)] to-blue-800 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-70 disabled:pointer-events-none"
                >
                  {loading ? (
                    <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Connexion...</>
                  ) : (
                    <><LogIn size={18} /> Se connecter</>
                  )}
                </button>
              </form>

              {userType === 'user' && (
                <>
                  <div className="mt-8 mb-6 flex items-center gap-4">
                    <div className="flex-1 h-px bg-[var(--border)]"></div>
                    <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Ou avec</span>
                    <div className="flex-1 h-px bg-[var(--border)]"></div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => handleProviderSignIn('google')}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] py-2.5 text-sm font-semibold text-[var(--text-primary)] hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 533.5 544.3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#4285F4" d="M533.5 278.4c0-18.8-1.7-37-5-54.7H272.1v103.5h146.9c-6.3 34.1-25.2 62.5-53.7 81.7v67.8h86.9c50.8-46.8 80.3-115.9 80.3-198.3z" />
                        <path fill="#34A853" d="M272.1 544.3c72.7 0 133.7-24.1 178.2-65.7l-86.9-67.8c-24.2 16.2-55.3 25.8-91.3 25.8-70.1 0-129.4-47.2-150.6-110.4h-89.4v69.4C75.9 474.7 168.5 544.3 272.1 544.3z" />
                        <path fill="#FBBC05" d="M121.5 327.2c-4.9-14.7-7.7-30.4-7.7-46.5s2.8-31.8 7.7-46.5v-69.4H32.1c-19.2 38.4-30.2 81.3-30.2 125.9s11 87.5 30.2 125.9l89.4-69.4z" />
                        <path fill="#EA4335" d="M272.1 107.7c39.6 0 75.1 13.6 103.2 40.3l77.4-77.4C402.2 24.6 339.5 0 272.1 0 168.5 0 75.9 69.6 32.1 178.5l89.4 69.4c21.2-63.2 80.5-110.4 150.6-110.4z" />
                      </svg>
                      Google
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
            Nouveau sur MIDEESSI ?{' '}
            <Link to="/signup" className="font-bold text-[var(--brand-midnight)] hover:text-[var(--brand-gold)] transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default UnifiedLogin;
