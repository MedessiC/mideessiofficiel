import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle, LogIn, Github, Facebook, Globe, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useClientAuth } from '../contexts/ClientContext';
import SEO from '../components/SEO';
import { clearStoredRedirectTarget, getStoredRedirectTarget, getRedirectTargetFromLocation, persistRedirectTarget } from '../utils/authRedirect';

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
    } else {
      clearStoredRedirectTarget();
    }
  }, [location]);

  // Redirect if already logged in
  useEffect(() => {
    if (user && userRole && userType !== 'client') {
      const storedRedirect = getStoredRedirectTarget();
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
      const storedRedirect = getStoredRedirectTarget();
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

  const handleProviderSignIn = async (provider: 'google' | 'github' | 'facebook') => {
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
                  <label className="block text-xs font-bold mb-2 text-[var(--text-primary)] uppercase tracking-wider">
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
                  <label className="block text-xs font-bold mb-2 text-[var(--text-primary)] uppercase tracking-wider">
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
                  <a href="#" className="text-xs font-semibold text-[var(--brand-gold)] hover:underline">Mot de passe oublié ?</a>
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

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleProviderSignIn('google')}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] py-2.5 text-sm font-semibold text-[var(--text-primary)] hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                      <Globe className="w-4 h-4 text-red-500" /> Google
                    </button>
                    <button
                      type="button"
                      onClick={() => handleProviderSignIn('github')}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[#24292e] py-2.5 text-sm font-semibold text-white hover:bg-black transition-all disabled:opacity-50"
                    >
                      <Github className="w-4 h-4" /> GitHub
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
