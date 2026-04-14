import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useClientAuth } from '../contexts/ClientContext';
import SEO from '../components/SEO';

const ClientLogin = () => {
  const navigate = useNavigate();
  const { signIn, loading } = useClientAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      navigate('/clients/onboarding');
    } catch (err: any) {
      setError(error || 'Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-midnight via-blue-900 to-indigo-900 dark:from-black dark:via-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-midnight via-blue-900 to-indigo-900 dark:from-black dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      <SEO
        title="Connexion Client | MIDEESSI"
        description="Accédez à votre espace client MIDEESSI"
        keywords={['client', 'connexion', 'login', 'espace client', 'MIDEESSI']}
      />

      {/* Background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gold rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10"></div>

      <div className="relative z-10 w-full max-w-md px-4 sm:px-6 lg:px-8 flex flex-col justify-center min-h-screen">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-block mb-8">
            <img
              src="/mideessi.webp"
              alt="Logo MIDEESSI"
              className="h-14 object-contain"
              loading="eager"
              decoding="async"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Espace <span className="text-gold">Client</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Connectez-vous pour accéder à votre tableau de bord
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-gray-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-gray-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-gold to-yellow-400 hover:from-gold/90 hover:to-yellow-400/90 text-midnight font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-xs md:text-sm text-center">
              Vous avez reçu vos identifiants par email à la création de votre compte.
            </p>
            <p className="text-gray-400 text-xs md:text-sm text-center mt-2">
              Pour toute assistance, contactez{' '}
              <a
                href="mailto:contact@mideessi.com"
                className="text-gold hover:text-gold/80 font-semibold"
              >
                contact@mideessi.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-400 text-xs md:text-sm">
          <p>
            Vous êtes administrateur?{' '}
            <a href="/admin" className="text-gold hover:text-gold/80 font-semibold">
              Accédez au panel admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
