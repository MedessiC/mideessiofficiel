import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home, Moon, Sun } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn } = useAuth();

  useEffect(() => {
    // Vérifier le thème actuel au chargement
    const darkMode = document.documentElement.classList.contains('dark');
    setIsDark(darkMode);

    // Afficher le message de succès si venant de signup
    if (searchParams.get('signup') === 'success') {
      setSuccessMessage('Compte créé avec succès ! Connectez-vous maintenant.');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [searchParams]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Tous les champs sont requis');
      return;
    }

    setLoading(true);
    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError);
      setLoading(false);
      return;
    }

    navigate('/my-library');
  };

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
            <p className="text-gray-600 dark:text-gray-300">
              Heureux de vous revoir !
            </p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-400/20 border border-green-400 rounded-lg">
              <p className="text-green-700 dark:text-green-300 text-sm">{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-400/20 border border-red-400 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#191970] dark:text-[#ffd700] mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-[#ffd700]" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#ffd700]/30 dark:border-[#ffd700]/50 rounded-lg bg-white/90 dark:bg-[#0f0f43]/50 text-[#191970] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-[#ffd700] transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#191970] dark:text-[#ffd700] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-[#ffd700]" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] hover:from-[#ffed4e] hover:to-[#ffff99] text-[#191970] font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-[#ffd700]/50"
            >
              {loading ? 'Connexion en cours...' : <>Se connecter <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#ffd700]/20 pt-6">
            <p className="text-[#191970] dark:text-gray-300 text-sm">
              Pas encore de compte ?{' '}
              <Link to="/signup" className="text-[#ffd700] dark:text-[#ffd700] hover:text-[#ffed4e] font-bold transition">
                S'inscrire gratuitement
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
