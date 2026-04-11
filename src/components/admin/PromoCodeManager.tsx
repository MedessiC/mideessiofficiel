import { useState, useEffect } from 'react';
import { Save, Trash2, Plus, Copy, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  applicable_services: string[];
  max_uses: number | null;
  current_uses: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  notes: string;
  created_at: string;
}

const PromoCodeManager = () => {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [selectedCode, setSelectedCode] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount_percent: 0,
    applicable_services: [] as string[],
    max_uses: null as number | null,
    start_date: '',
    end_date: '',
    is_active: true,
    notes: '',
  });

  const services = [
    { id: 'vitrine', label: 'Site Vitrine' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'mobile', label: 'App Mobile' },
    { id: 'webapp', label: 'Web App Custom' },
    { id: 'presence', label: 'Présence Digitale' },
  ];

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCodes(data);
      if (data.length > 0) {
        handleSelectCode(data[0]);
      }
    }
    setLoading(false);
  };

  const handleSelectCode = (code: PromoCode) => {
    setSelectedCode(code);
    setFormData({
      code: code.code,
      discount_percent: code.discount_percent,
      applicable_services: code.applicable_services,
      max_uses: code.max_uses,
      start_date: code.start_date,
      end_date: code.end_date,
      is_active: code.is_active,
      notes: code.notes,
    });
  };

  const handleNewCode = () => {
    setSelectedCode(null);
    setFormData({
      code: '',
      discount_percent: 0,
      applicable_services: [],
      max_uses: null,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      is_active: true,
      notes: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData({
      ...formData,
      applicable_services: formData.applicable_services.includes(serviceId)
        ? formData.applicable_services.filter(s => s !== serviceId)
        : [...formData.applicable_services, serviceId],
    });
  };

  const handleSave = async () => {
    try {
      if (!formData.code) {
        setMessage('❌ Le code est obligatoire');
        return;
      }

      if (selectedCode) {
        const { error } = await supabase
          .from('promo_codes')
          .update(formData)
          .eq('id', selectedCode.id);

        if (error) throw error;
        setMessage('✅ Code promo mis à jour!');
      } else {
        const { error } = await supabase
          .from('promo_codes')
          .insert([{ ...formData, current_uses: 0 }]);

        if (error) throw error;
        setMessage('✅ Code promo créé!');
      }

      fetchCodes();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Erreur lors de la sauvegarde');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce code?')) return;

    const { error } = await supabase.from('promo_codes').delete().eq('id', id);

    if (!error) {
      setMessage('✅ Code supprimé');
      fetchCodes();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      <button
        onClick={handleNewCode}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
      >
        <Plus className="w-5 h-5" />
        Nouveau code
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Liste des codes */}
        <div className="space-y-2">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Codes ({codes.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {codes.map((code) => (
              <button
                key={code.id}
                onClick={() => handleSelectCode(code)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedCode?.id === code.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="font-bold text-sm">{code.code}</div>
                <div className="text-xs opacity-75">
                  {code.discount_percent}% • {code.is_active ? '🟢' : '🔴'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {selectedCode ? 'Éditer un code' : 'Créer un nouveau code'}
          </h3>

          <div className="space-y-4">
            {/* Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 uppercase"
                  placeholder="AVRIL25"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  % Réduction *
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

            {/* Services */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Services applicables
              </label>
              <div className="grid grid-cols-2 gap-3">
                {services.map((service) => (
                  <label key={service.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.applicable_services.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{service.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Utilisations */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nombre d'utilisations max (vide = illimité)
              </label>
              <input
                type="number"
                name="max_uses"
                value={formData.max_uses || ''}
                onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="100"
              />
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

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Notes (interne)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Raison du code, notes..."
              />
            </div>

            {/* Active */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Code actif maintenant
              </span>
            </label>
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
            {selectedCode && (
              <>
                <button
                  onClick={() => copyToClipboard(selectedCode.code)}
                  title="Copier le code"
                  className="flex items-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => handleDelete(selectedCode.id)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoCodeManager;
