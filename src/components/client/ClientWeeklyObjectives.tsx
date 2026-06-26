import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, Target, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

interface WeeklyObjective {
  id: string;
  client_id: string;
  week_start: string;
  week_end: string;
  title: string;
  description: string;
  target_value: number;
  unit: string;
  status: 'pending' | 'in_progress' | 'achieved' | 'failed' | 'cancelled';
  actual_value: number;
  progress_percentage: number;
  priority: 'low' | 'normal' | 'high';
  category: string;
  validated_by_admin: boolean;
}

interface ClientWeeklyObjectivesProps {
  clientId: string;
}

const statusStyles: Record<string, { bg: string; border: string; icon: JSX.Element }> = {
  pending: { bg: 'from-slate-100 to-slate-50', border: 'border-slate-300', icon: <Calendar className="w-5 h-5 text-slate-500" /> },
  in_progress: { bg: 'from-[var(--brand-gold)]/15 to-[var(--brand-gold)]/5', border: 'border-[var(--brand-gold)]/40', icon: <TrendingUp className="w-5 h-5 text-[var(--brand-gold)]" /> },
  achieved: { bg: 'from-emerald-100 to-emerald-50', border: 'border-emerald-300', icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" /> },
  failed: { bg: 'from-red-100 to-red-50', border: 'border-red-300', icon: <AlertCircle className="w-5 h-5 text-red-600" /> },
  cancelled: { bg: 'from-slate-200 to-slate-100', border: 'border-slate-400', icon: <Target className="w-5 h-5 text-slate-600" /> },
};

const ClientWeeklyObjectives = ({ clientId }: ClientWeeklyObjectivesProps) => {
  const [objectives, setObjectives] = useState<WeeklyObjective[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [weeks, setWeeks] = useState<{ start: string; end: string; label: string }[]>([]);

  useEffect(() => {
    generateWeekOptions();
  }, []);

  useEffect(() => {
    if (clientId) fetchObjectives();
  }, [clientId]);

  useEffect(() => {
    if (!selectedWeek && weeks.length) setSelectedWeek(weeks[2]?.start || weeks[0]?.start);
  }, [weeks]);

  const generateWeekOptions = () => {
    const weeksList: { start: string; end: string; label: string }[] = [];
    const today = new Date();

    for (let offset = -2; offset <= 8; offset += 1) {
      const current = new Date(today);
      current.setDate(current.getDate() + offset * 7);
      const start = new Date(current);
      const day = start.getDay();
      start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      weeksList.push({
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
        label: `${start.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}`,
      });
    }

    setWeeks(weeksList);
  };

  const fetchObjectives = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('weekly_objectives')
        .select('*')
        .eq('client_id', clientId)
        .eq('validated_by_admin', true)
        .order('week_start', { ascending: false });

      setObjectives((data as WeeklyObjective[]) || []);
    } catch (error) {
      console.error('Error fetching objectives:', error);
    } finally {
      setLoading(false);
    }
  };

  const weekObjectives = objectives.filter((obj) => obj.week_start === selectedWeek);
  const totalProgress = weekObjectives.length ? Math.round(weekObjectives.reduce((sum, item) => sum + item.progress_percentage, 0) / weekObjectives.length) : 0;
  const achievedCount = weekObjectives.filter((obj) => obj.status === 'achieved').length;

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-slate-200 rounded-3xl"></div>
        <div className="h-64 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--brand-gold)]/80">Objectifs hebdomadaires</p>
            <h1 className="mt-2 text-2xl font-semibold text-[var(--brand-midnight)] sm:text-3xl">Votre rythme de croissance</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Suivez vos priorités, les progrès de l'équipe et les résultats calculés chaque semaine.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Objectifs validés</p>
            <p className="mt-3 text-2xl font-semibold text-[var(--brand-midnight)] sm:text-3xl">{objectives.length}</p>
          </div>
        </div>
      </section>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-3">
          {weeks.map((week) => (
            <button
              key={week.start}
              type="button"
              onClick={() => setSelectedWeek(week.start)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm ${selectedWeek === week.start ? 'bg-[var(--brand-gold)] text-[var(--brand-midnight)] border-[var(--brand-gold)]' : 'bg-slate-100 text-slate-700 border-slate-200'}`}
            >
              {week.label}
            </button>
          ))}
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-5 text-center sm:p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total</p>
          <p className="mt-3 text-2xl font-semibold text-[var(--brand-midnight)] sm:text-3xl">{weekObjectives.length}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-5 text-center sm:p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Atteints</p>
          <p className="mt-3 text-2xl font-semibold text-[var(--brand-gold)] sm:text-3xl">{achievedCount}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-5 text-center sm:p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Progression</p>
          <p className="mt-3 text-2xl font-semibold text-[var(--brand-midnight)] sm:text-3xl">{totalProgress}%</p>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-soft sm:p-8">
        {weekObjectives.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Aucune donnée</p>
            <h2 className="mt-4 text-2xl font-semibold text-[var(--brand-midnight)]">Aucun objectif planifié pour cette semaine</h2>
            <p className="mt-3 text-sm text-slate-600">Votre équipe MIDEESSI met en place votre plan d'actions. Retrouvez les objectifs dès qu'ils seront validés.</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {weekObjectives.map((objective) => {
              const style = statusStyles[objective.status] || statusStyles.pending;
              return (
                <article key={objective.id} className={`rounded-[28px] border ${style.border} bg-gradient-to-br ${style.bg} p-5 shadow-sm sm:p-6`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{objective.category}</p>
                      <h3 className="mt-2 text-xl font-semibold text-[var(--brand-midnight)]">{objective.title}</h3>
                    </div>
                    <div className="rounded-2xl bg-white/80 p-3 text-slate-900">{style.icon}</div>
                  </div>

                  <p className="mt-4 text-sm text-slate-700 leading-relaxed">{objective.description}</p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white/80 p-4"> 
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Objectif</p>
                      <p className="mt-2 text-lg font-semibold text-[var(--brand-midnight)]">{objective.target_value} {objective.unit}</p>
                    </div>
                    <div className="rounded-3xl bg-white/80 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Atteint</p>
                      <p className="mt-2 text-lg font-semibold text-[var(--brand-gold)]">{objective.actual_value} {objective.unit}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                      <span>Progression</span>
                      <span>{objective.progress_percentage}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400" style={{ width: `${Math.min(objective.progress_percentage, 100)}%` }} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ClientWeeklyObjectives;
