import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Home, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message || 'Une erreur est survenue');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setEmail('');

      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
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

        <div className="bg-white rounded-[28px] border border-[var(--border)] shadow-[0_18px_45px_rgba(17,17,17,0.06)] p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-midnight)] shadow-[0_12px_25px_rgba(25,25,112,0.18)] mb-4">
              <Mail className="w-7 h-7 text-[var(--brand-gold)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--brand-midnight)] mb-2">
              Réinitialiser votre mot de passe
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Entrez votre adresse email pour recevoir un lien de réinitialisation
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-[var(--brand-midnight)]">
                Email envoyé avec succès !
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Veuillez vérifier votre boîte email et suivre les instructions pour réinitialiser votre mot de passe.
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Redirection vers la connexion dans 5 secondes...
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-2xl bg-[var(--brand-midnight)] text-white font-semibold shadow-[0_12px_25px_rgba(25,25,112,0.18)] hover:-translate-y-0.5 transition-transform disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {loading ? 'Envoi en cours...' : <>Envoyer le lien <ArrowRight size={18} /></>}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-[var(--border)] pt-6">
                <p className="text-sm text-[var(--text-secondary)]">
                  Vous vous souvenez de votre mot de passe ?{' '}
                  <Link to="/login" className="font-bold text-[var(--brand-midnight)] hover:text-[var(--brand-gold)] transition-colors">
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
