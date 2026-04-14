import { Copy, X, CheckCircle } from 'lucide-react';

interface ClientCredentialsModalProps {
  isOpen: boolean;
  clientId: string;
  clientEmail: string;
  tempPassword: string | null;
  passwordChanged: boolean;
  onClose: () => void;
  onResetPassword?: () => void;
}

const ClientCredentialsModal = ({
  isOpen,
  clientId,
  clientEmail,
  tempPassword,
  passwordChanged,
  onClose,
  onResetPassword
}: ClientCredentialsModalProps) => {
  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copié en presse-papiers!`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-midnight dark:text-white">Identifiants du client</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Client ID Section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">ID Client</p>
            <div className="flex items-center justify-between gap-3">
              <code className="text-lg font-mono font-bold text-midnight dark:text-white bg-white dark:bg-gray-700 px-3 py-2 rounded flex-1 break-all">
                {clientId}
              </code>
              <button
                onClick={() => copyToClipboard(clientId, 'ID Client')}
                className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors flex-shrink-0"
                title="Copier l'ID client"
              >
                <Copy className="w-5 h-5 text-gold" />
              </button>
            </div>
          </div>

          {/* Email Section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Email de connexion</p>
            <div className="flex items-center justify-between gap-3">
              <code className="text-sm font-mono font-bold text-midnight dark:text-white bg-white dark:bg-gray-700 px-3 py-2 rounded flex-1 break-all">
                {clientEmail}
              </code>
              <button
                onClick={() => copyToClipboard(clientEmail, 'Email')}
                className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors flex-shrink-0"
                title="Copier l'email"
              >
                <Copy className="w-5 h-5 text-gold" />
              </button>
            </div>
          </div>

          {/* Password Section */}
          {tempPassword && !passwordChanged ? (
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border-2 border-orange-300 dark:border-orange-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">Mot de passe temporaire (non changé)</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <code className="text-base font-mono font-bold text-orange-900 dark:text-orange-100 bg-white dark:bg-gray-700 px-3 py-2 rounded flex-1 tracking-widest break-all">
                  {tempPassword}
                </code>
                <button
                  onClick={() => copyToClipboard(tempPassword, 'Mot de passe')}
                  className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors flex-shrink-0"
                  title="Copier le mot de passe"
                >
                  <Copy className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </button>
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-400 mt-2">
                ⚠️ Ce mot de passe doit être changé lors de la première connexion du client.
              </p>
            </div>
          ) : passwordChanged ? (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-2 border-green-300 dark:border-green-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">Mot de passe changé ✓</p>
              </div>
              <p className="text-xs text-green-700 dark:text-green-400 mt-2">
                Le client a déjà changé son mot de passe temporaire.
              </p>
            </div>
          ) : null}

          {/* Reset Password Button */}
          {onResetPassword && (
            <button
              onClick={onResetPassword}
              className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              Réinitialiser le mot de passe
            </button>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              📌 <strong>Important:</strong> Partagez l'ID client et l'email avec le client. Le mot de passe doit être communiqué via un canal sécurisé.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg bg-midnight hover:bg-midnight/90 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-midnight font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientCredentialsModal;
