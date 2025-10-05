import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Eye } from 'lucide-react';
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

  useEffect(() => {
    checkAuth();
    fetchCategories();
    if (isEdit) fetchPost();
  }, []);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
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
      } else {
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (insertError) throw insertError;
      }

      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-corporate-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au tableau de bord
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-corporate-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-midnight dark:text-white mb-6">
            {isEdit ? 'Modifier l\'article' : 'Nouvel article'}
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-corporate-700 dark:text-corporate-200 mb-2">
                  Titre de l'article *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-corporate-50 dark:bg-gray-700 border border-corporate-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white"
                  placeholder="Ex: L'avenir de l'IA en Afrique"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-corporate-700 dark:text-corporate-200 mb-2">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-corporate-50 dark:bg-gray-700 border border-corporate-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white font-mono text-sm"
                  placeholder="avenir-ia-afrique"
                />
                <p className="mt-1 text-xs text-corporate-500 dark:text-corporate-400">
                  L'URL de l'article sera: /blog/{formData.slug || 'slug-de-larticle'}
                </p>
              </div>

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

              <div className="md:col-span-2">
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
                <p className="mt-1 text-xs text-corporate-500 dark:text-corporate-400">
                  Utilisez des images de Pexels (1200x800px recommandé)
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-corporate-700 dark:text-corporate-200 mb-2">
                  Extrait (résumé) *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-corporate-50 dark:bg-gray-700 border border-corporate-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white"
                  placeholder="Un court résumé de l'article (150-200 caractères)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-corporate-700 dark:text-corporate-200 mb-2">
                  Contenu de l'article *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={15}
                  className="w-full px-4 py-3 bg-corporate-50 dark:bg-gray-700 border border-corporate-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-midnight dark:text-white font-mono text-sm"
                  placeholder="Écrivez le contenu complet de votre article ici..."
                />
              </div>

              <div className="md:col-span-2">
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

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-corporate-300 rounded focus:ring-blue-600"
                  />
                  <span className="text-sm font-semibold text-corporate-700 dark:text-corporate-200">
                    Article à la une
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
                    Publier immédiatement
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-corporate-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={saving}
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
    </div>
  );
};

export default AdminPostEditor;
