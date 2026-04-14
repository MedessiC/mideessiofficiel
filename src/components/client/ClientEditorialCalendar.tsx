import { useEffect, useState } from 'react';
import { useClientAuth } from '../../contexts/ClientContext';
import { supabase } from '../../lib/supabase';
import { Calendar, Facebook, Music } from 'lucide-react';

interface EditorialItem {
  id: string;
  date_publication: string;
  plateforme: 'facebook' | 'tiktok';
  theme: string;
  statut: 'planifie' | 'publie' | 'en_attente_validation';
}

const ClientEditorialCalendar = () => {
  const { user } = useClientAuth();
  const [items, setItems] = useState<EditorialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchEditorialCalendar();
  }, [user?.client_id, currentMonth]);

  const fetchEditorialCalendar = async () => {
    try {
      if (!user?.client_id) return;

      const { data } = await supabase
        .from('calendrier_editorial')
        .select('*')
        .eq('client_id', user.client_id)
        .order('date_publication', { ascending: true });

      if (data) {
        // Filter for current month
        const filtered = data.filter(item => {
          const itemDate = new Date(item.date_publication);
          return (
            itemDate.getMonth() === currentMonth.getMonth() &&
            itemDate.getFullYear() === currentMonth.getFullYear()
          );
        });
        setItems(filtered);
      }
    } catch (error) {
      console.error('Error fetching editorial calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const platformColors = {
    facebook: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    tiktok: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  };

  const statusColors = {
    planifie: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    publie: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    en_attente_validation: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>;
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

      {/* Calendar Table */}
      {items.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Aucun contenu planifié pour {monthName}.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-midnight dark:text-white">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-midnight dark:text-white">Plateforme</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-midnight dark:text-white">Thème</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-midnight dark:text-white">Statut</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-midnight dark:text-white">
                        {new Date(item.date_publication).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${platformColors[item.plateforme]}`}>
                        {item.plateforme === 'facebook' ? (
                          <Facebook className="w-4 h-4" />
                        ) : (
                          <Music className="w-4 h-4" />
                        )}
                        {item.plateforme.charAt(0).toUpperCase() + item.plateforme.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-midnight dark:text-white truncate">{item.theme}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[item.statut]}`}>
                        {item.statut === 'planifie' && '📅 Planifié'}
                        {item.statut === 'publie' && '✓ Publié'}
                        {item.statut === 'en_attente_validation' && '⏳ En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">Légende des statuts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded text-xs font-semibold">Planifié</span>
            <span className="text-gray-600 dark:text-gray-400">Contenu à venir</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded text-xs font-semibold">En attente</span>
            <span className="text-gray-600 dark:text-gray-400">Validation en cours</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded text-xs font-semibold">Publié</span>
            <span className="text-gray-600 dark:text-gray-400">En ligne</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientEditorialCalendar;
