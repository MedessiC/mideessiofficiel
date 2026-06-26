import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useClientAuth } from '../contexts/ClientContext';
import SEO from '../components/SEO';

type UserType = 'user' | 'client';

const UnifiedLogin = () => {
  const navigate = useNavigate();
  const { signIn, loading: authLoading, user, userRole } = useAuth();
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

  // Redirect if already logged in
  useEffect(() => {
    if (user && userRole && userType !== 'client') {
      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRole === 'user') {
        navigate('/profile/' + buildProfileRoute(user), { replace: true });
      }
    }
    
    if (clientUser && userType === 'client') {
      navigate('/clients/dashboard', { replace: true });
    }
  }, [user, userRole, clientUser, userType, navigate]);

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

        // Role detection happens in AuthContext after signIn
        // User will be redirected by the useEffect above
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          <p className="text-slate-600 dark:text-slate-300 font-semibold">Chargement...</p>
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

      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gradient-to-br from-gold to-yellow-500">
              <Lock className="w-8 h-8 text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white font-poppins">
              Connexion
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-poppins">
              Accédez à votre compte
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl shadow-2xl p-8 border bg-white/95 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">

            {/* User Type Toggle */}
            <div className="mb-8 grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg p-1">
              {(['user', 'client'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setUserType(type);
                    setError('');
                  }}
                  className={`py-2 px-3 rounded-md text-xs font-bold transition-all font-poppins ${
                    userType === type
                      ? 'bg-gold text-slate-900 shadow-lg'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {type === 'user' ? 'Utilisateur' : 'Client'}
                </button>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg border flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-600/30">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400 font-poppins">
                  {error}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-200 font-poppins">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    placeholder="votre@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-gold/50 focus:border-gold disabled:opacity-50 font-poppins"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-200 font-poppins">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-gold/50 focus:border-gold disabled:opacity-50 font-poppins"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-slate-900 disabled:opacity-50 font-poppins"
              >
                <LogIn size={20} />
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 mb-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-300 dark:bg-slate-600"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-poppins">ou</span>
              <div className="flex-1 h-px bg-slate-300 dark:bg-slate-600"></div>
            </div>

            {/* Footer Links */}
            <div className="text-center text-sm space-y-2 text-slate-600 dark:text-slate-300">
              <p className="font-poppins">
                Pas encore de compte?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="font-bold text-gold hover:text-yellow-400 transition"
                >
                  S'inscrire
                </button>
              </p>
              <p className="font-poppins">
                <button
                  onClick={() => navigate('/')}
                  className="font-bold text-gold hover:text-yellow-400 transition"
                >
                  Retour à l'accueil
                </button>
              </p>
            </div>
          </div>

          {/* Type Indicator Badge */}
          <div className="mt-6 text-center">
            <div className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 font-poppins">
              {userType === 'user' ? 'Mode Utilisateur' : 'Mode Client'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnifiedLogin;
