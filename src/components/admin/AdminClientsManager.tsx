import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Eye, Trash2, Copy, CheckCircle, Key } from 'lucide-react';
import { generateClientId, generateTempPassword, hashPassword } from '../../utils/encryptionUtils';
import ClientDetailsModal from './ClientDetailsModal';
import ClientCredentialsModal from './ClientCredentialsModal';

interface Client {
  id: string;
  client_id: string;
  nom_marque: string;
  nom_responsable: string;
  email: string;
  pack: 'kpevi' | 'eya' | 'jago';
  numero_contrat: string;
  date_debut: string;
  duree_mois: number;
  est_periode_test: boolean;
  statut: 'actif' | 'inactif' | 'suspendu';
  password_temp?: string;
  password_changed?: boolean;
}

const AdminClientsManager = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showNewCredentials, setShowNewCredentials] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedClientForCredentials, setSelectedClientForCredentials] = useState<Client | null>(null);
  const [newClientData, setNewClientData] = useState({
    nom_marque: '',
    nom_responsable: '',
    email: '',
    pack: 'kpevi' as const,
    numero_contrat: '',
    date_debut: '',
    duree_mois: 12,
    est_periode_test: false,
  });
  const [newClientId, setNewClientId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des clients' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const clientId = generateClientId(clients.map(c => c.client_id));
      const tempPassword = generateTempPassword();
      
      // Hash the password client-side
      const passwordHash = await hashPassword(tempPassword);

      // Create client record with password hash (no auth.users)
      const { error: clientError } = await supabase
        .from('clients')
        .insert({
          client_id: clientId,
          nom_marque: newClientData.nom_marque,
          nom_responsable: newClientData.nom_responsable,
          email: newClientData.email,
          password_hash: passwordHash,
          password_temp: tempPassword, // Store temp password
          password_changed: false,
          pack: newClientData.pack,
          numero_contrat: newClientData.numero_contrat,
          date_debut: newClientData.date_debut,
          duree_mois: newClientData.duree_mois,
          est_periode_test: newClientData.est_periode_test,
          statut: 'actif',
        });

      if (clientError) throw clientError;

      // Create empty client_infos record
      await supabase
        .from('client_infos')
        .insert({
          client_id: clientId,
        });

      setNewClientId(clientId);
      setNewPassword(tempPassword);
      setShowNewCredentials(true);
      setNewClientData({
        nom_marque: '',
        nom_responsable: '',
        email: '',
        pack: 'kpevi',
        numero_contrat: '',
        date_debut: '',
        duree_mois: 12,
        est_periode_test: false,
      });

      await fetchClients();
      setMessage({ type: 'success', text: 'Client créé avec succès!' });
    } catch (error) {
      console.error('Error creating client:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la création du client' });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: `${label} copié!` });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleStatusChange = async (client: Client, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ statut: newStatus })
        .eq('id', client.id);

      if (error) throw error;

      await fetchClients();
      setMessage({ type: 'success', text: 'Statut mis à jour' });
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-midnight dark:text-white">Gestion des clients</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-yellow-400 hover:from-gold/90 hover:to-yellow-400/90 text-midnight font-bold transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouveau client
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-midnight dark:text-white mb-6">Créer un nouveau client</h3>

          <form onSubmit={handleCreateClient} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Nom de la marque"
                value={newClientData.nom_marque}
                onChange={(e) => setNewClientData({ ...newClientData, nom_marque: e.target.value })}
                required
                className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
              />
              <input
                type="text"
                placeholder="Nom du responsable"
                value={newClientData.nom_responsable}
                onChange={(e) => setNewClientData({ ...newClientData, nom_responsable: e.target.value })}
                required
                className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="email"
                placeholder="Email"
                value={newClientData.email}
                onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                required
                className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
              />
              <select
                value={newClientData.pack}
                onChange={(e) => setNewClientData({ ...newClientData, pack: e.target.value as any })}
                className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
              >
                <option value="kpevi">Kpevi (Découverte)</option>
                <option value="eya">Eya (Professionnelle)</option>
                <option value="jago">Jago (Premium)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Numéro de contrat"
                value={newClientData.numero_contrat}
                onChange={(e) => setNewClientData({ ...newClientData, numero_contrat: e.target.value })}
                required
                className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
              />
              <input
                type="date"
                value={newClientData.date_debut}
                onChange={(e) => setNewClientData({ ...newClientData, date_debut: e.target.value })}
                required
                className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select
                value={newClientData.duree_mois}
                onChange={(e) => setNewClientData({ ...newClientData, duree_mois: parseInt(e.target.value) })}
                className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
              >
                <option value="3">3 mois</option>
                <option value="6">6 mois</option>
                <option value="12">12 mois</option>
                <option value="24">24 mois</option>
              </select>
              <label className="flex items-center gap-3 px-4 py-3">
                <input
                  type="checkbox"
                  checked={newClientData.est_periode_test}
                  onChange={(e) => setNewClientData({ ...newClientData, est_periode_test: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-midnight dark:text-white font-medium">Période de test</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-lg bg-gold hover:bg-gold/90 text-midnight font-bold"
              >
                Créer le client
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-midnight dark:text-white font-bold"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Credentials Display */}
      {showNewCredentials && newClientId && (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-300">Client créé avec succès!</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email du client</p>
              <div className="flex items-center justify-between">
                <code className="text-lg font-bold text-midnight dark:text-white">{newClientData.email}</code>
                <button
                  onClick={() => copyToClipboard(newClientData.email, 'Email')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Copy className="w-5 h-5 text-gold" />
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mot de passe temporaire</p>
              <div className="flex items-center justify-between">
                <code className="text-lg font-bold text-midnight dark:text-white tracking-widest">{newPassword}</code>
                <button
                  onClick={() => copyToClipboard(newPassword, 'Mot de passe')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Copy className="w-5 h-5 text-gold" />
                </button>
              </div>
            </div>

            <p className="text-sm text-green-800 dark:text-green-300">
              ✓ Partagez l'email et le mot de passe avec le client via un canal sécurisé. Le client pourra se connecter sur mideessi.com/clients
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowNewCredentials(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gold hover:bg-gold/90 text-midnight font-bold"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  const client = clients.find(c => c.client_id === newClientId);
                  if (client) {
                    setSelectedClientForCredentials(client);
                    setShowCredentialsModal(true);
                  }
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2"
              >
                <Key className="w-5 h-5" />
                Voir plus tard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clients Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
              <th className="px-6 py-4 text-left text-sm font-bold text-midnight dark:text-white">ID/Marque</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-midnight dark:text-white">Email</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-midnight dark:text-white">Pack</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-midnight dark:text-white">Statut</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-midnight dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-midnight dark:text-white">{client.client_id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{client.nom_marque}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-midnight dark:text-white">{client.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {client.pack.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={client.statut}
                    onChange={(e) => handleStatusChange(client, e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-bold border-0 cursor-pointer ${
                      client.statut === 'actif'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : client.statut === 'suspendu'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}
                  >
                    <option value="actif">Actif</option>
                    <option value="suspendu">Suspendu</option>
                    <option value="inactif">Inactif</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedClient(client);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="w-5 h-5 text-gold" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClientForCredentials(client);
                        setShowCredentialsModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Voir les identifiants"
                    >
                      <Key className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">Aucun client créé. Commencez par en ajouter un.</p>
        </div>
      )}

      {/* Client Details Modal */}
      {selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedClient(null);
          }}
        />
      )}

      {/* Client Credentials Modal */}
      {selectedClientForCredentials && (
        <ClientCredentialsModal
          isOpen={showCredentialsModal}
          clientId={selectedClientForCredentials.client_id}
          clientEmail={selectedClientForCredentials.email}
          tempPassword={selectedClientForCredentials.password_temp || null}
          passwordChanged={selectedClientForCredentials.password_changed || false}
          onClose={() => {
            setShowCredentialsModal(false);
            setSelectedClientForCredentials(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminClientsManager;
