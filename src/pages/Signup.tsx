import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight, Github, Facebook, Globe } from 'lucide-react';
import SEO from '../components/SEO';
import { normalizeEmail, sanitizeUsername, validatePassword } from '../utils/authProfile';
import { getRedirectTargetFromLocation, persistRedirectTarget } from '../utils/authRedirect';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, signInWithProvider } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    const normalizedEmail = normalizeEmail(email);
    const safeUsername = sanitizeUsername(username);
    const passwordValidation = validatePassword(password);

    if (!normalizedEmail || !password || !safeUsername || !confirmPassword) {
      setError('Tous les champs sont requis');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!passwordValidation.valid) {
      setError(passwordValidation.message || 'Mot de passe invalide');
      return;
    }

    if (safeUsername.length < 3) {
      setError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
      return;
    }

    if (!normalizedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setLoading(true);
    try {
      const { error: signupError } = await signUp(normalizedEmail, password, safeUsername);

      if (signupError) {
        setError(signupError);
        setLoading(false);
        return;
      }

      const redirectTarget = getRedirectTargetFromLocation(location);
      if (redirectTarget) {
        persistRedirectTarget(redirectTarget);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleProviderSignup = async (provider: 'google' | 'github' | 'facebook') => {
    setError('');
    setLoading(true);

    try {
      const { error } = await signInWithProvider(provider);
      if (error) {
        setError(error);
        setLoading(false);
      }
      // OAuth flow is redirected by Supabase
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion sociale');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <SEO
          title="Inscription confirmée | MIDEESSI"
          description="Votre compte a été créé avec succès"
          keywords={['inscription', 'succès', 'MIDEESSI']}
        />
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
          <div className="w-full max-w-md">
            <div className="rounded-2xl shadow-2xl p-8 border bg-white/95 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/50 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-poppins">
                Inscription réussie!
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mb-6 font-poppins">
                Vérifiez votre email pour confirmer votre compte. Un lien de confirmation vous a été envoyé.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-poppins">
                Redirection vers la connexion dans 3 secondes...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Inscription | MIDEESSI"
        description="Créez votre compte MIDEESSI gratuitement"
        keywords={['inscription', 'créer compte', 'signup', 'MIDEESSI']}
      />

      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gradient-to-br from-gold to-yellow-500">
              <User className="w-8 h-8 text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white font-poppins">
              S'inscrire
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-poppins">
              Créez votre compte MIDEESSI
            </p>
          </div>

          {/* Signup Card */}
          <div className="rounded-2xl shadow-2xl p-8 border bg-white/95 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">

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
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-200 font-poppins">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    placeholder="john_doe"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-gold/50 focus:border-gold disabled:opacity-50 font-poppins"
                    required
                  />
                </div>
              </div>

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
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-poppins">
                  Minimum 8 caractères
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-200 font-poppins">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-gold/50 focus:border-gold disabled:opacity-50 font-poppins"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 mt-1 rounded border-slate-300 text-gold focus:ring-gold"
                />
                <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 font-poppins">
                  J'accepte les conditions d'utilisation et la politique de confidentialité
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-slate-900 disabled:opacity-50 font-poppins"
              >
                {loading ? 'Création en cours...' : (
                  <>
                    Créer mon compte
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 mb-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-300 dark:bg-slate-600"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-poppins">ou</span>
              <div className="flex-1 h-px bg-slate-300 dark:bg-slate-600"></div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => handleProviderSignup('google')}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                <Globe className="h-5 w-5 text-red-600" />
                Continuer avec Google
              </button>
              <button
                type="button"
                onClick={() => handleProviderSignup('github')}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition disabled:opacity-50"
              >
                <Github className="h-5 w-5" />
                Continuer avec GitHub
              </button>
              <button
                type="button"
                onClick={() => handleProviderSignup('facebook')}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                <Facebook className="h-5 w-5" />
                Continuer avec Facebook
              </button>
            </div>

            {/* Footer Links */}
            <div className="text-center text-sm text-slate-600 dark:text-slate-300">
              <p className="font-poppins">
                Vous avez déjà un compte?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-bold text-gold hover:text-yellow-400 transition"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </div>

          {/* Info Badge */}
          <div className="mt-6 text-center">
            <div className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 font-poppins">
              Un email de confirmation vous sera envoyé
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
