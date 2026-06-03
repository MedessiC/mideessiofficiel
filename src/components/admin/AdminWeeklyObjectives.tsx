import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, CheckCircle, X, Calendar, Target, TrendingUp } from 'lucide-react';

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

interface AdminWeeklyObjectivesProps {
  clientId: string;
}

const AdminWeeklyObjectives = ({ clientId }: AdminWeeklyObjectivesProps) => {
  const [objectives, setObjectives] = useState<WeeklyObjective[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    week_start: '',
    week_end: '',
    title: '',
    description: '',
    target_value: '',
    unit: 'publications',
    priority: 'normal',
    category: 'content',
  });

  useEffect(() => {
    fetchObjectives();
  }, [clientId]);

  const fetchObjectives = async () => {
    try {
      const { data } = await supabase
        .from('weekly_objectives')
        .select('*')
        .eq('client_id', clientId)
        .order('week_start', { ascending: false });

      if (data) {
        setObjectives(data);
      }
    } catch (error) {
      console.error('Error fetching objectives:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des objectifs' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('weekly_objectives')
          .update({
            ...formData,
            target_value: parseInt(formData.target_value),
          })
          .eq('id', editingId);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Objectif modifié avec succès' });
      } else {
        const { error } = await supabase
          .from('weekly_objectives')
          .insert({
            client_id: clientId,
            ...formData,
            target_value: parseInt(formData.target_value),
          });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Objectif créé avec succès' });
      }

      await fetchObjectives();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        week_start: '',
        week_end: '',
        title: '',
        description: '',
        target_value: '',
        unit: 'publications',
        priority: 'normal',
        category: 'content',
      });
    } catch (error) {
      console.error('Error saving objective:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('weekly_objectives')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Objectif supprimé' });
      await fetchObjectives();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string, actualValue?: string) => {
    try {
      const updateData: any = {
        status: newStatus,
      };

      if (actualValue) {
        updateData.actual_value = parseInt(actualValue);
        updateData.progress_percentage = Math.round(
          (parseInt(actualValue) / objectives.find(o => o.id === id)?.target_value || 1) * 100
        );
      }

      const { error } = await supabase
        .from('weekly_objectives')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      await fetchObjectives();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    }
  };

  const handleValidate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('weekly_objectives')
        .update({
          validated_by_admin: true,
          validated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Objectif validé et visible au client' });
      await fetchObjectives();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la validation' });
    }
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    achieved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    cancelled: 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300',
  };

  const priorityIcons = {
    low: '📍',
    normal: '⭐',
    high: '🔥',
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-midnight dark:text-white flex items-center gap-2">
          <Target className="w-6 h-6" />
          Objectifs hebdomadaires
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold hover:bg-gold/90 text-midnight font-bold"
        >
          <Plus className="w-5 h-5" />
          Ajouter
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-midnight dark:text-white mb-4">
            {editingId ? 'Modifier l\'objectif' : 'Créer un nouvel objectif'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Début de semaine
                </label>
                <input
                  type="date"
                  value={formData.week_start}
                  onChange={(e) => setFormData({ ...formData, week_start: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fin de semaine
                </label>
                <input
                  type="date"
                  value={formData.week_end}
                  onChange={(e) => setFormData({ ...formData, week_end: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre de l'objectif
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valeur cible
                </label>
                <input
                  type="number"
                  value={formData.target_value}
                  onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Unité
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
                >
                  <option value="publications">Publications</option>
                  <option value="followers">Followers</option>
                  <option value="engagement_rate">Taux d'engagement</option>
                  <option value="likes">Likes</option>
                  <option value="comments">Commentaires</option>
                  <option value="shares">Partages</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priorité
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
                >
                  <option value="low">Basse</option>
                  <option value="normal">Normale</option>
                  <option value="high">Haute</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
              >
                <option value="content">Contenu</option>
                <option value="engagement">Engagement</option>
                <option value="growth">Croissance</option>
                <option value="roi">ROI</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-gold hover:bg-gold/90 text-midnight font-bold"
              >
                {editingId ? 'Modifier' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-midnight dark:text-white font-bold"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Objectives List */}
      <div className="grid gap-4">
        {objectives.map((obj) => (
          <div
            key={obj.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{priorityIcons[obj.priority]}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-midnight dark:text-white">{obj.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{obj.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[obj.status]}`}>
                    {obj.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 text-sm mb-4">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {new Date(obj.week_start).toLocaleDateString('fr-FR')} - {new Date(obj.week_end).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Target className="w-4 h-4" />
                    {obj.actual_value || 0} / {obj.target_value} {obj.unit}
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Progression</p>
                    <p className="text-xs font-bold text-gold">{obj.progress_percentage}%</p>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all"
                      style={{ width: `${Math.min(obj.progress_percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 sm:flex-col">
                <button
                  onClick={() => {
                    setEditingId(obj.id);
                    setFormData({
                      week_start: obj.week_start,
                      week_end: obj.week_end,
                      title: obj.title,
                      description: obj.description || '',
                      target_value: obj.target_value.toString(),
                      unit: obj.unit,
                      priority: obj.priority,
                      category: obj.category || 'content',
                    });
                    setShowForm(true);
                  }}
                  className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit className="w-5 h-5 text-blue-600" />
                </button>
                {!obj.validated_by_admin && (
                  <button
                    onClick={() => handleValidate(obj.id)}
                    className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors flex items-center gap-2"
                    title="Publier pour le client"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </button>
                )}
                {obj.validated_by_admin && (
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" title="Publié" />
                  </div>
                )}
                <button
                  onClick={() => handleDelete(obj.id)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {objectives.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">Aucun objectif créé. Commencez par en ajouter un.</p>
        </div>
      )}
    </div>
  );
};

export default AdminWeeklyObjectives;
