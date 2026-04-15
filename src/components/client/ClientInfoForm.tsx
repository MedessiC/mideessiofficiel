import { useEffect, useState } from 'react';
import { useClientAuth } from '../../contexts/ClientContext';
import { supabase } from '../../lib/supabase';
import { Save, AlertCircle, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { encryptCredential } from '../../utils/encryptionUtils';

interface ClientInfo {
  description_activite: string;
  produits_phares: string;
  couleurs_marque: string;
  lien_logo: string;
  ton_souhaite: string[];
  lien_facebook: string;
  lien_tiktok: string;
  acces_facebook_login: string;
  acces_facebook_password: string;
  acces_tiktok_login: string;
  acces_tiktok_password: string;
  promotions_evenements: string;
  contact_urgence_nom: string;
  contact_urgence_tel: string;
}

const tonOptions = ['Luxe', 'Accessible', 'Familial', 'Professionnel'];

const ClientInfoForm = () => {
  const { user } = useClientAuth();
  const [formData, setFormData] = useState<ClientInfo>({
    description_activite: '',
    produits_phares: '',
    couleurs_marque: '',
    lien_logo: '',
    ton_souhaite: [],
    lien_facebook: '',
    lien_tiktok: '',
    acces_facebook_login: '',
    acces_facebook_password: '',
    acces_tiktok_login: '',
    acces_tiktok_password: '',
    promotions_evenements: '',
    contact_urgence_nom: '',
    contact_urgence_tel: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    facebook: false,
    tiktok: false,
  });

  useEffect(() => {
    fetchClientInfo();
  }, [user?.client_id]);

  const fetchClientInfo = async () => {
    try {
      if (!user?.client_id) return;

      const { data } = await supabase
        .from('client_infos')
        .select('*')
        .eq('client_id', user.client_id)
        .single();

      if (data) {
        setFormData({
          description_activite: data.description_activite || '',
          produits_phares: data.produits_phares || '',
          couleurs_marque: data.couleurs_marque || '',
          lien_logo: data.lien_logo || '',
          ton_souhaite: data.ton_souhaite || [],
          lien_facebook: data.lien_facebook || '',
          lien_tiktok: data.lien_tiktok || '',
          acces_facebook_login: data.acces_facebook_login || '',
          acces_facebook_password: data.acces_facebook_password || '',
          acces_tiktok_login: data.acces_tiktok_login || '',
          acces_tiktok_password: data.acces_tiktok_password || '',
          promotions_evenements: data.promotions_evenements || '',
          contact_urgence_nom: data.contact_urgence_nom || '',
          contact_urgence_tel: data.contact_urgence_tel || '',
        });
        setIsSubmitted(!!data.soumis_le);
      }
    } catch (error) {
      console.error('Error fetching client info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ClientInfo, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleTonSouhaite = (ton: string) => {
    setFormData(prev => ({
      ...prev,
      ton_souhaite: prev.ton_souhaite.includes(ton)
        ? prev.ton_souhaite.filter(t => t !== ton)
        : [...prev.ton_souhaite, ton],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (!user?.client_id) return;

      // Encrypt sensitive data
      const encryptedFbPass = formData.acces_facebook_password
        ? encryptCredential(formData.acces_facebook_password)
        : null;
      const encryptedTkPass = formData.acces_tiktok_password
        ? encryptCredential(formData.acces_tiktok_password)
        : null;

      const dataToSave = {
        client_id: user.client_id,
        description_activite: formData.description_activite,
        produits_phares: formData.produits_phares,
        couleurs_marque: formData.couleurs_marque,
        lien_logo: formData.lien_logo,
        ton_souhaite: formData.ton_souhaite,
        lien_facebook: formData.lien_facebook,
        lien_tiktok: formData.lien_tiktok,
        acces_facebook_login: formData.acces_facebook_login,
        acces_facebook_password: encryptedFbPass || formData.acces_facebook_password,
        acces_tiktok_login: formData.acces_tiktok_login,
        acces_tiktok_password: encryptedTkPass || formData.acces_tiktok_password,
        promotions_evenements: formData.promotions_evenements,
        contact_urgence_nom: formData.contact_urgence_nom,
        contact_urgence_tel: formData.contact_urgence_tel,
        soumis_le: new Date().toISOString(),
        modifie_le: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('client_infos')
        .upsert(dataToSave, { onConflict: 'client_id' });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Vos informations ont été sauvegardées avec succès!' });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error saving client info:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde. Veuillez réessayer.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Info Banner */}
      {isSubmitted && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-300">Formulaire soumis</p>
            <p className="text-sm text-green-700 dark:text-green-200">
              Vos informations ont été enregistrées. Vous pouvez les modifier à tout moment en complétant le formulaire ci-dessous.
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p className={message.type === 'success' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}>
            {message.text}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Business Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-midnight dark:text-white mb-6">À propos de votre activité</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                Description de l'activité
              </label>
              <textarea
                value={formData.description_activite}
                onChange={(e) => handleChange('description_activite', e.target.value)}
                disabled={isSubmitted}
                placeholder="Décrivez votre activité, votre mission..."
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                Produits/services phares
              </label>
              <textarea
                value={formData.produits_phares}
                onChange={(e) => handleChange('produits_phares', e.target.value)}
                disabled={isSubmitted}
                placeholder="Listez vos produits ou services principaux..."
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                  Couleurs de la marque
                </label>
                <input
                  type="text"
                  value={formData.couleurs_marque}
                  onChange={(e) => handleChange('couleurs_marque', e.target.value)}
                  disabled={isSubmitted}
                  placeholder="Ex: Or #FFD700, Noir #191970"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                  Lien du logo
                </label>
                <input
                  type="url"
                  value={formData.lien_logo}
                  onChange={(e) => handleChange('lien_logo', e.target.value)}
                  disabled={isSubmitted}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Ton souhaité */}
            <div>
              <label className="block text-sm font-semibold text-midnight dark:text-white mb-3">
                Ton souhaité pour votre contenu
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {tonOptions.map(ton => (
                  <label
                    key={ton}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      formData.ton_souhaite.includes(ton)
                        ? 'border-gold bg-gold/10 dark:bg-gold/5'
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30'
                    } ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.ton_souhaite.includes(ton)}
                      onChange={() => toggleTonSouhaite(ton)}
                      disabled={isSubmitted}
                      className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-2 focus:ring-gold"
                    />
                    <span className="font-medium text-midnight dark:text-white text-sm">{ton}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Social Media */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-midnight dark:text-white mb-6">Vos réseaux sociaux</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                  Lien page Facebook
                </label>
                <input
                  type="url"
                  value={formData.lien_facebook}
                  onChange={(e) => handleChange('lien_facebook', e.target.value)}
                  disabled={isSubmitted}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                  Lien compte TikTok
                </label>
                <input
                  type="url"
                  value={formData.lien_tiktok}
                  onChange={(e) => handleChange('lien_tiktok', e.target.value)}
                  disabled={isSubmitted}
                  placeholder="https://tiktok.com/..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Facebook Credentials */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-midnight dark:text-white">Accès Facebook</h3>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                ✓ Vos accès sont chiffrés et sécurisés. Seul notre équipe admin y accède.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                    Email du compte à gérer
                  </label>
                  <input
                    type="email"
                    value={formData.acces_facebook_login}
                    onChange={(e) => handleChange('acces_facebook_login', e.target.value)}
                    disabled={isSubmitted}
                    placeholder="email@facebook.com"
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.facebook ? 'text' : 'password'}
                      value={formData.acces_facebook_password}
                      onChange={(e) => handleChange('acces_facebook_password', e.target.value)}
                      disabled={isSubmitted}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(p => ({ ...p, facebook: !p.facebook }))}
                      disabled={isSubmitted}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      {showPasswords.facebook ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TikTok Credentials */}
            <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-midnight dark:text-white">Accès TikTok</h3>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                ✓ Vos accès sont chiffrés et sécurisés. Seul notre équipe admin y accède.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                    Email/utilisateur TikTok
                  </label>
                  <input
                    type="text"
                    value={formData.acces_tiktok_login}
                    onChange={(e) => handleChange('acces_tiktok_login', e.target.value)}
                    disabled={isSubmitted}
                    placeholder="utilisateur@tiktok.com"
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.tiktok ? 'text' : 'password'}
                      value={formData.acces_tiktok_password}
                      onChange={(e) => handleChange('acces_tiktok_password', e.target.value)}
                      disabled={isSubmitted}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(p => ({ ...p, tiktok: !p.tiktok }))}
                      disabled={isSubmitted}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      {showPasswords.tiktok ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Additional Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-midnight dark:text-white mb-6">Plus d'informations</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                Promotions et événements prévus ce mois
              </label>
              <textarea
                value={formData.promotions_evenements}
                onChange={(e) => handleChange('promotions_evenements', e.target.value)}
                disabled={isSubmitted}
                placeholder="Décrivez les promotions, soldes ou événements prévus..."
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                  Contact d'urgence - Nom
                </label>
                <input
                  type="text"
                  value={formData.contact_urgence_nom}
                  onChange={(e) => handleChange('contact_urgence_nom', e.target.value)}
                  disabled={isSubmitted}
                  placeholder="Nom complet"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                  Contact d'urgence - Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.contact_urgence_tel}
                  onChange={(e) => handleChange('contact_urgence_tel', e.target.value)}
                  disabled={isSubmitted}
                  placeholder="+229 XX XX XX XX"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        {!isSubmitted && (
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-gold to-yellow-400 hover:from-gold/90 hover:to-yellow-400/90 text-midnight font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Sauvegarde...' : 'Soumettre mes informations'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ClientInfoForm;
