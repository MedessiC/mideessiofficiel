import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Eye, Upload, Image as ImageIcon, AlertCircle, Check, Copy, Trash2 } from 'lucide-react';
import { supabase, BlogPost, BlogCategory } from '../lib/supabase';

const AdminPostEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id !== 'new';

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    author: '',
    category: '',
    tags: '',
    is_featured: false,
    is_published: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [slugTaken, setSlugTaken] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    checkAuth();
    fetchCategories();
    if (isEdit) fetchPost();
  }, []);

  useEffect(() => {
    // Calculer statistiques de contenu
    const words = formData.content.trim().split(/\s+/).filter(Boolean).length;
    const chars = formData.content.length;
    const time = Math.ceil(words / 200); // 200 mots par minute
    
    setWordCount(words);
    setCharCount(chars);
    setReadingTime(time);
  }, [formData.content]);

  useEffect(() => {
    // Vérifier si le slug est déjà pris
    const checkSlug = async () => {
      if (!formData.slug || (isEdit && formData.slug)) return;
      
      const { data } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', formData.slug)
        .maybeSingle();
      
      setSlugTaken(!!data);
    };

    const debounce = setTimeout(checkSlug, 500);
    return () => clearTimeout(debounce);
  }, [formData.slug]);

  useEffect(() => {
    // Prévisualiser l'image
    if (formData.image_url) {
      setImagePreview(formData.image_url);
    }
  }, [formData.image_url]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }

    const { data: adminData } = await supabase
      .from('admins')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (!adminData) {
      await supabase.auth.signOut();
      navigate('/admin/login');
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');

    if (data) setCategories(data);
  };

  const fetchPost = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data) {
      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image_url: data.image_url,
        author: data.author,
        category: data.category,
        tags: data.tags.join(', '),
        is_featured: data.is_featured,
        is_published: data.is_published,
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !isEdit ? { slug: generateSlug(value) } : {}),
    }));
  };

  const copySlug = () => {
    navigator.clipboard.writeText(formData.slug);
    setSuccess('Slug copié !');
    setTimeout(() => setSuccess(''), 2000);
  };

  const insertImageUrl = () => {
    const url = prompt('Entrez l\'URL de l\'image à insérer:');
    if (url) {
      const markdown = `\n\n![Description de l'image](${url})\n\n`;
      setFormData(prev => ({
        ...prev,
        content: prev.content + markdown
      }));
    }
  };

  const formatText = (format: string) => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    let formatted = '';
    switch (format) {
      case 'bold':
        formatted = `**${selectedText}**`;
        break;
      case 'italic':
        formatted = `*${selectedText}*`;
        break;
      case 'heading':
        formatted = `\n## ${selectedText}\n`;
        break;
      case 'list':
        formatted = `\n- ${selectedText}\n`;
        break;
      case 'link':
        const url = prompt('URL du lien:');
        formatted = `[${selectedText}](${url || '#'})`;
        break;
    }

    const newContent = 
      formData.content.substring(0, start) + 
      formatted + 
      formData.content.substring(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (slugTaken && !isEdit) {
        throw new Error('Ce slug est déjà utilisé. Veuillez en choisir un autre.');
      }

      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        image_url: formData.image_url,
        author: formData.author,
        category: formData.category,
        tags,
        is_featured: formData.is_featured,
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
      };

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);

        if (updateError) throw updateError;
        setSuccess('Article mis à jour avec succès !');
      } else {
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (insertError) throw insertError;
        setSuccess('Article créé avec succès !');
      }

      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-corporate-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au tableau de bord
          </button>

          {isEdit && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-corporate-200 dark:border-gray-700 p-8">
              <h1 className="text-3xl font-bold text-midnight dark:text-white mb-6">
                {isEdit ? 'Modifier l\'article' : 'Nouvel article'}
              </h1>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-semibold text-corporate-700 dark:text-corporate-200 mb-2">
                    Titre de l'article *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-corporate-50 dark:bg-gray-700 border border-corporate-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white text-lg font-semibold"
                    placeholder="Ex: L'avenir de l'IA en Afrique"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-semibold text-corporate-700 dark:text-corporate-200 mb-2">
                    Slug (URL) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      required
                      className={`flex-1 px-4 py-3 bg-corporate-50 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white font-mono text-sm ${
                        slugTaken ? 'border-red-500' : 'border-corporate-200 dark:border-gray-600'
                      }`}
                      placeholder="avenir-ia-afrique"
                    />
                    <button
                      type="button"
                      onClick={copySlug}
                      className="px-4 py-3 bg-corporate-200 dark:bg-corporate-800 hover:bg-corporate-300 dark:hover:bg-corporate-700 rounded-lg transition-colors"
                      title="Copier le slug"
                    >
                      <Copy className="w-5 h-5 text-corporate-700 dark:text-corporate-200" />
                    </button>
                  </div>
                  {slugTaken && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      ⚠️ Ce slug est déjà utilisé
                    </p>
                  )}
                  <p className="mt-1 text-xs text-corporate-500 dark:text-corporate-400">
                    L'URL de l'article sera: /blog/{formData.slug || 'slug-de-larticle'}
                  </p>
                </div>

                {/* Auteur et Catégorie */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-corporate-700 dark:text-corporate-200 mb-2">
                      Auteur *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-corporate-50 dark:bg-gray-700 border border-corporate-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white"
                      placeholder="Medessi Coovi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-corporate-700 dark:text-corporate-200 mb-2">
                      Catégorie *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-corporate-50 dark:bg-gray-700 border border-corporate-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-semibold text-corporate-700 dark:text-corporate-200 mb-2">
                    URL de l'image *
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-corporate-50 dark:bg-gray-700 border border-corporate-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white"
                    placeholder="https://images.pexels.com/..."
                  />
                  {imagePreview && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-corporate-200 dark:border-gray-600">
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        className="w-full h-48 object-cover"
                        onError={() => setImagePreview('')}
                      />
                    </div>
                  )}
                  <p className="mt-2 text-xs text-corporate-500 dark:text-corporate-400">
                    💡 Recommandations: Pexels, Unsplash - Format 1200x800px
                  </p>
                </div>

                {/* Extrait */}
                <div>
                  <label className="block text-sm font-semibold text-corporate-700 dark:text-corporate-200 mb-2">
                    Extrait (résumé) * <span className="text-xs font-normal">({formData.excerpt.length}/200)</span>
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    rows={3}
                    className="w-full px-4 py-3 bg-corporate-50 dark:bg-gray-700 border border-corporate-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white"
                    placeholder="Un court résumé de l'article (150-200 caractères)"
                  />
                </div>

                {/* Barre d'outils Markdown */}
                <div>
                  <label className="block text-sm font-semibold text-corporate-700 dark:text-corporate-200 mb-2">
                    Contenu de l'article *
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2 p-2 bg-corporate-100 dark:bg-gray-700 rounded-lg border border-corporate-200 dark:border-gray-600">
                    <button
                      type="button"
                      onClick={() => formatText('bold')}
                      className="px-3 py-1 bg-white dark:bg-gray-600 hover:bg-corporate-200 dark:hover:bg-gray-500 rounded text-sm font-bold transition-colors"
                      title="Gras"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('italic')}
                      className="px-3 py-1 bg-white dark:bg-gray-600 hover:bg-corporate-200 dark:hover:bg-gray-500 rounded text-sm italic transition-colors"
                      title="Italique"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('heading')}
                      className="px-3 py-1 bg-white dark:bg-gray-600 hover:bg-corporate-200 dark:hover:bg-gray-500 rounded text-sm font-semibold transition-colors"
                      title="Titre"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('list')}
                      className="px-3 py-1 bg-white dark:bg-gray-600 hover:bg-corporate-200 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                      title="Liste"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('link')}
                      className="px-3 py-1 bg-white dark:bg-gray-600 hover:bg-corporate-200 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                      title="Lien"
                    >
                      🔗 Lien
                    </button>
                    <button
                      type="button"
                      onClick={insertImageUrl}
                      className="px-3 py-1 bg-white dark:bg-gray-600 hover:bg-corporate-200 dark:hover:bg-gray-500 rounded text-sm transition-colors flex items-center gap-1"
                      title="Insérer une image"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Image
                    </button>
                  </div>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={20}
                    className="w-full px-4 py-3 bg-corporate-50 dark:bg-gray-700 border border-corporate-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white font-mono text-sm"
                    placeholder="Écrivez le contenu complet de votre article ici... (Markdown supporté)"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-corporate-700 dark:text-corporate-200 mb-2">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-corporate-50 dark:bg-gray-700 border border-corporate-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white"
                    placeholder="IA, Automatisation, Innovation"
                  />
                </div>

                {/* Options de publication */}
                <div className="flex flex-wrap items-center gap-6 p-4 bg-corporate-50 dark:bg-gray-700 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-corporate-300 rounded focus:ring-blue-600"
                    />
                    <span className="text-sm font-semibold text-corporate-700 dark:text-corporate-200">
                      ⭐ Article à la une
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={formData.is_published}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-corporate-300 rounded focus:ring-blue-600"
                    />
                    <span className="text-sm font-semibold text-corporate-700 dark:text-corporate-200">
                      🌐 Publier immédiatement
                    </span>
                  </label>
                </div>

                {/* Boutons d'action */}
                <div className="flex items-center gap-4 pt-6 border-t border-corporate-200 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={saving || slugTaken}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>

                  {isEdit && formData.is_published && (
                    <a
                      href={`/blog/${formData.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-corporate-200 dark:bg-corporate-800 hover:bg-corporate-300 dark:hover:bg-corporate-700 text-corporate-700 dark:text-corporate-200 font-semibold rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      Prévisualiser
                    </a>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar - Statistiques et aide */}
          <div className="lg:col-span-1 space-y-6">
            {/* Statistiques */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-corporate-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-midnight dark:text-white mb-4">
                📊 Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-corporate-600 dark:text-corporate-300">Mots:</span>
                  <span className="text-sm font-bold text-midnight dark:text-white">{wordCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-corporate-600 dark:text-corporate-300">Caractères:</span>
                  <span className="text-sm font-bold text-midnight dark:text-white">{charCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-corporate-600 dark:text-corporate-300">Temps de lecture:</span>
                  <span className="text-sm font-bold text-midnight dark:text-white">{readingTime} min</span>
                </div>
              </div>
            </div>

            {/* Aide Markdown */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-corporate-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-midnight dark:text-white mb-4">
                📝 Aide Markdown
              </h3>
              <div className="space-y-2 text-sm">
                <div className="font-mono">
                  <span className="text-corporate-500 dark:text-corporate-400">**gras**</span> → <strong>gras</strong>
                </div>
                <div className="font-mono">
                  <span className="text-corporate-500 dark:text-corporate-400">*italique*</span> → <em>italique</em>
                </div>
                <div className="font-mono">
                  <span className="text-corporate-500 dark:text-corporate-400">## Titre</span> → Titre H2
                </div>
                <div className="font-mono">
                  <span className="text-corporate-500 dark:text-corporate-400">- Liste</span> → • Liste
                </div>
                <div className="font-mono">
                  <span className="text-corporate-500 dark:text-corporate-400">[lien](url)</span> → lien
                </div>
              </div>
            </div>

            {/* Recommandations SEO */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-corporate-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-midnight dark:text-white mb-4">
                🎯 SEO Tips
              </h3>
              <ul className="space-y-2 text-sm text-corporate-600 dark:text-corporate-300">
                <li className={wordCount >= 300 ? 'text-green-600' : ''}>
                  {wordCount >= 300 ? '✓' : '○'} Au moins 300 mots
                </li>
                <li className={formData.excerpt.length >= 150 ? 'text-green-600' : ''}>
                  {formData.excerpt.length >= 150 ? '✓' : '○'} Extrait de 150+ caractères
                </li>
                <li className={formData.tags.split(',').length >= 3 ? 'text-green-600' : ''}>
                  {formData.tags.split(',').filter(Boolean).length >= 3 ? '✓' : '○'} Au moins 3 tags
                </li>
                <li className={formData.image_url ? 'text-green-600' : ''}>
                  {formData.image_url ? '✓' : '○'} Image mise en avant
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPostEditor;