import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Plus, Edit, Trash2, Eye, Download, Globe } from 'lucide-react';

interface ClientReport {
  id: string;
  client_id: string;
  period_month: string;
  title: string;
  description: string;
  metrics_data: {
    [key: string]: any;
  };
  is_published: boolean;
  created_at: string;
}

interface AdminReportsEditorProps {
  clientId: string;
}

const AdminReportsEditor = ({ clientId }: AdminReportsEditorProps) => {
  const [reports, setReports] = useState<ClientReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [metricFields, setMetricFields] = useState<{ key: string; value: string }[]>([]);

  const [formData, setFormData] = useState({
    period_month: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    is_published: false,
  });

  useEffect(() => {
    fetchReports();
  }, [clientId]);

  const fetchReports = async () => {
    try {
      const { data } = await supabase
        .from('client_reports')
        .select('*')
        .eq('client_id', clientId)
        .order('period_month', { ascending: false });

      if (data) {
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des rapports' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMetricField = () => {
    setMetricFields([...metricFields, { key: '', value: '' }]);
  };

  const handleRemoveMetricField = (index: number) => {
    setMetricFields(metricFields.filter((_, i) => i !== index));
  };

  const handleMetricChange = (index: number, type: 'key' | 'value', val: string) => {
    const updated = [...metricFields];
    updated[index] = { ...updated[index], [type]: val };
    setMetricFields(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const metricsData = metricFields.reduce((acc, field) => {
        if (field.key) {
          acc[field.key] = field.value;
        }
        return acc;
      }, {} as { [key: string]: any });

      if (editingId) {
        const { error } = await supabase
          .from('client_reports')
          .update({
            ...formData,
            metrics_data: metricsData,
          })
          .eq('id', editingId);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Rapport modifié avec succès' });
      } else {
        const { error } = await supabase
          .from('client_reports')
          .insert({
            client_id: clientId,
            ...formData,
            metrics_data: metricsData,
          });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Rapport créé avec succès' });
      }

      await fetchReports();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        period_month: new Date().toISOString().split('T')[0],
        title: '',
        description: '',
        is_published: false,
      });
      setMetricFields([]);
    } catch (error) {
      console.error('Error saving report:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('client_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Rapport supprimé' });
      await fetchReports();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    }
  };

  const handlePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('client_reports')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setMessage({
        type: 'success',
        text: !currentStatus ? 'Rapport publié' : 'Rapport dépublié',
      });
      await fetchReports();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    }
  };

  const handleEdit = (report: ClientReport) => {
    setEditingId(report.id);
    setFormData({
      period_month: report.period_month,
      title: report.title,
      description: report.description,
      is_published: report.is_published,
    });
    setMetricFields(
      Object.entries(report.metrics_data || {}).map(([key, value]) => ({
        key,
        value: String(value),
      }))
    );
    setShowForm(true);
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
          <FileText className="w-6 h-6" />
          Rapports de suivi
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              period_month: new Date().toISOString().split('T')[0],
              title: '',
              description: '',
              is_published: false,
            });
            setMetricFields([]);
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
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-bold text-midnight dark:text-white">
            {editingId ? 'Modifier le rapport' : 'Créer un nouveau rapport'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mois de la période
                </label>
                <input
                  type="month"
                  value={formData.period_month.substring(0, 7)}
                  onChange={(e) => setFormData({
                    ...formData,
                    period_month: e.target.value + '-01'
                  })}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Titre du rapport
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white"
              ></textarea>
            </div>

            {/* Metrics Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                  Métriques de performance
                </label>
                <button
                  type="button"
                  onClick={handleAddMetricField}
                  className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
                >
                  + Ajouter métrique
                </button>
              </div>

              <div className="space-y-2">
                {metricFields.map((field, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nom de la métrique (ex: Publications)"
                      value={field.key}
                      onChange={(e) => handleMetricChange(index, 'key', e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Valeur (ex: 125)"
                      value={field.value}
                      onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMetricField(index)}
                      className="px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <input
                type="checkbox"
                id="publish"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="publish" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Publier ce rapport (visible pour le client)
              </label>
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

      {/* Reports List */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-5 h-5 text-gold" />
                  <h3 className="text-lg font-bold text-midnight dark:text-white">{report.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(report.period_month).toLocaleDateString('fr-FR', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              {report.is_published && (
                <span className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold">
                  <Globe className="w-3 h-3" />
                  Publié
                </span>
              )}
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">{report.description}</p>

            {/* Metrics Display */}
            {report.metrics_data && Object.keys(report.metrics_data).length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Métriques</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(report.metrics_data).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <p className="text-gray-600 dark:text-gray-400">{key}</p>
                      <p className="font-bold text-gold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleEdit(report)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 font-semibold text-sm"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => handlePublish(report.id, report.is_published)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm ${
                  report.is_published
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                }`}
              >
                {report.is_published ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Dépublier
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    Publier
                  </>
                )}
              </button>
              <button
                onClick={() => handleDelete(report.id)}
                className="px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">Aucun rapport créé. Commencez par en ajouter un.</p>
        </div>
      )}
    </div>
  );
};

export default AdminReportsEditor;
