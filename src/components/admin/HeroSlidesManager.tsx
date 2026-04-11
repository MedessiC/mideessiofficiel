import { useState, useEffect } from 'react';
import { Save, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface HeroSlide {
  id: string;
  page: string;
  badge: string;
  title: string;
  description: string;
  subtitle: string;
  image: string;
  primary_cta_text: string;
  primary_cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

const HeroSlidesManager = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState('home');
  const [formData, setFormData] = useState({
    page: 'home',
    badge: '',
    title: '',
    description: '',
    subtitle: '',
    image: '',
    primary_cta_text: '',
    primary_cta_link: '',
    secondary_cta_text: '',
    secondary_cta_link: '',
    order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchSlides();
  }, [page]);

  const fetchSlides = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('page', page)
      .order('order', { ascending: true });

    if (!error && data) {
      setSlides(data);
      if (data.length > 0) {
        setSelectedSlide(data[0]);
        setFormData({
          page: data[0].page,
          badge: data[0].badge,
          title: data[0].title,
          description: data[0].description,
          subtitle: data[0].subtitle,
          image: data[0].image,
          primary_cta_text: data[0].primary_cta_text,
          primary_cta_link: data[0].primary_cta_link,
          secondary_cta_text: data[0].secondary_cta_text,
          secondary_cta_link: data[0].secondary_cta_link,
          order: data[0].order,
          is_active: data[0].is_active,
        });
      }
    }
    setLoading(false);
  };

  const handleSelectSlide = (slide: HeroSlide) => {
    setSelectedSlide(slide);
    setFormData({
      page: slide.page,
      badge: slide.badge,
      title: slide.title,
      description: slide.description,
      subtitle: slide.subtitle,
      image: slide.image,
      primary_cta_text: slide.primary_cta_text,
      primary_cta_link: slide.primary_cta_link,
      secondary_cta_text: slide.secondary_cta_text,
      secondary_cta_link: slide.secondary_cta_link,
      order: slide.order,
      is_active: slide.is_active,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!selectedSlide) return;

    setSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('hero_slides')
      .update(formData)
      .eq('id', selectedSlide.id);

    if (error) {
      setMessage(`❌ Erreur: ${error.message}`);
    } else {
      setMessage('✅ Slide mise à jour avec succès!');
      fetchSlides();
    }
    setSaving(false);
  };

  const handleCreate = async () => {
    setSaving(true);
    setMessage('');

    const maxOrder = slides.length > 0 ? Math.max(...slides.map(s => s.order)) + 1 : 0;

    const { error } = await supabase
      .from('hero_slides')
      .insert({
        page,
        badge: '',
        title: 'Nouveau slide',
        description: '',
        subtitle: '',
        image: '',
        primary_cta_text: '',
        primary_cta_link: '',
        secondary_cta_text: '',
        secondary_cta_link: '',
        order: maxOrder,
        is_active: true,
      });

    if (error) {
      setMessage(`❌ Erreur: ${error.message}`);
    } else {
      setMessage('✅ Nouveau slide créé!');
      fetchSlides();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce slide?')) return;

    setSaving(true);
    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage(`❌ Erreur: ${error.message}`);
    } else {
      setMessage('✅ Slide supprimé!');
      fetchSlides();
    }
    setSaving(false);
  };

  const handleReorder = async (slideId: string, direction: 'up' | 'down') => {
    const currentIndex = slides.findIndex(s => s.id === slideId);
    if (currentIndex === -1) return;

    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === slides.length - 1) return;

    const otherIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const currentSlide = slides[currentIndex];
    const otherSlide = slides[otherIndex];

    setSaving(true);
    const { error: error1 } = await supabase
      .from('hero_slides')
      .update({ order: otherSlide.order })
      .eq('id', currentSlide.id);

    const { error: error2 } = await supabase
      .from('hero_slides')
      .update({ order: currentSlide.order })
      .eq('id', otherSlide.id);

    if (!error1 && !error2) {
      fetchSlides();
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

      <div className="flex gap-4 items-center">
        <select
          value={page}
          onChange={(e) => setPage(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="home">Home</option>
          <option value="offres">Offres</option>
          <option value="about">About</option>
        </select>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter slide
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* List */}
        <div className="space-y-2">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Slides ({slides.length})</h3>
          {slides.map((slide, index) => (
            <div key={slide.id} className="space-y-1">
              <button
                onClick={() => handleSelectSlide(slide)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedSlide?.id === slide.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="font-semibold text-sm">{index + 1}. {slide.badge}</div>
                <div className="text-xs opacity-75 truncate">{slide.title}</div>
              </button>
              <div className="flex gap-1 px-1">
                <button
                  onClick={() => handleReorder(slide.id, 'up')}
                  disabled={index === 0}
                  className="flex-1 p-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-30 rounded transition-colors"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleReorder(slide.id, 'down')}
                  disabled={index === slides.length - 1}
                  className="flex-1 p-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-30 rounded transition-colors"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="flex-1 p-1 text-xs bg-red-200 dark:bg-red-900/30 hover:bg-red-300 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Éditer slide
          </h3>

          {selectedSlide && (
            <div className="space-y-4">
              {/* Badge */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Badge
                </label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 100% Béninois"
                />
              </div>

              {/* Title */}
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
                  placeholder="Titre principal"
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
                  placeholder="Description principale"
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
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Sous-titre secondaire"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  URL Image
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="https://example.com/hero1.webp"
                />
                {formData.image && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                    <img
                      src={formData.image}
                      alt="Aperçu"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 400 200"%3E%3Crect fill="%23f3f4f6" width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="14"%3EURL invalide%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Primary CTA */}
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">CTA Primaire (Bouton doré)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Texte CTA Primaire
                    </label>
                    <input
                      type="text"
                      name="primary_cta_text"
                      value={formData.primary_cta_text}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Découvrir"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Lien CTA Primaire
                    </label>
                    <input
                      type="text"
                      name="primary_cta_link"
                      value={formData.primary_cta_link}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="/offres"
                    />
                  </div>
                </div>
              </div>

              {/* Secondary CTA */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">CTA Secondaire (Bouton blanc) - Optionnel</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Texte CTA Secondaire
                    </label>
                    <input
                      type="text"
                      name="secondary_cta_text"
                      value={formData.secondary_cta_text}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: En savoir plus"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Lien CTA Secondaire
                    </label>
                    <input
                      type="text"
                      name="secondary_cta_link"
                      value={formData.secondary_cta_link}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="/about"
                    />
                  </div>
                </div>
              </div>

              {/* Active */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Actif
                </label>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSlidesManager;
