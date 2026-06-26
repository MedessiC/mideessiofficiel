import { useEffect, useState } from 'react';
import { Copy, Key } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AdminClientCredentialsProps {
  clientId: string;
}

interface ClientCredentials {
  client_id: string;
  email: string;
  nom_marque: string;
  pack: string;
  statut: string;
  password_temp: string | null;
  password_changed: boolean;
}

const AdminClientCredentials = ({ clientId }: AdminClientCredentialsProps) => {
  const [credentials, setCredentials] = useState<ClientCredentials | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCredentials = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('clients')
          .select('client_id, email, nom_marque, pack, statut, password_temp, password_changed')
          .eq('client_id', clientId)
          .single();

        if (data) {
          setCredentials(data as ClientCredentials);
        }
      } catch (error) {
        console.error('Error fetching client credentials:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCredentials();
  }, [clientId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copié`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!credentials) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Aucune information d’authentification trouvée pour ce client.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gold text-midnight">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-midnight dark:text-white">Identifiants du client</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Accès rapide aux données de connexion.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Client ID</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <code className="break-all text-sm font-semibold text-midnight dark:text-white">{credentials.client_id}</code>
              <button
                onClick={() => copyToClipboard(credentials.client_id, 'ID client')}
                className="rounded-full p-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                <Copy className="w-4 h-4 text-gold" />
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Email de connexion</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <code className="break-all text-sm font-semibold text-midnight dark:text-white">{credentials.email}</code>
              <button
                onClick={() => copyToClipboard(credentials.email, 'Email')}
                className="rounded-full p-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                <Copy className="w-4 h-4 text-gold" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Mot de passe temporaire</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <code className="break-all text-sm font-semibold text-midnight dark:text-white">
                {credentials.password_temp || 'Non défini'}
              </code>
              {credentials.password_temp && (
                <button
                  onClick={() => copyToClipboard(credentials.password_temp as string, 'Mot de passe')}
                  className="rounded-full p-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  <Copy className="w-4 h-4 text-gold" />
                </button>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Statut du mot de passe</p>
            <p className="mt-2 text-sm font-semibold text-midnight dark:text-white">
              {credentials.password_changed ? 'Changé' : 'Temporaire'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Si le mot de passe est temporaire, il doit être communiqué au client de manière sécurisée. Le client sera invité à le changer lors de sa première connexion.
        </p>
      </div>
    </div>
  );
};

export default AdminClientCredentials;
