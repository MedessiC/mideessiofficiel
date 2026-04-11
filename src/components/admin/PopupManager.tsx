import { useState, useEffect } from 'react';
import { Save, Trash2, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Popup {
  id: string;
  title: string;
  description: string;
  type: 'modal' | 'slide-in' | 'banner';
  trigger: 'page_load' | 'exit_intent' | 'scroll' | 'time_delay';
  pages: string[];
  image_url: string;
  promo_code: string;
  discount_percent: number;
  cta_link: string;
  cta_text: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

const PopupManager = () => {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [selectedPopup, setSelectedPopup] = useState<Popup | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'modal' as 'modal' | 'slide-in' | 'banner',
    trigger: 'page_load' as 'page_load' | 'exit_intent' | 'scroll' | 'time_delay',
    pages: ['home', 'offres'] as string[],
    image_url: '',
    promo_code: '',
    discount_percent: 0,
    cta_link: '',
    cta_text: 'Je profite de cette offre',
    start_date: '',
    end_date: '',
    is_active: true,
  });

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('popups')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPopups(data);
      if (data.length > 0) {
        handleSelectPopup(data[0]);
      }
    }
    setLoading(false);
  };

  const handleSelectPopup = (popup: Popup) => {
    setSelectedPopup(popup);
    setFormData({
      title: popup.title,
      description: popup.description,
      type: popup.type,
      trigger: popup.trigger,
      pages: popup.pages || ['home', 'offres'],
      image_url: popup.image_url || '',
      promo_code: popup.promo_code,
      discount_percent: popup.discount_percent,
      cta_link: popup.cta_link || '',
      cta_text: popup.cta_text || 'Je profite de cette offre',
      start_date: popup.start_date,
      end_date: popup.end_date,
      is_active: popup.is_active,
    });
  };

  const handleNewPopup = () => {
    setSelectedPopup(null);
    setFormData({
      title: '',
      description: '',
      type: 'modal',
      trigger: 'page_load',
      pages: ['home', 'offres'],
      image_url: '',
      promo_code: '',
      discount_percent: 0,
      cta_link: '',
      cta_text: 'Je profite de cette offre',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      is_active: true,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (selectedPopup) {
        // Update
        const { error } = await supabase
          .from('popups')
          .update(formData)
          .eq('id', selectedPopup.id);

        if (error) throw error;
        setMessage('✅ Pop-up mise à jour!');
      } else {
        // Create
        const { error } = await supabase
          .from('popups')
          .insert([formData]);

        if (error) throw error;
        setMessage('✅ Pop-up créée!');
      }

      fetchPopups();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Erreur lors de la sauvegarde');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette pop-up?')) return;

    const { error } = await supabase.from('popups').delete().eq('id', id);

    if (!error) {
      setMessage('✅ Pop-up supprimée');
      fetchPopups();
    } else {
      setMessage('❌ Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${
          message.startsWith('✅') 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        }`}>
          {message}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleNewPopup}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle pop-up
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Liste */}
        <div className="space-y-2">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Pop-ups ({popups.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {popups.map((popup) => (
              <button
                key={popup.id}
                onClick={() => handleSelectPopup(popup)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedPopup?.id === popup.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="font-semibold text-sm line-clamp-1">{popup.title}</div>
                <div className="text-xs opacity-75">
                  {popup.discount_percent}% - {popup.is_active ? '🟢' : '🔴'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {selectedPopup ? 'Éditer la pop-up' : 'Créer une nouvelle pop-up'}
          </h3>

          <div className="space-y-4">
            {/* Titre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Titre
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Offre Flash 25%"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Texte affiché dans la pop-up..."
              />
            </div>

            {/* Type & Trigger */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="modal">Modal</option>
                  <option value="slide-in">Slide-in</option>
                  <option value="banner">Bannière</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Afficher quand
                </label>
                <select
                  name="trigger"
                  value={formData.trigger}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="page_load">Page charge</option>
                  <option value="exit_intent">Sortie (exit intent)</option>
                  <option value="scroll">Scroll 40%</option>
                  <option value="time_delay">Délai 10sec</option>
                </select>
              </div>
            </div>

            {/* Pages */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Pages où afficher cette pop-up
              </label>
              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                {['home', 'offres', 'learn', 'about', 'blog', 'contact'].map((page) => (
                  <label key={page} className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={(formData.pages as string[]).includes(page)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            pages: [...(formData.pages as string[]), page],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            pages: (formData.pages as string[]).filter((p) => p !== page),
                          });
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm capitalize">{page}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Image (URL) - Optionnel
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image_url && (
                <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="h-24 object-contain rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/%3E%3C/svg%3E';
                    }}
                  />
                </div>
              )}
            </div>

            {/* CTA Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Texte du bouton CTA
                </label>
                <input
                  type="text"
                  name="cta_text"
                  value={formData.cta_text}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Je profite de cette offre"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Lien du bouton CTA
                </label>
                <input
                  type="url"
                  name="cta_link"
                  value={formData.cta_link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="/offres ou https://example.com"
                />
              </div>
            </div>

            {/* Promo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Code promo
                </label>
                <input
                  type="text"
                  name="promo_code"
                  value={formData.promo_code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="AVRIL25"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  % Réduction
                </label>
                <input
                  type="number"
                  name="discount_percent"
                  value={formData.discount_percent}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="25"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Début
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Fin
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Active */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Pop-up active maintenant
              </label>
            </div>
          </div>

          {/* Boutons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              <Save className="w-5 h-5" />
              Sauvegarder
            </button>
            {selectedPopup && (
              <button
                onClick={() => handleDelete(selectedPopup.id)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupManager;
