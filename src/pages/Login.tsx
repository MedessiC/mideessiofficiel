import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { clearStoredRedirectTarget, getStoredRedirectTarget, getRedirectTargetFromLocation, persistRedirectTarget } from '../utils/authRedirect';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { signIn } = useAuth();

  useEffect(() => {
    if (searchParams.get('signup') === 'success') {
      setSuccessMessage('Compte créé avec succès ! Connectez-vous maintenant.');
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }

    const redirectTarget = getRedirectTargetFromLocation(location);
    if (redirectTarget) {
      persistRedirectTarget(redirectTarget);
    }
  }, [searchParams, location]);

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

    const redirectTarget = getStoredRedirectTarget('/my-library');
    navigate(redirectTarget, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,215,0,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(25,25,112,0.08),transparent_30%)]" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-midnight)] hover:text-[var(--brand-gold)] transition-colors"
            title="Retour à l'accueil"
          >
            <Home size={18} />
            Accueil
          </Link>
        </div>

        <div className="bg-white rounded-[28px] border border-[var(--border)] shadow-[0_18px_45px_rgba(17,17,17,0.06)] overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center border-b border-[var(--border)] bg-[var(--bg-surface)]">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-midnight)] text-white shadow-[0_12px_25px_rgba(25,25,112,0.18)] mb-4">
              <Lock className="w-7 h-7 text-[var(--brand-gold)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--brand-midnight)] mb-1">Bon retour !</h1>
            <p className="text-sm text-[var(--text-secondary)]">Connectez-vous pour continuer</p>
          </div>

          <div className="p-8">
            {successMessage && (
              <div className="mb-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                <p className="text-sm text-emerald-700">{successMessage}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 flex items-start gap-3">
                <span className="mt-0.5 text-red-600">•</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)] mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-hint)] focus:outline-none focus:border-[var(--brand-gold)] focus:ring-4 focus:ring-[var(--brand-gold)]/10 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)]">
                    Mot de passe
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[var(--brand-midnight)] hover:text-[var(--brand-gold)] transition-colors"
                  >
                    Oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-hint)] focus:outline-none focus:border-[var(--brand-gold)] focus:ring-4 focus:ring-[var(--brand-gold)]/10 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--brand-midnight)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-2xl bg-[var(--brand-midnight)] text-white font-semibold shadow-[0_12px_25px_rgba(25,25,112,0.18)] hover:-translate-y-0.5 transition-transform disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loading ? 'Connexion en cours...' : <>Se connecter <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-[var(--border)] pt-6">
              <p className="text-sm text-[var(--text-secondary)]">
                Pas encore de compte ?{' '}
                <Link to="/signup" className="font-bold text-[var(--brand-midnight)] hover:text-[var(--brand-gold)] transition-colors">
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
