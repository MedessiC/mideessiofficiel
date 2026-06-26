import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useClientAuth } from '../../contexts/ClientContext';
import { Save, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
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
  const [showPasswords, setShowPasswords] = useState({ facebook: false, tiktok: false });

  useEffect(() => {
    if (user?.client_id) fetchClientInfo();
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
      }
    } catch (error) {
      console.error('Error fetching client info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ClientInfo, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTon = (ton: string) => {
    setFormData(prev => ({
      ...prev,
      ton_souhaite: prev.ton_souhaite.includes(ton)
        ? prev.ton_souhaite.filter(item => item !== ton)
        : [...prev.ton_souhaite, ton],
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.client_id) return;
    setSaving(true);
    setMessage(null);

    try {
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
        modifie_le: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('client_infos')
        .upsert(dataToSave, { onConflict: 'client_id' });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Vos informations ont été sauvegardées avec succès.' });
    } catch (err) {
      console.error('Error saving client info:', err);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde. Veuillez réessayer.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--brand-gold)]/80">Profil marque</p>
            <h1 className="mt-2 text-2xl font-semibold text-[var(--brand-midnight)] sm:text-3xl">Informations clients</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Complétez les données de votre marque pour que l'équipe MIDEESSI puisse piloter votre stratégie premium.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Identifiant client</p>
            <p className="mt-3 text-xl font-semibold text-[var(--brand-midnight)]">{user?.client_id || '—'}</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`rounded-[28px] border px-5 py-4 ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          <div className="flex items-center gap-3">
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-[var(--brand-midnight)] mb-5">Marque & positionnement</h2>
            <div className="space-y-5">
              <label className="block text-sm font-semibold text-slate-900">Description de l'activité</label>
              <textarea
                value={formData.description_activite}
                onChange={(e) => handleChange('description_activite', e.target.value)}
                className="w-full min-h-[110px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
                placeholder="Présentez votre activité en quelques lignes"
              />

              <label className="block text-sm font-semibold text-slate-900">Produits/services phares</label>
              <textarea
                value={formData.produits_phares}
                onChange={(e) => handleChange('produits_phares', e.target.value)}
                className="w-full min-h-[90px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
                placeholder="Listez vos produits ou services clés"
              />

              <div>
                <label className="text-sm font-semibold text-slate-900">Couleurs de la marque</label>
                <input
                  value={formData.couleurs_marque}
                  onChange={(e) => handleChange('couleurs_marque', e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
                  placeholder="Par exemple : noir, or, ivoire"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-[var(--brand-midnight)] mb-5">Accès & réseaux</h2>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-900">Site web ou logo</label>
                <input
                  value={formData.lien_logo}
                  onChange={(e) => handleChange('lien_logo', e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
                  placeholder="URL du logo ou du site"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-900">Facebook</label>
                  <input
                    value={formData.lien_facebook}
                    onChange={(e) => handleChange('lien_facebook', e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
                    placeholder="Lien page Facebook"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-900">TikTok</label>
                  <input
                    value={formData.lien_tiktok}
                    onChange={(e) => handleChange('lien_tiktok', e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
                    placeholder="Lien page TikTok"
                  />
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-900">Identifiant Facebook</label>
                  <input
                    value={formData.acces_facebook_login}
                    onChange={(e) => handleChange('acces_facebook_login', e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
                    placeholder="Login Facebook"
                  />
                </div>
                <div className="relative">
                  <label className="text-sm font-semibold text-slate-900">Mot de passe Facebook</label>
                  <input
                    type={showPasswords.facebook ? 'text' : 'password'}
                    value={formData.acces_facebook_password}
                    onChange={(e) => handleChange('acces_facebook_password', e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
                    placeholder="Mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, facebook: !prev.facebook }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPasswords.facebook ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-900">Identifiant TikTok</label>
                  <input
                    value={formData.acces_tiktok_login}
                    onChange={(e) => handleChange('acces_tiktok_login', e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
                    placeholder="Login TikTok"
                  />
                </div>
                <div className="relative">
                  <label className="text-sm font-semibold text-slate-900">Mot de passe TikTok</label>
                  <input
                    type={showPasswords.tiktok ? 'text' : 'password'}
                    value={formData.acces_tiktok_password}
                    onChange={(e) => handleChange('acces_tiktok_password', e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
                    placeholder="Mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, tiktok: !prev.tiktok }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPasswords.tiktok ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200/80 bg-white/95 p-5 shadow-soft sm:p-6">
          <h2 className="text-xl font-semibold text-[var(--brand-midnight)] mb-5">Communication & urgences</h2>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-900">Ton de communication souhaité</label>
              <div className="mt-3 flex flex-wrap gap-3">
                {tonOptions.map((ton) => (
                  <button
                    key={ton}
                    type="button"
                    onClick={() => toggleTon(ton)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm ${
                      formData.ton_souhaite.includes(ton)
                        ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 text-[var(--brand-midnight)]'
                        : 'border-slate-300 bg-slate-50 text-slate-700'
                    }`}
                  >
                    {ton}
                  </button>
                ))}
              </div>
            </div>

            <label className="text-sm font-semibold text-slate-900">Promotions & événements clés</label>
            <textarea
              value={formData.promotions_evenements}
              onChange={(e) => handleChange('promotions_evenements', e.target.value)}
              className="w-full min-h-[90px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
              placeholder="Indiquez les campagnes ou temps forts à venir"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-900">Contact d'urgence</label>
                <input
                  value={formData.contact_urgence_nom}
                  onChange={(e) => handleChange('contact_urgence_nom', e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
                  placeholder="Nom du contact"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900">Téléphone</label>
                <input
                  value={formData.contact_urgence_tel}
                  onChange={(e) => handleChange('contact_urgence_tel', e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
                  placeholder="+221 77 123 45 67"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-[var(--brand-midnight)] transition hover:bg-[var(--brand-gold)]/90 disabled:opacity-60 sm:px-6 sm:py-3"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Enregistrement...' : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientInfoForm;
