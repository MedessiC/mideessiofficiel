import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface CalendarEntry {
  id: string;
  client_id: string;
  date: string;
  titre: string;
  description: string;
  categorie: 'publication' | 'livraison' | 'reunion' | 'autre';
  statut: 'planifie' | 'en_cours' | 'termine' | 'annule';
}

interface AdminEditorialCalendarProps {
  clientId: string;
}

const AdminEditorialCalendar = ({ clientId }: AdminEditorialCalendarProps) => {
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date: '',
    categorie: 'publication' as const,
    statut: 'planifie' as const,
  });

  useEffect(() => {
    fetchEntries();
  }, [clientId]);

  const fetchEntries = async () => {
    try {
      const { data } = await supabase
        .from('calendrier_editorial')
        .select('*')
        .eq('client_id', clientId)
        .order('date', { ascending: true });

      if (data) {
        setEntries(data);
      }
    } catch (error) {
      console.error('Error fetching calendar entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('calendrier_editorial')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('calendrier_editorial')
          .insert({
            client_id: clientId,
            ...formData,
          });

        if (error) throw error;
      }

      // Reset form
      setFormData({
        titre: '',
        description: '',
        date: '',
        categorie: 'publication',
        statut: 'planifie',
      });
      setEditingId(null);
      setShowForm(false);
      fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleEdit = (entry: CalendarEntry) => {
    setFormData({
      titre: entry.titre,
      description: entry.description,
      date: entry.date,
      categorie: entry.categorie,
      statut: entry.statut,
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('calendrier_editorial')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const categoryColors = {
    publication: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    livraison: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    reunion: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    autre: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400',
  };

  const statusColors = {
    planifie: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400',
    en_cours: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    termine: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    annule: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <button
        onClick={() => {
          setFormData({
            titre: '',
            description: '',
            date: '',
            categorie: 'publication',
            statut: 'planifie',
          });
          setEditingId(null);
          setShowForm(true);
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-yellow-400 text-midnight font-semibold hover:shadow-lg transition-shadow"
      >
        <Plus className="w-5 h-5" />
        Ajouter une entrée
      </button>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gold/10 to-yellow-100/10 dark:from-gold/5 dark:to-yellow-100/5 rounded-lg p-6 border-2 border-gold/30 dark:border-gold/20"
        >
          <h3 className="text-xl font-bold text-midnight dark:text-white mb-4">
            {editingId ? 'Modifier l\'entrée' : 'Nouvelle entrée'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Titre"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gold/30 bg-white dark:bg-gray-800 text-midnight dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gold"
              required
            />

            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gold/30 bg-white dark:bg-gray-800 text-midnight dark:text-white focus:outline-none focus:border-gold"
              required
            />

            <select
              value={formData.categorie}
              onChange={(e) => setFormData({ ...formData, categorie: e.target.value as any })}
              className="px-4 py-2 rounded-lg border border-gold/30 bg-white dark:bg-gray-800 text-midnight dark:text-white focus:outline-none focus:border-gold"
            >
              <option value="publication">Publication</option>
              <option value="livraison">Livraison</option>
              <option value="reunion">Réunion</option>
              <option value="autre">Autre</option>
            </select>

            <select
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
              className="px-4 py-2 rounded-lg border border-gold/30 bg-white dark:bg-gray-800 text-midnight dark:text-white focus:outline-none focus:border-gold"
            >
              <option value="planifie">Planifié</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
              <option value="annule">Annulé</option>
            </select>
          </div>

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full mt-4 px-4 py-2 rounded-lg border border-gold/30 bg-white dark:bg-gray-800 text-midnight dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gold"
            rows={3}
          />

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-yellow-400 text-midnight font-semibold hover:shadow-lg transition-shadow"
            >
              {editingId ? 'Mettre à jour' : 'Créer'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-midnight dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Entries List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold mx-auto"></div>
          </div>
        ) : entries.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 py-8">
            Aucune entrée pour ce client
          </p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-midnight dark:text-white text-lg">
                      {entry.titre}
                    </h4>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${categoryColors[entry.categorie]}`}>
                      {entry.categorie === 'publication' && 'Publication'}
                      {entry.categorie === 'livraison' && 'Livraison'}
                      {entry.categorie === 'reunion' && 'Réunion'}
                      {entry.categorie === 'autre' && 'Autre'}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColors[entry.statut]}`}>
                      {entry.statut === 'planifie' && 'Planifié'}
                      {entry.statut === 'en_cours' && 'En cours'}
                      {entry.statut === 'termine' && 'Terminé'}
                      {entry.statut === 'annule' && 'Annulé'}
                    </span>
                  </div>

                  {entry.description && (
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{entry.description}</p>
                  )}

                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                    📅 {new Date(entry.date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminEditorialCalendar;
