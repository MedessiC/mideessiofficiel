import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { decryptCredential } from '../../utils/encryptionUtils';

interface AdminClientInfosProps {
  clientId: string;
}

interface ClientInfo {
  id: string;
  client_id: string;
  description_activite: string;
  produits_phares: string;
  couleurs_marque: string;
  lien_logo: string;
  ton_souhaite: string[];
  lien_facebook: string;
  lien_tiktok: string;
  acces_facebook_login: string;
  acces_facebook_password: string;
  acces_tiktok_login: string;
  acces_tiktok_password: string;
  promotions_evenements: string;
  contact_urgence_nom: string;
  contact_urgence_tel: string;
  soumis_le: string;
  modifie_le: string;
}

const AdminClientInfos = ({ clientId }: AdminClientInfosProps) => {
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    facebook: false,
    tiktok: false,
  });

  useEffect(() => {
    fetchClientInfo();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchClientInfo, 30000);
    return () => clearInterval(interval);
  }, [clientId]);

  const fetchClientInfo = async () => {
    try {
      const { data } = await supabase
        .from('client_infos')
        .select('*')
        .eq('client_id', clientId)
        .single();

      if (data) {
        setClientInfo(data);
      }
    } catch (error) {
      console.error('Error fetching client info:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchClientInfo();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!clientInfo || !clientInfo.soumis_le) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Le client n'a pas encore rempli ses informations.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Attendez que le client complète son formulaire "Mes infos"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Refresh Controls */}
      <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
            Auto-rafraîchissement actif (toutes les 30 secondes)
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Dernière mise à jour: {new Date(clientInfo.modifie_le || clientInfo.soumis_le).toLocaleTimeString('fr-FR')}
          </p>
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Rafraîchissement...' : 'Rafraîchir maintenant'}
        </button>
      </div>
      {/* Activity Description */}
      {clientInfo.description_activite && (
        <section>
          <h3 className="text-lg font-bold text-midnight dark:text-white mb-3">
            Description de l'activité
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-midnight dark:text-white">{clientInfo.description_activite}</p>
          </div>
        </section>
      )}

      {/* Products */}
      {clientInfo.produits_phares && (
        <section>
          <h3 className="text-lg font-bold text-midnight dark:text-white mb-3">
            Produits phares
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-midnight dark:text-white">{clientInfo.produits_phares}</p>
          </div>
        </section>
      )}

      {/* Brand Colors */}
      {clientInfo.couleurs_marque && (
        <section>
          <h3 className="text-lg font-bold text-midnight dark:text-white mb-3">
            Couleurs de marque
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-midnight dark:text-white">{clientInfo.couleurs_marque}</p>
          </div>
        </section>
      )}

      {/* Logo */}
      {clientInfo.lien_logo && (
        <section>
          <h3 className="text-lg font-bold text-midnight dark:text-white mb-3">
            Logo
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <a
              href={clientInfo.lien_logo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {clientInfo.lien_logo}
            </a>
          </div>
        </section>
      )}

      {/* Tone */}
      {clientInfo.ton_souhaite && clientInfo.ton_souhaite.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-midnight dark:text-white mb-3">
            Ton souhaité
          </h3>
          <div className="flex gap-2 flex-wrap">
            {clientInfo.ton_souhaite.map((ton: string) => (
              <span
                key={ton}
                className="px-4 py-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-semibold text-sm"
              >
                {ton}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Social Media Links */}
      {(clientInfo.lien_facebook || clientInfo.lien_tiktok) && (
        <section>
          <h3 className="text-lg font-bold text-midnight dark:text-white mb-3">
            Réseaux sociaux
          </h3>
          <div className="space-y-3">
            {clientInfo.lien_facebook && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2">
                  Facebook
                </p>
                <a
                  href={clientInfo.lien_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {clientInfo.lien_facebook}
                </a>
              </div>
            )}
            {clientInfo.lien_tiktok && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2">
                  TikTok
                </p>
                <a
                  href={clientInfo.lien_tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {clientInfo.lien_tiktok}
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Social Media Access */}
      {(clientInfo.acces_facebook_login || clientInfo.acces_tiktok_login) && (
        <section>
          <h3 className="text-lg font-bold text-midnight dark:text-white mb-3">
            Accès aux réseaux (chiffrés)
          </h3>
          <div className="space-y-3">
            {clientInfo.acces_facebook_login && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2">
                  Facebook Login
                </p>
                <p className="text-midnight dark:text-white font-mono text-sm break-all">
                  {clientInfo.acces_facebook_login}
                </p>
                {clientInfo.acces_facebook_password && (
                  <div className="mt-2">
                    <button
                      onClick={() =>
                        setShowPasswords(prev => ({
                          ...prev,
                          facebook: !prev.facebook,
                        }))
                      }
                      className="flex items-center gap-1 text-xs text-gold hover:text-gold/80 font-semibold"
                    >
                      {showPasswords.facebook ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Masquer le mot de passe
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Voir le mot de passe
                        </>
                      )}
                    </button>
                    {showPasswords.facebook && (
                      <p className="text-midnight dark:text-white font-mono text-sm mt-2 p-2 bg-gray-200 dark:bg-gray-600 rounded break-all">
                        {decryptCredential(clientInfo.acces_facebook_password)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            {clientInfo.acces_tiktok_login && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2">
                  TikTok Login
                </p>
                <p className="text-midnight dark:text-white font-mono text-sm break-all">
                  {clientInfo.acces_tiktok_login}
                </p>
                {clientInfo.acces_tiktok_password && (
                  <div className="mt-2">
                    <button
                      onClick={() =>
                        setShowPasswords(prev => ({
                          ...prev,
                          tiktok: !prev.tiktok,
                        }))
                      }
                      className="flex items-center gap-1 text-xs text-gold hover:text-gold/80 font-semibold"
                    >
                      {showPasswords.tiktok ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Masquer le mot de passe
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Voir le mot de passe
                        </>
                      )}
                    </button>
                    {showPasswords.tiktok && (
                      <p className="text-midnight dark:text-white font-mono text-sm mt-2 p-2 bg-gray-200 dark:bg-gray-600 rounded break-all">
                        {decryptCredential(clientInfo.acces_tiktok_password)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Promotions & Events */}
      {clientInfo.promotions_evenements && (
        <section>
          <h3 className="text-lg font-bold text-midnight dark:text-white mb-3">
            Promotions et événements
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-midnight dark:text-white whitespace-pre-wrap">
              {clientInfo.promotions_evenements}
            </p>
          </div>
        </section>
      )}

      {/* Emergency Contact */}
      {clientInfo.contact_urgence_nom && (
        <section>
          <h3 className="text-lg font-bold text-midnight dark:text-white mb-3">
            Contact d'urgence
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-midnight dark:text-white font-semibold">
              {clientInfo.contact_urgence_nom}
            </p>
            {clientInfo.contact_urgence_tel && (
              <p className="text-midnight dark:text-white text-sm mt-1">
                {clientInfo.contact_urgence_tel}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminClientInfos;
