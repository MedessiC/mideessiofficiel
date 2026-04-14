import { useEffect, useState } from 'react';
import { useClientAuth } from '../../contexts/ClientContext';
import { supabase } from '../../lib/supabase';
import { TrendingUp, Users, MessageSquare, Zap } from 'lucide-react';

interface KPI {
  publications_livrees: number;
  publications_prevues: number;
  taux_engagement: number;
  croissance_abonnes: number;
  messages_generes: number;
  budget_pub_depense: number;
  budget_pub_alloue: number;
}

const ClientKPIs = () => {
  const { user } = useClientAuth();
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchKPIs();
  }, [user?.client_id, currentMonth]);

  const fetchKPIs = async () => {
    try {
      if (!user?.client_id) return;

      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const dateStr = firstDayOfMonth.toISOString().split('T')[0];

      const { data } = await supabase
        .from('kpis')
        .select('*')
        .eq('client_id', user.client_id)
        .eq('mois', dateStr)
        .single();

      if (data) {
        setKpis({
          publications_livrees: data.publications_livrees || 0,
          publications_prevues: data.publications_prevues || 16,
          taux_engagement: data.taux_engagement || 0,
          croissance_abonnes: data.croissance_abonnes || 0,
          messages_generes: data.messages_generes || 0,
          budget_pub_depense: data.budget_pub_depense || 0,
          budget_pub_alloue: data.budget_pub_alloue || 0,
        });
      } else {
        // Initialize with default values
        setKpis({
          publications_livrees: 0,
          publications_prevues: 16,
          taux_engagement: 0,
          croissance_abonnes: 0,
          messages_generes: 0,
          budget_pub_depense: 0,
          budget_pub_alloue: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const publicationProgress = kpis ? (kpis.publications_livrees / kpis.publications_prevues) * 100 : 0;

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>;
  }

  if (!kpis) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
        <p className="text-yellow-800 dark:text-yellow-300">
          Aucune donnée disponible pour ce mois. Veuillez revenir bientôt.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Month Selector */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-midnight dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          ← Mois précédent
        </button>
        <div className="text-xl font-bold text-midnight dark:text-white min-w-[200px] text-center">
          {monthName}
        </div>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          disabled={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1) > new Date()}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-midnight dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mois suivant →
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Publications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Publications</p>
              <h3 className="text-3xl md:text-4xl font-bold text-midnight dark:text-white">
                {kpis.publications_livrees}/{kpis.publications_prevues}
              </h3>
            </div>
            <Zap className="w-8 h-8 text-gold" />
          </div>
          <div className="space-y-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-gold to-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(publicationProgress, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {Math.round(publicationProgress)}% de vos publications livrées
            </p>
          </div>
        </div>

        {/* Engagement */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Taux d'engagement</p>
              <h3 className="text-3xl md:text-4xl font-bold text-midnight dark:text-white">
                {kpis.taux_engagement.toFixed(2)}%
              </h3>
            </div>
            <TrendingUp className="w-8 h-8 text-gold" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {kpis.taux_engagement > 5 ? '📈 Excellent engagement!' : 'En progression...'}
          </p>
        </div>

        {/* New Followers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Nouveaux abonnés</p>
              <h3 className="text-3xl md:text-4xl font-bold text-midnight dark:text-white">
                +{kpis.croissance_abonnes}
              </h3>
            </div>
            <Users className="w-8 h-8 text-gold" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Croissance ce mois-ci
          </p>
        </div>

        {/* Generated Messages */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Messages générés</p>
              <h3 className="text-3xl md:text-4xl font-bold text-midnight dark:text-white">
                {kpis.messages_generes}
              </h3>
            </div>
            <MessageSquare className="w-8 h-8 text-gold" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Contenus créés par MIDEESSI
          </p>
        </div>
      </div>

      {/* Budget Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-midnight dark:text-white mb-6">Budget publicitaire</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Budget alloué</p>
            <p className="text-3xl font-bold text-midnight dark:text-white">
              {kpis.budget_pub_alloue.toLocaleString()} FCFA
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Budget dépensé</p>
            <p className="text-3xl font-bold text-gold">
              {kpis.budget_pub_depense.toLocaleString()} FCFA
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Utilisation du budget</span>
            <span className="text-sm font-semibold text-midnight dark:text-white">
              {kpis.budget_pub_alloue > 0
                ? Math.round((kpis.budget_pub_depense / kpis.budget_pub_alloue) * 100)
                : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-gold to-yellow-400 h-3 rounded-full transition-all duration-300"
              style={{
                width: kpis.budget_pub_alloue > 0
                  ? `${Math.min((kpis.budget_pub_depense / kpis.budget_pub_alloue) * 100, 100)}%`
                  : '0%',
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <p className="text-blue-800 dark:text-blue-300 text-sm">
          ℹ️ Ces données sont mises à jour mensuellement par notre équipe MIDEESSI. Pour toute question, contactez-nous via la messagerie.
        </p>
      </div>
    </div>
  );
};

export default ClientKPIs;
