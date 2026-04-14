import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Eye, EyeOff } from 'lucide-react';
import { decryptCredential } from '../../utils/encryptionUtils';

interface ClientInfo {
  id: string;
  client_id: string;
  nom_marque: string;
  email: string;
  nom_responsable: string;
  pack: string;
  numero_contrat: string;
  date_debut: string;
  duree_mois: number;
  est_periode_test: boolean;
  statut: string;
}

interface ClientDetailsData {
  client_info: any;
  kpis?: any[];
  messages_count?: number;
}

interface ClientDetailsModalProps {
  client: ClientInfo;
  isOpen: boolean;
  onClose: () => void;
}

const ClientDetailsModal = ({ client, isOpen, onClose }: ClientDetailsModalProps) => {
  const [details, setDetails] = useState<ClientDetailsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    facebook: false,
    tiktok: false,
  });

  useEffect(() => {
    if (isOpen && client) {
      fetchDetails();
    }
  }, [isOpen, client]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      // Fetch client info
      const { data: clientInfoData } = await supabase
        .from('client_infos')
        .select('*')
        .eq('client_id', client.client_id)
        .single();

      // Fetch KPIs
      const { data: kpisData } = await supabase
        .from('kpis')
        .select('*')
        .eq('client_id', client.client_id)
        .order('mois', { ascending: false });

      // Count messages
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('client_id', client.client_id);

      setDetails({
        client_info: clientInfoData,
        kpis: kpisData,
        messages_count: count || 0,
      });
    } catch (error) {
      console.error('Error fetching client details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-midnight dark:text-white">
            Détails du client: {client.nom_marque}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-8">
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <>
              {/* Client Basics */}
              <div>
                <h3 className="text-lg font-bold text-midnight dark:text-white mb-4">
                  Informations de base
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Client ID</p>
                    <p className="text-midnight dark:text-white font-bold">{client.client_id}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Responsable</p>
                    <p className="text-midnight dark:text-white font-bold">{client.nom_responsable}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Email</p>
                    <p className="text-midnight dark:text-white font-bold text-sm">{client.email}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Pack</p>
                    <p className="text-midnight dark:text-white font-bold">{client.pack.toUpperCase()}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">N° Contrat</p>
                    <p className="text-midnight dark:text-white font-bold">{client.numero_contrat}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Statut</p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        client.statut === 'actif'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : client.statut === 'suspendu'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}
                    >
                      {client.statut.charAt(0).toUpperCase() + client.statut.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Client Info Form Data */}
              {details?.client_info && (
                <div>
                  <h3 className="text-lg font-bold text-midnight dark:text-white mb-4">
                    Informations complétées par le client
                  </h3>

                  {!details.client_info.soumis_le ? (
                    <p className="text-gray-600 dark:text-gray-400 italic">
                      Le client n'a pas encore rempli le formulaire d'informations.
                    </p>
                  ) : (
                    <div className="space-y-4 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                      {details.client_info.description_activite && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">
                            Description de l'activité
                          </p>
                          <p className="text-midnight dark:text-white">{details.client_info.description_activite}</p>
                        </div>
                      )}

                      {details.client_info.produits_phares && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">
                            Produits phares
                          </p>
                          <p className="text-midnight dark:text-white">{details.client_info.produits_phares}</p>
                        </div>
                      )}

                      {details.client_info.ton_souhaite?.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2">Ton</p>
                          <div className="flex gap-2 flex-wrap">
                            {details.client_info.ton_souhaite.map((ton: string) => (
                              <span
                                key={ton}
                                className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-semibold"
                              >
                                {ton}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(details.client_info.lien_facebook || details.client_info.lien_tiktok) && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2">Réseaux sociaux</p>
                          {details.client_info.lien_facebook && (
                            <p className="text-midnight dark:text-white text-sm">
                              <span className="font-semibold">Facebook:</span>{' '}
                              <a
                                href={details.client_info.lien_facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {details.client_info.lien_facebook}
                              </a>
                            </p>
                          )}
                          {details.client_info.lien_tiktok && (
                            <p className="text-midnight dark:text-white text-sm">
                              <span className="font-semibold">TikTok:</span>{' '}
                              <a
                                href={details.client_info.lien_tiktok}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {details.client_info.lien_tiktok}
                              </a>
                            </p>
                          )}
                        </div>
                      )}

                      {(details.client_info.acces_facebook_login ||
                        details.client_info.acces_tiktok_login) && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2">
                            Accès réseaux (chiffrés)
                          </p>
                          {details.client_info.acces_facebook_login && (
                            <div className="mb-2 p-2 bg-gray-200 dark:bg-gray-600 rounded">
                              <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                                Facebook Login:
                              </p>
                              <p className="text-midnight dark:text-white text-sm font-mono">
                                {details.client_info.acces_facebook_login}
                              </p>
                              {details.client_info.acces_facebook_password && (
                                <div className="mt-1">
                                  <button
                                    onClick={() =>
                                      setShowPasswords(prev => ({
                                        ...prev,
                                        facebook: !prev.facebook,
                                      }))
                                    }
                                    className="flex items-center gap-1 text-xs text-gold hover:underline"
                                  >
                                    {showPasswords.facebook ? (
                                      <>
                                        <EyeOff className="w-3 h-3" />
                                        Masquer
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="w-3 h-3" />
                                        Afficher mot de passe
                                      </>
                                    )}
                                  </button>
                                  {showPasswords.facebook && (
                                    <p className="text-midnight dark:text-white text-sm font-mono mt-1 p-2 bg-gray-300 dark:bg-gray-500 rounded">
                                      {decryptCredential(details.client_info.acces_facebook_password)}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          {details.client_info.acces_tiktok_login && (
                            <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded">
                              <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                                TikTok Login:
                              </p>
                              <p className="text-midnight dark:text-white text-sm font-mono">
                                {details.client_info.acces_tiktok_login}
                              </p>
                              {details.client_info.acces_tiktok_password && (
                                <div className="mt-1">
                                  <button
                                    onClick={() =>
                                      setShowPasswords(prev => ({
                                        ...prev,
                                        tiktok: !prev.tiktok,
                                      }))
                                    }
                                    className="flex items-center gap-1 text-xs text-gold hover:underline"
                                  >
                                    {showPasswords.tiktok ? (
                                      <>
                                        <EyeOff className="w-3 h-3" />
                                        Masquer
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="w-3 h-3" />
                                        Afficher mot de passe
                                      </>
                                    )}
                                  </button>
                                  {showPasswords.tiktok && (
                                    <p className="text-midnight dark:text-white text-sm font-mono mt-1 p-2 bg-gray-300 dark:bg-gray-500 rounded">
                                      {decryptCredential(details.client_info.acces_tiktok_password)}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {details.client_info.contact_urgence_nom && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">
                            Contact d'urgence
                          </p>
                          <p className="text-midnight dark:text-white">
                            {details.client_info.contact_urgence_nom}
                            {details.client_info.contact_urgence_tel &&
                              ` - ${details.client_info.contact_urgence_tel}`}
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                        Soumis le:{' '}
                        {new Date(details.client_info.soumis_le).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Statistics */}
              <div>
                <h3 className="text-lg font-bold text-midnight dark:text-white mb-4">Statistiques</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">KPIs remplis</p>
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                      {details?.kpis?.length || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Messages</p>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                      {details?.messages_count || 0}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-8 py-6 bg-gray-50 dark:bg-gray-700/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-midnight dark:text-white font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsModal;
