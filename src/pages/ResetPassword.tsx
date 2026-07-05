import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, Home, Moon, Sun, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const darkMode = document.documentElement.classList.contains('dark');
    setIsDark(darkMode);
    
    // Vérifier si l'utilisateur a une session valide (venant du lien email)
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSessionInitialized(true);
        } else {
          setError('Lien de réinitialisation expiré ou invalide. Veuillez relancer la procédure.');
          setTimeout(() => navigate('/forgot-password'), 3000);
        }
      } catch (err) {
        setError('Une erreur est survenue lors de la vérification de la session.');
        setTimeout(() => navigate('/forgot-password'), 3000);
      }
    };

    checkSession();
  }, [navigate]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('autoMode', 'false');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message || 'Une erreur est survenue');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  if (!sessionInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#191970] via-[#191970] to-[#0f0f43] dark:from-[#191970] dark:via-[#191970] dark:to-[#0f0f43] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/95 dark:bg-[#191970]/40 dark:backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#ffd700]/20 text-center">
            <div className="flex justify-center mb-4">
              {error ? (
                <AlertCircle className="w-12 h-12 text-red-500" />
              ) : (
                <div className="w-12 h-12 border-4 border-[#ffd700]/30 border-t-[#ffd700] rounded-full animate-spin"></div>
              )}
            </div>
            <p className="text-[#191970] dark:text-white">
              {error || 'Vérification de votre session...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#191970] via-[#191970] to-[#0f0f43] dark:from-[#191970] dark:via-[#191970] dark:to-[#0f0f43] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/5 dark:bg-black/20 backdrop-blur-md border-b border-[#ffd700]/10 flex items-center justify-between px-4 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 text-[#ffd700] hover:text-[#ffed4e] font-semibold transition"
          title="Retour à l'accueil"
        >
          <Home size={20} />
          <span className="hidden sm:inline">Accueil</span>
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-[#ffd700]/10 hover:bg-[#ffd700]/20 transition-all"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-[#ffd700]" />
          ) : (
            <Moon className="w-5 h-5 text-[#ffd700]" />
          )}
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-40 h-40 border-4 border-[#ffd700]/10 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 border-4 border-[#ffd700]/10 rotate-45 opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="w-full max-w-md relative z-10 mt-16">
        <div className="bg-white/95 dark:bg-[#191970]/40 dark:backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#ffd700]/20">
          <div className="text-center mb-8">
            <img
              src={isDark ? "/mideessi.webp" : "/mideessi-light.webp"}
              alt="Logo MIDEESSI"
              className="h-14 mx-auto mb-4 transition-opacity duration-500"
            />
            <h1 className="text-2xl font-bold text-[#191970] dark:text-[#ffd700] mb-2">
              Créer un nouveau mot de passe
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Choisissez un mot de passe sécurisé
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-[#191970] dark:text-white">
                Mot de passe réinitialisé !
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Redirection vers la connexion dans 3 secondes...
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-400/20 border border-red-400 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-[#191970] dark:text-[#ffd700] mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-[#ffd700]" size={20} />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 border-2 border-[#ffd700]/30 dark:border-[#ffd700]/50 rounded-lg bg-white/90 dark:bg-[#0f0f43]/50 text-[#191970] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-[#ffd700] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-[#ffd700] hover:text-[#ffed4e] transition"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Minimum 8 caractères
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#191970] dark:text-[#ffd700] mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-[#ffd700]" size={20} />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 border-2 border-[#ffd700]/30 dark:border-[#ffd700]/50 rounded-lg bg-white/90 dark:bg-[#0f0f43]/50 text-[#191970] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-[#ffd700] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3.5 text-[#ffd700] hover:text-[#ffed4e] transition"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] hover:from-[#ffed4e] hover:to-[#ffff99] text-[#191970] font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-[#ffd700]/50"
                >
                  {loading ? 'Réinitialisation en cours...' : <>Réinitialiser <ArrowRight size={18} /></>}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-[#ffd700]/20 pt-6">
                <p className="text-[#191970] dark:text-gray-300 text-sm">
                  Vous vous souvenez de votre mot de passe ?{' '}
                  <Link to="/login" className="text-[#ffd700] dark:text-[#ffd700] hover:text-[#ffed4e] font-bold transition">
                    Se connecter
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
