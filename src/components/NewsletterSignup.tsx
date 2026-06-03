import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface NewsletterSignupProps {
  showTitle?: boolean;
  variant?: 'default' | 'compact' | 'hero';
  onSuccess?: () => void;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  showTitle = true,
  variant = 'default',
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Get Mailchimp config from environment
  const MAILCHIMP_FORM_URL = import.meta.env.VITE_MAILCHIMP_FORM_URL || '';

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      setStatus('error');
      setMessage('Veuillez entrer une adresse email valide');
      setTimeout(() => setStatus('idle'), 4000);
      return;
    }

    setStatus('loading');

    try {
      // Si on a Mailchimp form URL, utiliser la méthode JSONP
      if (MAILCHIMP_FORM_URL) {
        // Data à envoyer à Mailchimp
        const data = {
          EMAIL: email,
          FNAME: firstName,
          b_: '', // Required by Mailchimp for spam prevention
        };

        // Créer une form element et la soumettre
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = MAILCHIMP_FORM_URL;
        form.target = '_blank';

        Object.entries(data).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        setStatus('success');
        setMessage('✅ Merci! Vérifie ton email pour confirmer.');
        setEmail('');
        setFirstName('');

        if (onSuccess) onSuccess();

        // Reset après 5 secondes
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        // Fallback: Si pas de Mailchimp config, afficher message
        setStatus('error');
        setMessage('Configuration Mailchimp manquante. Veuillez contacter admin.');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      setStatus('error');
      setMessage('Une erreur est survenue. Essaie de nouveau.');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  // Variant: HERO (Full width, prominent)
  if (variant === 'hero') {
    return (
      <section className="relative py-16 md:py-20 bg-gradient-to-r from-midnight via-blue-900 to-midnight dark:from-black dark:via-gray-900 dark:to-black overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Rejoins le <span className="text-gold">Mouvement</span>
            </h2>
            <p className="text-lg text-gray-200 mb-2">
              Reçois les dernières solutions MIDEESSI en avant-première
            </p>
            <p className="text-sm text-gray-300">
              100% béninois. 0% spam. Désinscription en 1 clic.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                disabled={status === 'loading'}
                required
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="px-6 py-3 bg-gold text-midnight font-bold rounded-lg hover:bg-yellow-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {status === 'loading' ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Envoi...</span>
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirmé!</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>S'abonner</span>
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-4 text-center text-sm ${status === 'success' ? 'text-green-300' : 'text-red-300'}`}>
              {message}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Variant: COMPACT (Pour sidebar)
  if (variant === 'compact') {
    return (
      <div className="bg-gold/10 border border-gold/30 rounded-xl p-6 backdrop-blur-sm">
        {showTitle && (
          <h3 className="text-lg font-bold text-midnight dark:text-white mb-3">
            Rejoindre le mouvement
          </h3>
        )}
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ton email"
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gold/20 text-sm focus:outline-none focus:ring-2 focus:ring-gold transition-all"
            disabled={status === 'loading'}
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-3 py-2 bg-gold text-midnight font-semibold text-sm rounded-lg hover:bg-yellow-500 disabled:opacity-70 transition-all"
          >
            {status === 'loading' ? 'Envoi...' : 'S\'abonner'}
          </button>
          {status === 'success' && (
            <p className="text-xs text-green-600 dark:text-green-400">✅ Vérifie ton email!</p>
          )}
          {status === 'error' && (
            <p className="text-xs text-red-600 dark:text-red-400">{message}</p>
          )}
        </form>
      </div>
    );
  }

  // Variant: DEFAULT
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 md:p-10 border-2 border-gold/20">
      {showTitle && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-6 h-6 text-gold" />
            <h3 className="text-2xl font-bold text-midnight dark:text-white">
              Reste Connecté
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Reçois les dernières solutions MIDEESSI, directement dans ta boîte mail
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
            Prénom (optionnel)
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Oscar"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
            disabled={status === 'loading'}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton@email.com"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
            disabled={status === 'loading'}
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-4 py-3 bg-gradient-to-r from-gold to-yellow-600 text-midnight font-bold rounded-lg hover:shadow-lg hover:shadow-gold/30 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Abonnement en cours...</span>
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Merci!</span>
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              <span>S'abonner à la Newsletter</span>
            </>
          )}
        </button>

        {(status === 'success' || status === 'error') && (
          <div
            className={`flex items-start gap-3 p-3 rounded-lg ${
              status === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${status === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
              {message}
            </p>
          </div>
        )}
      </form>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        Pas de spam. Désinscription en un clic. 100% confidentiel.
      </p>
    </div>
  );
};

export default NewsletterSignup;
