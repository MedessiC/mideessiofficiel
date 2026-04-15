import { useState, useEffect } from 'react';
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

const ClientWeeklyObjectives = ({ clientId }: ClientWeeklyObjectivesProps) => {
  const [objectives, setObjectives] = useState<WeeklyObjective[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [weeks, setWeeks] = useState<{ start: string; end: string; label: string }[]>([]);

  useEffect(() => {
    generateWeekOptions();
    fetchObjectives();
  }, [clientId]);

  const generateWeekOptions = () => {
    const weeksList = [];
    const today = new Date();

    // Générer 13 semaines (semaine en cours + 12 après)
    for (let i = -2; i < 11; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - date.getDay() + i * 7);

      const startDate = new Date(date);
      startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1));

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);

      weeksList.push({
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        label: `${startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} - ${endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}`,
      });
    }

    setWeeks(weeksList);
    setSelectedWeek(weeksList[2].start); // Semaine en cours par défaut
  };

  const fetchObjectives = async () => {
    try {
      const { data } = await supabase
        .from('weekly_objectives')
        .select('*')
        .eq('client_id', clientId)
        .eq('validated_by_admin', true)
        .order('week_start', { ascending: false });

      if (data) {
        setObjectives(data);
      }
    } catch (error) {
      console.error('Error fetching objectives:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedWeekData = weeks.find(w => w.start === selectedWeek);
  const weekObjectives = objectives.filter(
    obj => obj.week_start === selectedWeek && obj.week_end
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'achieved':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'in_progress':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return <Target className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'En attente',
      in_progress: 'En cours',
      achieved: 'Atteint',
      failed: 'Non atteint',
      cancelled: 'Annulé',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600',
      in_progress: 'from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20',
      achieved: 'from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20',
      failed: 'from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20',
      cancelled: 'from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-500',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusBorder = (status: string) => {
    const borders = {
      pending: 'border-gray-300 dark:border-gray-600',
      in_progress: 'border-blue-300 dark:border-blue-600',
      achieved: 'border-green-300 dark:border-green-600',
      failed: 'border-red-300 dark:border-red-600',
      cancelled: 'border-gray-400 dark:border-gray-500',
    };
    return borders[status as keyof typeof borders] || borders.pending;
  };

  const getTotalProgress = () => {
    if (weekObjectives.length === 0) return 0;
    const totalProgress = weekObjectives.reduce((sum, obj) => sum + obj.progress_percentage, 0);
    return Math.round(totalProgress / weekObjectives.length);
  };

  const achievedCount = weekObjectives.filter(obj => obj.status === 'achieved').length;

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-midnight dark:text-white flex items-center gap-2 mb-4">
          <Target className="w-6 h-6" />
          Mes Objectifs Hebdomadaires
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Suivi des objectifs définis chaque semaine pour votre service
        </p>
      </div>

      {/* Week Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {weeks.map((week) => (
          <button
            key={week.start}
            onClick={() => setSelectedWeek(week.start)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
              selectedWeek === week.start
                ? 'bg-gold text-midnight'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {week.label}
          </button>
        ))}
      </div>

      {/* Week Summary */}
      {selectedWeekData && weekObjectives.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-4 border border-blue-300 dark:border-blue-600">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Total</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{weekObjectives.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-4 border border-green-300 dark:border-green-600">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Atteints</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{achievedCount}</p>
          </div>
          <div className="bg-gradient-to-br from-gold/20 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20 rounded-lg p-4 border border-gold/30">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Progression</p>
            <p className="text-2xl font-bold text-gold">{getTotalProgress()}%</p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg p-4 border border-purple-300 dark:border-purple-600">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Taux</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {weekObjectives.length > 0 ? Math.round((achievedCount / weekObjectives.length) * 100) : 0}%
            </p>
          </div>
        </div>
      )}

      {/* Overall Progress Bar */}
      {weekObjectives.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Progression globale</p>
          <div className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold via-yellow-400 to-gold transition-all duration-500"
              style={{ width: `${getTotalProgress()}%` }}
            ></div>
          </div>
          <p className="text-right text-xs font-bold text-gold mt-2">{getTotalProgress()}% complété</p>
        </div>
      )}

      {/* Objectives Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {weekObjectives.map((obj) => (
          <div
            key={obj.id}
            className={`bg-gradient-to-br ${getStatusColor(obj.status)} rounded-xl p-5 border-2 ${getStatusBorder(obj.status)} transition-all hover:shadow-lg`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-midnight dark:text-white text-lg">{obj.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{obj.category}</p>
              </div>
              {getStatusIcon(obj.status)}
            </div>

            {/* Description */}
            {obj.description && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{obj.description}</p>
            )}

            {/* Metrics */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700 dark:text-gray-400">Objectif</span>
                <span className="font-bold text-midnight dark:text-white">
                  {obj.target_value} {obj.unit}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700 dark:text-gray-400">Atteint</span>
                <span className="font-bold text-gold">{obj.actual_value} / {obj.target_value}</span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="w-full h-2 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all"
                    style={{ width: `${Math.min(obj.progress_percentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs font-semibold text-gold mt-1">{obj.progress_percentage}%</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between pt-3 border-t border-white/30 dark:border-black/20">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                obj.status === 'achieved'
                  ? 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                  : obj.status === 'failed'
                  ? 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                  : obj.status === 'in_progress'
                  ? 'bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {getStatusLabel(obj.status)}
              </span>
              {obj.priority === 'high' && (
                <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 text-xs font-semibold rounded">Haute</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {weekObjectives.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Aucun objectif pour cette semaine
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Les objectifs seront ajoutés par votre équipe MIDEESSI
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientWeeklyObjectives;
