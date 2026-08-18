import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useClientAuth } from '../contexts/ClientContext';
import SEO from '../components/SEO';
import { clearStoredRedirectTarget, getRedirectTargetFromLocation, persistRedirectTarget, peekStoredRedirectTarget } from '../utils/authRedirect';

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

  useEffect(() => {
    if (user && userRole) {
      const directRedirect = getRedirectTargetFromLocation(location);
      const storedRedirect = peekStoredRedirectTarget();
      const finalRedirect = directRedirect || storedRedirect;

      if (finalRedirect && finalRedirect !== '/login' && finalRedirect !== '/signup') {
        clearStoredRedirectTarget();
        navigate(finalRedirect, { replace: true });
        return;
      }

      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRole === 'user') {
        navigate('/profile/' + buildProfileRoute(user), { replace: true });
      }
    }

    if (clientUser) {
      const storedRedirect = peekStoredRedirectTarget();
      if (storedRedirect && storedRedirect !== '/login' && storedRedirect !== '/signup') {
        navigate(storedRedirect, { replace: true });
        clearStoredRedirectTarget();
      } else {
        navigate('/clients/dashboard', { replace: true });
      }
    }
  }, [user, userRole, clientUser, navigate, location]);

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

      // Essayer d'abord client auth
      try {
        await signInClient(email, password);
      } catch (clientErr: any) {
        // Si erreur client, essayer auth utilisateur
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

  const [safeReady, setSafeReady] = useState(!isLoading);
  useEffect(() => {
    if (!isLoading) {
      setSafeReady(true);
      return;
    }
    const t = setTimeout(() => setSafeReady(true), 2000);
    return () => clearTimeout(t);
  }, [isLoading]);

  if (!safeReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#191970]"></div>
          <p className="text-[#5E6472] font-semibold">Chargement...</p>
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

      <div
        className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6"
        style={{ backgroundColor: '#FAFAFA' }}
      >
        <div className="w-full max-w-md">
          {/* Titre */}
          <h1
            className="text-3xl sm:text-4xl font-bold text-center mb-2"
            style={{
              color: '#111827',
              letterSpacing: '-0.02em',
            }}
          >
            Connexion
          </h1>

          {/* Sous-titre */}
          <p
            className="text-center text-sm sm:text-base mb-8"
            style={{ color: '#5E6472' }}
          >
            Accédez à votre espace.
          </p>

          {/* Card */}
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
            }}
          >
            {/* Erreur */}
            {error && (
              <div
                className="mb-6 flex items-start gap-3 rounded-xl p-4 text-sm"
                style={{
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                }}
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  className="block text-xs font-semibold mb-2"
                  style={{ color: '#111827' }}
                >
                  Adresse email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#5E6472' }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    placeholder="vous@exemple.com"
                    className="w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm placeholder:text-[#9CA3AF] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-0"
                    style={{
                      borderColor: '#D1D5DB',
                      color: '#111827',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#191970';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(25, 25, 112, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#D1D5DB';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className="block text-xs font-semibold"
                    style={{ color: '#111827' }}
                  >
                    Mot de passe
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold transition-colors"
                    style={{ color: '#191970' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#FFD700';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#191970';
                    }}
                  >
                    Oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#5E6472' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="••••••••"
                    className="w-full rounded-lg border pl-10 pr-10 py-2.5 text-sm placeholder:text-[#9CA3AF] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-0"
                    style={{
                      borderColor: '#D1D5DB',
                      color: '#111827',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#191970';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(25, 25, 112, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#D1D5DB';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 disabled:opacity-50 transition-colors"
                    style={{ color: '#5E6472' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#191970';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#5E6472';
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Bouton Se connecter */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-70 mt-6"
                style={{ backgroundColor: '#191970' }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(25, 25, 112, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            {/* Séparateur */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1" style={{ height: '1px', backgroundColor: '#E5E7EB' }}></div>
              <span className="text-xs font-semibold" style={{ color: '#5E6472' }}>
                ou
              </span>
              <div className="flex-1" style={{ height: '1px', backgroundColor: '#E5E7EB' }}></div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={() => handleProviderSignIn('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-all disabled:opacity-50"
              style={{
                borderColor: '#E5E7EB',
                color: '#111827',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#191970';
                e.currentTarget.style.backgroundColor = '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="#4285F4" d="M533.5 278.4c0-18.8-1.7-37-5-54.7H272.1v103.5h146.9c-6.3 34.1-25.2 62.5-53.7 81.7v67.8h86.9c50.8-46.8 80.3-115.9 80.3-198.3z" />
                <path fill="#34A853" d="M272.1 544.3c72.7 0 133.7-24.1 178.2-65.7l-86.9-67.8c-24.2 16.2-55.3 25.8-91.3 25.8-70.1 0-129.4-47.2-150.6-110.4h-89.4v69.4C75.9 474.7 168.5 544.3 272.1 544.3z" />
                <path fill="#FBBC05" d="M121.5 327.2c-4.9-14.7-7.7-30.4-7.7-46.5s2.8-31.8 7.7-46.5v-69.4H32.1c-19.2 38.4-30.2 81.3-30.2 125.9s11 87.5 30.2 125.9l89.4-69.4z" />
                <path fill="#EA4335" d="M272.1 107.7c39.6 0 75.1 13.6 103.2 40.3l77.4-77.4C402.2 24.6 339.5 0 272.1 0 168.5 0 75.9 69.6 32.1 178.5l89.4 69.4c21.2-63.2 80.5-110.4 150.6-110.4z" />
              </svg>
              Continuer avec Google
            </button>

            {/* Créer compte */}
            <p className="mt-6 text-center text-sm" style={{ color: '#5E6472' }}>
              Pas encore de compte ?{' '}
              <Link
                to="/signup"
                className="font-semibold transition-colors"
                style={{ color: '#191970' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFD700';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#191970';
                }}
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnifiedLogin;
