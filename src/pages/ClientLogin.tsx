import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      setError(err?.message || 'Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.18),_transparent_40%),_radial-gradient(circle_at_bottom_right,_rgba(25,25,112,0.08),_rgba(255,255,255,0.95))]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.18),_transparent_40%),_radial-gradient(circle_at_bottom_right,_rgba(25,25,112,0.08),_rgba(255,255,255,0.95))] overflow-hidden">
      <SEO
        title="Connexion Client | MIDEESSI"
        description="Accédez à votre espace client MIDEESSI"
        keywords={['client', 'connexion', 'login', 'espace client', 'MIDEESSI']}
      />

      <div className="relative z-10 w-full max-w-md px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="inline-flex items-end gap-2 mb-4">
            <span className="text-3xl font-semibold tracking-[0.3em] text-[var(--brand-gold)]">M</span>
            <span className="text-3xl font-semibold tracking-[0.06em]">MIDEESSI</span>
          </div>
          <span className="block text-xs uppercase tracking-[0.35em] text-[var(--brand-gold-muted)] mb-3">Votre espace privé</span>
          <p className="text-sm text-white/80 max-w-sm mx-auto">Portail personnel pour suivre vos livrables, factures et échanges clients.</p>
        </div>

        <div className="bg-[var(--bg-card)] rounded-[24px] p-7 shadow-[0_40px_80px_rgba(25,25,112,0.12)] border border-white/10 text-[var(--text-primary)]">
          {error && (
            <div className="mb-6 rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                id="client-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                disabled={isSubmitting}
                className="peer w-full h-14 rounded-[20px] border border-[var(--border)] bg-[var(--bg-surface)] px-4 pt-6 pb-3 text-sm text-[var(--text-primary)] placeholder-transparent focus:border-[var(--brand-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/15 transition"
                required
              />
              <label
                htmlFor="client-email"
                className="pointer-events-none absolute left-4 top-4 text-sm text-[var(--text-secondary)] transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[var(--brand-gold)]"
              >
                Email
              </label>
            </div>

            <div className="relative">
              <input
                id="client-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                disabled={isSubmitting}
                className="peer w-full h-14 rounded-[20px] border border-[var(--border)] bg-[var(--bg-surface)] px-4 pt-6 pb-3 text-sm text-[var(--text-primary)] placeholder-transparent focus:border-[var(--brand-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/15 transition pr-12"
                required
              />
              <label
                htmlFor="client-password"
                className="pointer-events-none absolute left-4 top-4 text-sm text-[var(--text-secondary)] transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[var(--brand-gold)]"
              >
                Mot de passe
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--brand-midnight)] transition"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full h-[52px] rounded-[14px] bg-[var(--brand-midnight)] text-white font-semibold text-sm transition duration-200 hover:bg-[#23238d] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm text-[var(--text-secondary)]">
            <span>Accès sur invitation</span>
            <Link to="/forgot-password" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--brand-gold)]/10 hover:bg-[var(--brand-gold)]/20 font-semibold text-[var(--brand-gold)] hover:text-[#ffed4e] transition-all hover:scale-105 active:scale-95">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-white/70">
          <p>
            Vous êtes administrateur?{' '}
            <a href="/admin" className="text-[var(--brand-gold)] hover:text-[#ffe34d] font-semibold">
              Accédez au panel admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
