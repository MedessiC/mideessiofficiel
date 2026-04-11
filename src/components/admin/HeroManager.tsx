import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface HeroSection {
  id: string;
  page: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  is_active: boolean;
  updated_at: string;
}

const HeroManager = () => {
  const [heroes, setHeroes] = useState<HeroSection[]>([]);
  const [selectedHero, setSelectedHero] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    page: '',
    title: '',
    subtitle: '',
    cta_text: '',
    cta_link: '',
    image_url: '',
  });

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('hero_sections')
      .select('*')
      .order('page');

    if (!error && data) {
      setHeroes(data);
      if (data.length > 0) {
        setSelectedHero(data[0]);
        setFormData({
          page: data[0].page,
          title: data[0].title,
          subtitle: data[0].subtitle,
          cta_text: data[0].cta_text,
          cta_link: data[0].cta_link,
          image_url: data[0].image_url,
        });
      }
    }
    setLoading(false);
  };

  const handleSelectHero = (hero: HeroSection) => {
    setSelectedHero(hero);
    setFormData({
      page: hero.page,
      title: hero.title,
      subtitle: hero.subtitle,
      cta_text: hero.cta_text,
      cta_link: hero.cta_link,
      image_url: hero.image_url,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, image_url: url });
  };

  const handleSave = async () => {
    if (!selectedHero) return;

    setSaving(true);
    const { error } = await supabase
      .from('hero_sections')
      .update({
        title: formData.title,
        subtitle: formData.subtitle,
        cta_text: formData.cta_text,
        cta_link: formData.cta_link,
        image_url: formData.image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedHero.id);

    if (!error) {
      setMessage('✅ Héro section mise à jour avec succès!');
      fetchHeroes();
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('❌ Erreur lors de la sauvegarde');
    }
    setSaving(false);
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
      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.startsWith('✅') 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Liste des héros */}
        <div className="space-y-2">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Pages</h3>
          {heroes.map((hero) => (
            <button
              key={hero.id}
              onClick={() => handleSelectHero(hero)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                selectedHero?.id === hero.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="font-semibold text-sm">{hero.page}</div>
              <div className="text-xs opacity-75 truncate">{hero.title}</div>
            </button>
          ))}
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Éditer: {selectedHero?.page}
          </h3>

          <div className="space-y-4">
            {/* Titre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Titre Principal
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Nos Offres"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Sous-titre
              </label>
              <textarea
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Description courte..."
              />
            </div>

            {/* CTA */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Texte CTA
                </label>
                <input
                  type="text"
                  name="cta_text"
                  value={formData.cta_text}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Découvrir"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Lien CTA
                </label>
                <input
                  type="text"
                  name="cta_link"
                  value={formData.cta_link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="/offres"
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                URL Image de fond
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Collé l'URL complète de l'image (Imgur, CDN, etc.)
                </p>
                {formData.image_url && (
                  <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                    <img
                      src={formData.image_url}
                      alt="Aperçu"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 400 200"%3E%3Crect fill="%23f3f4f6" width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="14"%3EURL invalide%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bouton Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Sauvegarder les modifications
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroManager;
