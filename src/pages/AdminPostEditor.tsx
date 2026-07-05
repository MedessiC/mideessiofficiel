import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, ArrowLeft, Eye, Image as ImageIcon, AlertCircle, Check, Copy, Trash2,
  Bold, Italic, Heading, List, Link, Code, Quote, ListOrdered, Minus,
  Table, Undo, Redo, FileText, Download, Upload, Maximize2, Minimize2, Sparkles, Loader
} from 'lucide-react';
import CloudinaryUploader from '../components/admin/CloudinaryUploader';
import { supabase } from '../lib/supabase';

const AdminPostEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id !== 'new';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [categories] = useState([
    { id: 1, name: 'Technologie' },
    { id: 2, name: 'Business' },
    { id: 3, name: 'Marketing' }
  ]);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    author: 'MIDEESSI Team',
    category: 'Technologie',
    tags: '',
    is_featured: false,
    is_published: false,
    meta_title: '',
    meta_description: '',
    focus_keyword: '',
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [slugTaken, setSlugTaken] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      loadPost();
    }
  }, [id]);

  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).filter(Boolean).length;
    const chars = formData.content.length;
    const time = Math.ceil(words / 200);
    
    setWordCount(words);
    setCharCount(chars);
    setReadingTime(time);
  }, [formData.content]);

  const loadPost = async () => {
    try {
      setSaving(true);
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          image_url: data.image_url || '',
          author: data.author || 'MIDEESSI Team',
          category: data.category || 'Technologie',
          tags: data.tags ? data.tags.join(', ') : '',
          is_featured: data.is_featured || false,
          is_published: data.is_published || false,
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          focus_keyword: data.focus_keyword || '',
        });
        setLastSaved(new Date(data.updated_at || data.created_at));
      }
    } catch (error) {
      setError('Erreur lors du chargement de l\'article');
    } finally {
      setSaving(false);
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

  const addToHistory = (content: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(content);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setFormData(prev => ({ ...prev, content: history[historyIndex - 1] }));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setFormData(prev => ({ ...prev, content: history[historyIndex + 1] }));
    }
  };

  const insertText = (before: string, after = '', placeholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = before + textToInsert + after;
    const newContent = 
      formData.content.substring(0, start) + 
      newText + 
      formData.content.substring(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
    addToHistory(newContent);

    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const formatBold = () => insertText('**', '**', 'texte en gras');
  const formatItalic = () => insertText('*', '*', 'texte en italique');
  const formatHeading = (level = 2) => insertText('\n' + '#'.repeat(level) + ' ', '\n', 'Titre');
  const formatList = () => insertText('\n- ', '\n', 'élément de liste');
  const formatOrderedList = () => insertText('\n1. ', '\n', 'premier élément');
  const formatCode = () => insertText('`', '`', 'code');
  const formatQuote = () => insertText('\n> ', '\n', 'citation');
  const formatDivider = () => insertText('\n\n---\n\n');
  
  const formatLink = () => {
    const url = prompt('URL du lien:');
    if (url) insertText('[', `](${url})`, 'texte du lien');
  };

  const insertImageUrl = () => {
    const url = prompt('URL de l\'image:');
    if (url) {
      const alt = prompt('Texte alternatif (description):') || 'Image';
      insertText(`\n![${alt}](${url})\n`);
    }
  };

  const copySlug = () => {
    navigator.clipboard.writeText(formData.slug);
    setSuccess('Slug copié !');
    setTimeout(() => setSuccess(''), 2000);
  };

  const renderPreview = () => {
    let html = formData.content;
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-5 mb-2 text-white border-l-2 border-[var(--brand-gold)] pl-3">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3 text-white border-l-2 border-[var(--brand-gold)] pl-3">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black mt-6 mb-3 text-white">$1</h1>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-300">$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code class="bg-white/10 px-2 py-0.5 rounded font-mono text-xs text-[var(--brand-gold)]">$1</code>');
    html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre class="bg-black/40 text-gray-200 p-4 rounded-xl overflow-x-auto my-4 border border-white/5"><code class="font-mono text-xs">$2</code></pre>');
    html = html.replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>');
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-[var(--brand-gold)] bg-white/5 pl-4 py-2 my-4 italic text-gray-300 rounded-r">$1</blockquote>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[var(--brand-gold)] hover:underline font-semibold">$1</a>');
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure class="my-6"><img src="$2" alt="$1" class="w-full rounded-xl border border-white/5" /></figure>');
    html = html.replace(/^---$/gm, '<hr class="my-6 border-t border-white/10" />');
    html = html.replace(/\n\n/g, '</p><p class="my-3 leading-relaxed text-gray-300">');
    html = '<p class="my-3 leading-relaxed text-gray-300">' + html + '</p>';
    return { __html: html };
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.title || !formData.slug || !formData.content || !formData.author || !formData.category) {
        setError('Veuillez remplir tous les champs obligatoires');
        setSaving(false);
        return;
      }

      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        image_url: formData.image_url,
        author: formData.author,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        is_featured: formData.is_featured,
        is_published: formData.is_published,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        focus_keyword: formData.focus_keyword,
        updated_at: new Date().toISOString(),
      };

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError, data } = await supabase
          .from('blog_posts')
          .insert([{ ...postData, created_at: new Date().toISOString() }])
          .select();

        if (insertError) throw insertError;
        if (data && data[0]) {
          navigate(`/admin/post/${data[0].id}`);
        }
      }

      setSuccess('Article enregistré avec succès !');
      setTimeout(() => {
        if (!isEdit) {
          navigate('/admin/dashboard');
        } else {
          setSuccess('');
        }
      }, 2000);
    } catch (error: any) {
      setError('Erreur lors de l\'enregistrement: ' + (error.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer cet article ?')) return;
    setSaving(true);
    try {
      await supabase.from('blog_posts').delete().eq('id', id);
      setSuccess('Article supprimé');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch {
      setError('Erreur lors de la suppression');
    } finally {
      setSaving(false);
    }
  };

  const toolbarButtons = [
    { icon: Bold, action: formatBold, tooltip: 'Gras' },
    { icon: Italic, action: formatItalic, tooltip: 'Italique' },
    { icon: Heading, action: () => formatHeading(2), tooltip: 'Titre H2' },
    { icon: List, action: formatList, tooltip: 'Liste' },
    { icon: ListOrdered, action: formatOrderedList, tooltip: 'Liste numérotée' },
    { icon: Quote, action: formatQuote, tooltip: 'Citation' },
    { icon: Link, action: formatLink, tooltip: 'Lien' },
    { icon: ImageIcon, action: insertImageUrl, tooltip: 'Image' },
    { icon: Code, action: formatCode, tooltip: 'Code' },
    { icon: Minus, action: formatDivider, tooltip: 'Séparateur' },
    { icon: Undo, action: undo, tooltip: 'Annuler', disabled: historyIndex <= 0 },
    { icon: Redo, action: redo, tooltip: 'Rétablir', disabled: historyIndex >= history.length - 1 },
  ];

  return (
    <div className="min-h-screen bg-[#0f1117] text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour au dashboard
          </button>
          {isEdit && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-900/40 hover:bg-red-900/60 border border-red-700/30 text-red-200 text-xs font-semibold rounded-xl transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Supprimer
            </button>
          )}
        </div>

        {/* Alert Notifications */}
        {error && (
          <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl flex items-center gap-3 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl flex items-center gap-3 text-xs text-emerald-400">
            <Check className="w-4 h-4 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* Grid Editor Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Form Fields (Left) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/5 border border-white/8 rounded-2xl p-5 space-y-4">
              <h2 className="font-black text-white text-base">
                {isEdit ? "Modifier l'article" : "Rédiger un article"}
              </h2>

              <div className="space-y-4">
                <FormField label="Titre de l'article *">
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required
                    className={INPUT_CLS} placeholder="Ex: L'avenir de l'IA en Afrique" />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Slug (URL) *">
                    <div className="flex gap-2">
                      <input type="text" name="slug" value={formData.slug} onChange={handleChange} required
                        className={`${INPUT_CLS} font-mono text-xs`} placeholder="avenir-ia-afrique" />
                      <button type="button" onClick={copySlug} className="px-3 bg-white/5 border border-white/10 rounded-xl text-xs hover:bg-white/10">
                        Copier
                      </button>
                    </div>
                  </FormField>
                  <FormField label="Auteur *">
                    <input type="text" name="author" value={formData.author} onChange={handleChange} required
                      className={INPUT_CLS} />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Catégorie *">
                    <select name="category" value={formData.category} onChange={handleChange} className={INPUT_CLS}>
                      <option value="Technologie">Technologie</option>
                      <option value="Business">Business</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </FormField>
                  <FormField label="Tags (séparés par des virgules)">
                    <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                      className={INPUT_CLS} placeholder="ia, tech, afrique" />
                  </FormField>
                </div>

                <FormField label="Extrait / Résumé *">
                  <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} required
                    className={INPUT_CLS} placeholder="Court résumé de l'article..." />
                </FormField>

                {/* Markdown Toolbar */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Corps de l'article *</label>
                  <div className="flex items-center gap-1.5 flex-wrap p-2 bg-white/5 border border-white/10 rounded-t-xl border-b-0">
                    {toolbarButtons.map((btn, idx) => (
                      <button key={idx} type="button" onClick={btn.action} disabled={btn.disabled}
                        className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" title={btn.tooltip}>
                        {btn.icon && <btn.icon className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                    <button type="button" onClick={() => setShowPreview(!showPreview)}
                      className={`ml-auto text-xs font-bold px-3 py-1 rounded-lg border ${showPreview ? 'bg-[var(--brand-gold)] text-[var(--brand-midnight)] border-[var(--brand-gold)]' : 'bg-transparent text-gray-400 border-white/15 hover:text-white'}`}>
                      Aperçu
                    </button>
                  </div>
                  {showPreview ? (
                    <div className="p-4 bg-black/20 border border-white/10 rounded-b-xl min-h-[300px] prose prose-invert max-w-none text-xs"
                      dangerouslySetInnerHTML={renderPreview()} />
                  ) : (
                    <textarea ref={textareaRef} name="content" value={formData.content} onChange={handleChange} rows={12} required
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-b-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-gold)]/50 font-mono"
                      placeholder="Rédigez en Markdown..." />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Cloudinary Featured Image */}
            <div className="bg-white/5 border border-white/8 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black text-white border-b border-white/8 pb-2">🖼️ Image à la une</h3>
              <div className="space-y-3">
                <FormField label="URL de l'image">
                  <input type="url" name="image_url" value={formData.image_url} onChange={handleChange}
                    className={INPUT_CLS} placeholder="https://res.cloudinary.com/..." />
                </FormField>
                <div className="border border-white/10 rounded-xl p-3 bg-black/20 text-center">
                  <p className="text-[10px] text-gray-400 mb-2">Utilisez notre uploader Cloudinary MIDEESSI</p>
                  <CloudinaryUploader onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image_url: url }))} />
                </div>
              </div>
            </div>

            {/* Publishing Panel */}
            <div className="bg-white/5 border border-white/8 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black text-white border-b border-white/8 pb-2">⚙️ Publication</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer">
                  <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange}
                    className="w-4 h-4 accent-[var(--brand-gold)]" />
                  <div>
                    <p className="text-xs font-bold text-white">⭐ Mettre en avant</p>
                    <p className="text-[9px] text-gray-400">Afficher à la une sur le blog</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer">
                  <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange}
                    className="w-4 h-4 accent-emerald-500" />
                  <div>
                    <p className="text-xs font-bold text-white">🌐 Publier l'article</p>
                    <p className="text-[9px] text-gray-400">Rendre visible publiquement</p>
                  </div>
                </label>
              </div>

              <button type="submit" onClick={handleSave} disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[var(--brand-gold)] text-[var(--brand-midnight)] font-black text-sm rounded-xl hover:opacity-90 transition-opacity shadow-lg">
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Enregistrer l'article
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

const INPUT_CLS = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-gold)]/50 transition-colors";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</label>
      {children}
    </div>
  );
}

export default AdminPostEditor;