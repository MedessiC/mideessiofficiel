import { useEffect, useState } from 'react';
import { useClientAuth } from '../../contexts/ClientContext';
import { supabase } from '../../lib/supabase';
import { TrendingUp, Users, MessageSquare, FileText } from 'lucide-react';

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
    if (user?.client_id) fetchKPIs();
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
  const publicationProgress = kpis ? (kpis.publications_prevues > 0 ? Math.min((kpis.publications_livrees / kpis.publications_prevues) * 100, 100) : 0) : 0;
  const budgetUtilization = kpis?.budget_pub_alloue ? Math.min((kpis.budget_pub_depense / kpis.budget_pub_alloue) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-24 rounded-3xl bg-slate-200"></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-40 rounded-3xl bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/80 bg-white/95 p-8 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--brand-gold)]/80">Performance</p>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--brand-midnight)]">Indicateurs clés</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Visualisez l’essentiel de vos résultats MIDEESSI de manière claire et premium.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Mois</p>
            <p className="mt-3 text-xl font-semibold text-[var(--brand-midnight)]">{monthName}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
          {[
            {
              title: 'Publications livrées',
              value: `${kpis?.publications_livrees || 0}/${kpis?.publications_prevues || 0}`,
              meta: `${Math.round(publicationProgress)}% complété`,
              icon: <FileText className="w-5 h-5 text-[var(--brand-gold)]" />,
            },
            {
              title: 'Engagement',
              value: `${kpis?.taux_engagement.toFixed(2) || 0}%`,
              meta: kpis?.taux_engagement > 5 ? 'Très bon rythme' : 'En cours de consolidation',
              icon: <TrendingUp className="w-5 h-5 text-[var(--brand-gold)]" />,
            },
            {
              title: 'Croissance abonnés',
              value: `+${kpis?.croissance_abonnes || 0}`,
              meta: 'Tendance mensuelle',
              icon: <Users className="w-5 h-5 text-[var(--brand-gold)]" />,
            },
            {
              title: 'Messages générés',
              value: `${kpis?.messages_generes || 0}`,
              meta: 'Impact contenu',
              icon: <MessageSquare className="w-5 h-5 text-[var(--brand-gold)]" />,
            },
          ].map((card) => (
            <article key={card.title} className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{card.title}</p>
                  <p className="mt-3 text-3xl font-semibold text-[var(--brand-midnight)]">{card.value}</p>
                </div>
                <div className="rounded-3xl bg-[var(--brand-gold)]/15 p-3">{card.icon}</div>
              </div>
              <p className="mt-5 text-sm text-slate-600">{card.meta}</p>
            </article>
          ))}
        </div>

        <div className="rounded-[32px] border border-slate-200/80 bg-white/95 p-8 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Budget</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--brand-midnight)]">Utilisation publicitaire</h2>
            </div>
            <div className="rounded-3xl bg-[var(--brand-gold)]/15 px-4 py-2 text-sm font-semibold text-[var(--brand-midnight)]">
              {budgetUtilization.toFixed(0)}%
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Alloué</span>
                <span>{kpis?.budget_pub_alloue.toLocaleString() || 0} FCFA</span>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Dépensé</span>
                <span>{kpis?.budget_pub_depense.toLocaleString() || 0} FCFA</span>
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
                <span>Avancement budget</span>
                <span className="font-semibold text-[var(--brand-midnight)]">{budgetUtilization.toFixed(0)}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400" style={{ width: `${budgetUtilization}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-[32px] border border-[var(--brand-gold)]/30 bg-[var(--brand-gold)]/10 p-6 text-[var(--brand-midnight)] shadow-sm/50">
        <p className="text-sm">
          ℹ️ Ces indicateurs sont générés par votre équipe MIDEESSI et mis à jour pour vous offrir une vue stratégique premium.
        </p>
      </div>
    </div>
  );
};

export default ClientKPIs;
