import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Zap, TrendingUp } from 'lucide-react';

interface GlobalObjective {
  id: string;
  client_id: string;
  service_start_date: string;
  service_end_date: string;
  title: string;
  description: string;
  target_value: number;
  unit: string;
  current_value: number;
  progress_percentage: number;
  category: string;
  status: 'active' | 'completed' | 'on_hold';
  created_at: string;
  updated_at: string;
}

interface AdminGlobalObjectivesProps {
  clientId: string;
}

const AdminGlobalObjectives = ({ clientId }: AdminGlobalObjectivesProps) => {
  const [objectives, setObjectives] = useState<GlobalObjective[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    service_start_date: '',
    service_end_date: '',
    title: '',
    description: '',
    target_value: '',
    unit: 'followers',
    category: 'growth',
    status: 'active',
  });

  useEffect(() => {
    fetchObjectives();
  }, [clientId]);

  const fetchObjectives = async () => {
    try {
      const { data } = await supabase
        .from('global_objectives')
        .select('*')
        .eq('client_id', clientId)
        .order('service_start_date', { ascending: false });

      if (data) {
        setObjectives(data);
      }
    } catch (error) {
      console.error('Error fetching objectives:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('global_objectives')
          .update({
            ...formData,
            target_value: parseInt(formData.target_value),
          })
          .eq('id', editingId);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Objectif global modifié' });
      } else {
        const { error } = await supabase
          .from('global_objectives')
          .insert({
            client_id: clientId,
            ...formData,
            target_value: parseInt(formData.target_value),
            current_value: 0,
          });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Objectif global créé' });
      }

      await fetchObjectives();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        service_start_date: '',
        service_end_date: '',
        title: '',
        description: '',
        target_value: '',
        unit: 'followers',
        category: 'growth',
        status: 'active',
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('global_objectives')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Objectif supprimé' });
      await fetchObjectives();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    }
  };

  const handleUpdateProgress = async (id: string, newValue: string) => {
    try {
      const value = parseInt(newValue);
      const objective = objectives.find(o => o.id === id);
      if (!objective) return;

      const progress = Math.round((value / objective.target_value) * 100);

      const { error } = await supabase
        .from('global_objectives')
        .update({
          current_value: value,
          progress_percentage: Math.min(progress, 100),
        })
        .eq('id', id);

      if (error) throw error;
      await fetchObjectives();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    }
  };

  const statusColors = {
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    on_hold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
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
          <Zap className="w-6 h-6" />
          Objectifs globaux (Contrat)
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

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <h3 className="text-xl font-bold text-midnight dark:text-white mb-4">
            {editingId ? 'Modifier l\'objectif' : 'Créer un nouvel objectif'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  value={formData.service_start_date}
                  onChange={(e) => setFormData({ ...formData, service_start_date: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-midnight dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={formData.service_end_date}
                  onChange={(e) => setFormData({ ...formData, service_end_date: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-midnight dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-midnight dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-midnight dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cible
                </label>
                <input
                  type="number"
                  value={formData.target_value}
                  onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-midnight dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Unité
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-midnight dark:text-white"
                >
                  <option value="followers">Followers</option>
                  <option value="publications">Publications</option>
                  <option value="engagement">Engagement</option>
                  <option value="revenue">Revenu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-midnight dark:text-white"
                >
                  <option value="growth">Croissance</option>
                  <option value="engagement">Engagement</option>
                  <option value="roi">ROI</option>
                  <option value="other">Autre</option>
                </select>
              </div>
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
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-midnight dark:text-white font-bold"
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
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-midnight dark:text-white">{obj.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[obj.status]}`}>
                    {obj.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{obj.description}</p>

                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <p>📅 {new Date(obj.service_start_date).toLocaleDateString('fr-FR')} → {new Date(obj.service_end_date).toLocaleDateString('fr-FR')}</p>
                  <p className="mt-1">📊 {obj.current_value} / {obj.target_value} {obj.unit}</p>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Progression</p>
                    <p className="text-xs font-bold text-gold">{obj.progress_percentage}%</p>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all"
                      style={{ width: `${Math.min(obj.progress_percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Update Value & Actions */}
              <div className="flex flex-col gap-2 min-w-fit">
                <div className="flex gap-2">
                  <input
                    type="number"
                    defaultValue={obj.current_value}
                    onBlur={(e) => handleUpdateProgress(obj.id, e.target.value)}
                    className="w-20 px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white text-sm"
                  />
                  <button
                    onClick={() => {
                      setEditingId(obj.id);
                      setFormData({
                        service_start_date: obj.service_start_date,
                        service_end_date: obj.service_end_date,
                        title: obj.title,
                        description: obj.description || '',
                        target_value: obj.target_value.toString(),
                        unit: obj.unit,
                        category: obj.category || 'growth',
                        status: obj.status,
                      });
                      setShowForm(true);
                    }}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(obj.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {objectives.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">Aucun objectif global. Créez-en un pour ce client.</p>
        </div>
      )}
    </div>
  );
};

export default AdminGlobalObjectives;
