import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Eye, Trash2, Copy, CheckCircle, Key } from 'lucide-react';
import { generateClientId, generateTempPassword, hashPassword, generateContractNumber } from '../../utils/encryptionUtils';
import ClientDetailsModal from './ClientDetailsModal';
import ClientCredentialsModal from './ClientCredentialsModal';
import CloudinaryUploader from './CloudinaryUploader';

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
  contract_url?: string;
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
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newContractNumber, setNewContractNumber] = useState('');
  const [newContractUrl, setNewContractUrl] = useState('');
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
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

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;

  const sendClientInvite = async (payload: { clientName: string; email: string; clientId: string; tempPassword: string; contractNumber: string; contractUrl?: string; }) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/send-client-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        console.warn('sendClientInvite failed:', body.error || 'Impossible d\'envoyer l\'email d\'invitation');
        return false;
      }

      return true;
    } catch (err) {
      console.warn('sendClientInvite network error:', err);
      return false;
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const clientId = generateClientId(clients.map(c => c.client_id));
      const contractNumber = generateContractNumber(clients.map(c => c.numero_contrat));
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
          numero_contrat: contractNumber,
          date_debut: newClientData.date_debut,
          duree_mois: newClientData.duree_mois,
          est_periode_test: newClientData.est_periode_test,
          statut: 'actif',
        });

      if (clientError) throw clientError;

      // Create client_infos record and optionally save contract URL
      const { error: clientInfoError } = await supabase
        .from('client_infos')
        .insert({
          client_id: clientId,
          ...(newContractUrl ? { contract_url: newContractUrl } : {}),
        });

      if (clientInfoError) {
        console.warn('Impossible de sauvegarder le lien du contrat dans client_infos:', clientInfoError);
      }

      setNewClientId(clientId);
      setNewClientEmail(newClientData.email);
      setNewPassword(tempPassword);
      setNewContractNumber(contractNumber);
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

      const invitePayload = {
        clientName: newClientData.nom_responsable || newClientData.nom_marque,
        email: newClientData.email,
        clientId,
        tempPassword,
        contractNumber,
        contractUrl: newContractUrl || undefined,
      };

      const inviteSent = await sendClientInvite(invitePayload);
      if (inviteSent) {
        setMessage({ type: 'success', text: 'Client créé et email d\'invitation envoyé.' });
      } else {
        console.warn('Email invite failed for', invitePayload.email);
        setMessage({ type: 'error', text: 'Client créé, mais l\'email d\'invitation n\'a pas pu être envoyée.' });
      }

      setNewContractUrl('');
      await fetchClients();
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

  const handleDeleteClient = async (client: Client) => {
    if (!confirm(`Supprimer le client ${client.nom_marque} (${client.client_id}) ? Cette action est irréversible.`)) {
      return;
    }

    setDeletingClientId(client.id);
    try {
      // Delete related records first
      const relatedDeletes = [
        await supabase.from('messages').delete().eq('client_id', client.client_id),
        await supabase.from('kpis').delete().eq('client_id', client.client_id),
        await supabase.from('client_infos').delete().eq('client_id', client.client_id),
      ];

      for (const res of relatedDeletes) {
        if (res.error) {
          // If any related delete fails, abort and show the error
          throw res.error;
        }
      }

      // Prefer deleting by primary `id` (safer). Fall back to deleting by `client_id`.
      let clientDeleteError = null;
      if (client.id) {
        const { error } = await supabase.from('clients').delete().eq('id', client.id);
        clientDeleteError = error;
      }

      if (clientDeleteError) {
        // Try fallback deletion by client_id
        const { error } = await supabase.from('clients').delete().eq('client_id', client.client_id);
        clientDeleteError = error || clientDeleteError;
      }

      if (clientDeleteError) {
        // If deletion still fails (e.g. FK constraints / RLS), try marking inactive as a safe fallback
        console.warn('Delete failed, attempting to mark client as inactif:', clientDeleteError);
        const { error: softError } = await supabase
          .from('clients')
          .update({ statut: 'inactif' })
          .eq('id', client.id)
          .eq('client_id', client.client_id);

        if (softError) throw softError;

        // Remove from UI optimistically
        setClients(prev => prev.filter(c => c.id !== client.id));
        setMessage({ type: 'success', text: 'Client marqué comme inactif (suppression partielle).' });
        return;
      }

      // Successful full deletion: remove from UI immediately
      setClients(prev => prev.filter(c => c.id !== client.id));
      if (selectedClient?.id === client.id) {
        setShowDetailsModal(false);
        setSelectedClient(null);
      }
      setMessage({ type: 'success', text: 'Client supprimé avec succès.' });
    } catch (error) {
      console.error('Error deleting client:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la suppression du client.' });
    } finally {
      setDeletingClientId(null);
    }
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

  const handleResetPassword = async (client: Client) => {
    try {
      const tempPassword = generateTempPassword();
      const passwordHash = await hashPassword(tempPassword);

      const { error } = await supabase
        .from('clients')
        .update({ password_hash: passwordHash, password_temp: tempPassword, password_changed: false })
        .eq('id', client.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Mot de passe réinitialisé avec succès.' });
      await fetchClients();

      if (selectedClientForCredentials?.id === client.id) {
        setSelectedClientForCredentials({ ...client, password_temp: tempPassword, password_changed: false });
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la réinitialisation du mot de passe.' });
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

            <div className="grid grid-cols-1 gap-6">
              <CloudinaryUploader
                label="Contrat PDF / Document contractuel (optionnel)"
                value={newContractUrl}
                onChange={setNewContractUrl}
                folder="mideessi/contracts"
                accept="application/pdf,application/*"
                placeholder="https://... ou téléversez un PDF"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Uploadez un contrat pour que le client puisse y accéder directement depuis son espace. Si le lien est déjà disponible, collez-le ci-dessus.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">Numéro de contrat (auto-généré)</p>
                <p className="text-lg font-mono font-bold text-midnight dark:text-white">{newClientData.numero_contrat || 'Généré à la création'}</p>
              </div>
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
                <code className="text-lg font-bold text-midnight dark:text-white">{newClientEmail}</code>
                <button
                  onClick={() => copyToClipboard(newClientEmail, 'Email')}
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

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-300 mb-1 font-semibold">Numéro de contrat</p>
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono font-bold text-amber-900 dark:text-amber-100">{newContractNumber}</code>
                <button
                  onClick={() => copyToClipboard(newContractNumber, 'Numéro de contrat')}
                  className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded"
                >
                  <Copy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
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
      <div className="grid gap-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
                  {client.client_id}
                </p>
                <h3 className="text-xl font-bold text-midnight dark:text-white">{client.nom_marque}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{client.email}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] font-semibold text-gray-500 dark:text-gray-400">
                  {client.password_changed ? 'Mot de passe changé' : 'Mot de passe temporaire'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Cliquez sur « Identifiants » pour voir le mot de passe.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-semibold">
                  {client.pack.toUpperCase()}
                </span>
                <select
                  value={client.statut}
                  onChange={(e) => handleStatusChange(client, e.target.value)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none ${
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
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-3xl p-4">
                <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">N° contrat</p>
                <p className="mt-2 font-bold text-midnight dark:text-white">{client.numero_contrat}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-3xl p-4">
                <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Début</p>
                <p className="mt-2 font-bold text-midnight dark:text-white">{client.date_debut}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedClient(client);
                  setShowDetailsModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
              >
                <Eye className="w-4 h-4 text-gold" />
                Détails
              </button>
              <button
                onClick={() => {
                  setSelectedClientForCredentials(client);
                  setShowCredentialsModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-800 text-sm font-semibold transition-colors"
              >
                <Key className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                Identifiants
              </button>
              <button
                onClick={() => handleDeleteClient(client)}
                disabled={deletingClientId === client.id}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-800 text-sm font-semibold text-red-700 dark:text-red-300 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {deletingClientId === client.id ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        ))}
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
          onDelete={() => selectedClient && handleDeleteClient(selectedClient)}
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
          onResetPassword={() => selectedClientForCredentials && handleResetPassword(selectedClientForCredentials)}
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
