import { useEffect, useState } from 'react';
import { useClientAuth } from '../../contexts/ClientContext';
import { supabase } from '../../lib/supabase';
import { Calendar, Package, CheckCircle, AlertCircle, TrendingUp, Zap, Clock, Shield } from 'lucide-react';

interface ClientData {
  pack: string;
  numero_contrat: string;
  date_debut: string;
  duree_mois: number;
  est_periode_test: boolean;
  statut: string;
}

const ClientDashboardHome = () => {
  const { user } = useClientAuth();
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientData();
  }, [user?.client_id]);

  const fetchClientData = async () => {
    try {
      if (!user?.client_id) return;

      const { data } = await supabase
        .from('clients')
        .select('pack, numero_contrat, date_debut, duree_mois, est_periode_test, statut')
        .eq('client_id', user.client_id)
        .single();

      if (data) {
        setClient(data);
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEndDate = () => {
    if (!client?.date_debut || !client?.duree_mois) return '';
    const startDate = new Date(client.date_debut);
    const endDate = new Date(startDate.setMonth(startDate.getMonth() + client.duree_mois));
    return endDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateProgress = () => {
    if (!client?.date_debut || !client?.duree_mois) return 0;
    const startDate = new Date(client.date_debut);
    const endDate = new Date(startDate.setMonth(startDate.getMonth() + client.duree_mois));
    const now = new Date();
    const total = endDate.getTime() - new Date(client.date_debut).getTime();
    const elapsed = now.getTime() - new Date(client.date_debut).getTime();
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const packInfo = {
    kpevi: { label: 'Découverte', color: 'from-blue-600 to-cyan-600', icon: '🎯', description: 'Plan d\'essai' },
    eya: { label: 'Professionnelle', color: 'from-green-600 to-emerald-600', icon: '⚡', description: 'Plan standard' },
    jago: { label: 'Premium', color: 'from-purple-600 to-pink-600', icon: '👑', description: 'Plan complet' },
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const currentPackInfo = packInfo[client?.pack as keyof typeof packInfo] || packInfo.kpevi;

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero Welcome Section */}
      <div className={`relative overflow-hidden rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-br ${currentPackInfo.color} text-white shadow-lg`}>
        <div className="absolute top-0 right-0 w-40 h-40 opacity-20">
          <div className="absolute inset-0 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Bienvenue, {user?.nom_marque}! {currentPackInfo.icon}
              </h2>
              <p className="text-white/80 text-sm sm:text-base lg:text-lg">
                Votre espace pour gérer votre présence digitale avec MIDEESSI
              </p>
            </div>
            <div className="hidden sm:flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/20 backdrop-blur-sm">
              <span className="text-4xl lg:text-5xl">{currentPackInfo.icon}</span>
            </div>
          </div>

          {/* Quick Status */}
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium">
              📋 {currentPackInfo.label}
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              client?.statut === 'actif'
                ? 'bg-green-400/30 border border-green-200/50'
                : 'bg-orange-400/30 border border-orange-200/50'
            }`}>
              {client?.statut === 'actif' ? '✓ Actif' : '⚠️ ' + (client?.statut?.charAt(0).toUpperCase() + client?.statut?.slice(1))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Mobile First */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Contract Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200 dark:border-blue-800/30 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Pack</p>
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-midnight dark:text-white">
            {client?.pack?.toUpperCase()}
          </h3>
          <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">{currentPackInfo.description}</p>
        </div>

        {/* Status Card */}
        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border hover:shadow-md transition-shadow ${
          client?.statut === 'actif'
            ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border-green-200 dark:border-green-800/30'
            : 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 border-orange-200 dark:border-orange-800/30'
        }`}>
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center ${
              client?.statut === 'actif'
                ? 'bg-green-500/20'
                : 'bg-orange-500/20'
            }`}>
              {client?.statut === 'actif' ? (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600 dark:text-orange-400" />
              )}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Statut</p>
          </div>
          <h3 className={`text-lg sm:text-2xl lg:text-3xl font-bold ${
            client?.statut === 'actif'
              ? 'text-green-700 dark:text-green-400'
              : 'text-orange-700 dark:text-orange-400'
          }`}>
            {client?.statut?.charAt(0).toUpperCase() + client?.statut?.slice(1)}
          </h3>
        </div>

        {/* ID Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200 dark:border-purple-800/30 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">ID Client</p>
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-midnight dark:text-white font-mono">
            {user?.client_id}
          </h3>
          <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">Unique identifier</p>
        </div>

        {/* Contract Number Card */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200 dark:border-amber-800/30 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Contrat</p>
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-midnight dark:text-white font-mono">
            {client?.numero_contrat}
          </h3>
          <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">Reference</p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Duration Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold/20 to-yellow-400/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-midnight dark:text-white">Période d'engagement</h3>
          </div>

          <div className="space-y-5">
            {/* Start Date */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Début</p>
              <p className="text-lg sm:text-xl font-semibold text-midnight dark:text-white">
                {client?.date_debut
                  ? new Date(client.date_debut).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '-'}
              </p>
            </div>

            {/* End Date */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Fin</p>
              <p className="text-lg sm:text-xl font-semibold text-midnight dark:text-white">
                {calculateEndDate() || '-'}
              </p>
            </div>

            {/* Duration */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Durée</p>
              <p className="text-lg sm:text-xl font-semibold text-midnight dark:text-white">
                {client?.duree_mois} mois
              </p>
            </div>

            {/* Progress Bar */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Progression</p>
                <p className="text-sm font-bold text-gold">{Math.round(calculateProgress())}%</p>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-500"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Type Card */}
        <div className={`rounded-2xl p-6 sm:p-8 border shadow-sm hover:shadow-md transition-shadow ${
          client?.est_periode_test
            ? 'bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-800/30'
            : 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800/30'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              client?.est_periode_test
                ? 'bg-cyan-600/20'
                : 'bg-emerald-600/20'
            }`}>
              <Clock className={`w-6 h-6 ${
                client?.est_periode_test
                  ? 'text-cyan-600 dark:text-cyan-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`} />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold ${
              client?.est_periode_test
                ? 'text-cyan-900 dark:text-cyan-300'
                : 'text-emerald-900 dark:text-emerald-300'
            }`}>Type d'engagement</h3>
          </div>

          <div className={`inline-block px-5 py-3 rounded-lg font-semibold text-sm sm:text-base mb-4 ${
            client?.est_periode_test
              ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
          }`}>
            {client?.est_periode_test ? '🧪 Période de test' : '✓ Engagement ferme'}
          </div>

          <p className={`text-sm leading-relaxed ${
            client?.est_periode_test
              ? 'text-cyan-700 dark:text-cyan-400'
              : 'text-emerald-700 dark:text-emerald-400'
          }`}>
            {client?.est_periode_test
              ? 'Vous êtes actuellement en période de test. Vous pourrez basculer vers un engagement ferme après évaluation. Pendant cette phase, testez tous les services MIDEESSI.'
              : 'Vous êtes engagé pour la durée complète du contrat. Nous sommes heureux d\'être vos partenaires digitaux.'}
          </p>
        </div>
      </div>

      {/* Action Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold/20 to-yellow-400/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-midnight dark:text-white">Prochaines étapes</h3>
        </div>

        <div className="space-y-4">
          {[
            {
              num: '1',
              title: 'Complétez vos informations',
              desc: 'Remplissez votre profil détaillé pour nous aider à personnaliser nos services'
            },
            {
              num: '2',
              title: 'Consultez vos performances',
              desc: 'Suivez vos KPIs en temps réel, mis à jour chaque mois'
            },
            {
              num: '3',
              title: 'Planifiez avec nous',
              desc: 'Découvrez le calendrier éditorial et les contenus prévus pour vous'
            },
            {
              num: '4',
              title: 'Restez informé',
              desc: 'Consultez les rapports détaillés et les messages de son équipe'
            }
          ].map((step, index) => (
            <div key={index} className="flex gap-4 items-start group hover:bg-gray-50 dark:hover:bg-gray-700/30 p-4 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-yellow-400 flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-sm font-bold text-midnight">{step.num}</span>
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="font-semibold text-midnight dark:text-white text-sm sm:text-base">{step.title}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardHome;
