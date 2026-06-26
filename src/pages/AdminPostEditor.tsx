import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, ArrowLeft, Eye, Image as ImageIcon, AlertCircle, Check, Copy, Trash2,
  Bold, Italic, Heading, List, Link, Code, Quote, ListOrdered, Minus,
  Table, Undo, Redo,
  FileText, Download, Upload, Maximize2, Minimize2, Sparkles, Loader,
  Type, Keyboard, Clock
} from 'lucide-react';
import CloudinaryUploader from '../components/admin/CloudinaryUploader';
import { supabase } from '../lib/supabase';

const AdminPostEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id !== 'new';
  const textareaRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [categories, setCategories] = useState([
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
    author: '',
    category: '',
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
  const [editorTheme, setEditorTheme] = useState('light');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

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
          author: data.author || '',
          category: data.category || '',
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
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Auto-save brouillons
  useEffect(() => {
    if (!autoSaveEnabled || !isEdit || saving) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: formData.title,
            slug: formData.slug,
            excerpt: formData.excerpt,
            content: formData.content,
            image_url: formData.image_url,
            author: formData.author,
            category: formData.category,
            tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            is_featured: formData.is_featured,
            meta_title: formData.meta_title,
            meta_description: formData.meta_description,
            focus_keyword: formData.focus_keyword,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (!error) {
          setLastSaved(new Date());
        }
      } catch (err) {
        console.error('Auto-save error:', err);
      }
    }, 3000); // Auto-save après 3 secondes d'inactivité

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData, autoSaveEnabled, isEdit, saving, id]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !isEdit ? { slug: generateSlug(value) } : {}),
    }));
  };

  const addToHistory = (content) => {
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

  const insertText = (before, after = '', placeholder = '') => {
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
  const formatCodeBlock = () => insertText('\n```\n', '\n```\n', 'bloc de code');
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

  const insertTable = () => {
    const cols = prompt('Nombre de colonnes:', '3');
    const rows = prompt('Nombre de lignes:', '3');
    if (cols && rows) {
      let table = '\n\n';
      // Header
      table += '| ' + Array(parseInt(cols)).fill('Colonne').map((c, i) => `${c}${i+1}`).join(' | ') + ' |\n';
      table += '| ' + Array(parseInt(cols)).fill('---').join(' | ') + ' |\n';
      // Rows
      for (let i = 0; i < parseInt(rows); i++) {
        table += '| ' + Array(parseInt(cols)).fill('Cellule').join(' | ') + ' |\n';
      }
      table += '\n';
      insertText(table);
    }
  };

  const insertTemplate = (type) => {
    const templates = {
      intro: '\n## Introduction\n\nDans cet article, nous allons explorer les points clés de ce sujet. Vous découvrirez:\n\n- Le contexte et l\'importance\n- Les concepts essentiels\n- Les applications pratiques\n- Les bénéfices concrets\n\n',
      section: '\n## Titre de la section\n\nDécrivez le contenu principal de cette section. Utilisez des points de repère clairs et des exemples concrets.\n\n### Sous-section\n\nVous pouvez créer des sous-sections pour une meilleure structure.\n\n',
      conclusion: '\n## Conclusion\n\nEn résumé, les points clés à retenir sont:\n\n1. **Point 1**: Une conclusion importante\n2. **Point 2**: Un apprentissage clé\n3. **Point 3**: Un appel à l\'action\n\nN\'hésitez pas à [nous contacter](/contact) pour plus d\'informations.\n\n',
      callout: '\n> 💡 **Point Important**: C\'est ici que vous placez une idée clé ou un conseil pratique que les lecteurs doivent retenir absolument.\n\n',
      steps: '\n## Étapes à suivre\n\n1. **Première étape**: Description détaillée\n   - Sous-point 1\n   - Sous-point 2\n\n2. **Deuxième étape**: Ce qu\'il faut faire ensuite\n   - Action importante\n   - Vérification\n\n3. **Troisième étape**: La finition\n   - Validation\n   - Prochaines étapes\n\n',
      pros_cons: '\n## Avantages et Inconvénients\n\n### ✅ Avantages\n\n- **Avantage 1**: Explication du bénéfice\n- **Avantage 2**: Autre bénéfice clé\n- **Avantage 3**: Impact positif\n\n### ❌ Inconvénients\n\n- **Inconvénient 1**: Challenge ou limitation\n- **Inconvénient 2**: Point d\'amélioration\n- **Inconvénient 3**: Restriction importante\n\n',
    };
    insertText(templates[type] || '');
  };

  const autoFormat = () => {
    let content = formData.content;
    
    // Auto-formatting rules
    content = content.replace(/(\n|^)# ([^\n]+)/g, '$1# $2'); // Fix heading spacing
    content = content.replace(/([^\n])\n##/g, '$1\n\n##'); // Add spacing before headings
    content = content.replace(/(\n- [^\n]+)(\n[^-\n])/g, '$1\n$2'); // Add spacing after lists
    content = content.replace(/\n{3,}/g, '\n\n'); // Remove excessive line breaks
    
    setFormData(prev => ({ ...prev, content }));
    addToHistory(content);
    setSuccess('Formatage automatique appliqué !');
    setTimeout(() => setSuccess(''), 2000);
  };

  const exportMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([formData.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.slug || 'article'}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const importMarkdown = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        setFormData(prev => ({ ...prev, content }));
        addToHistory(content);
      };
      reader.readAsText(file);
    }
  };

  const copySlug = () => {
    navigator.clipboard.writeText(formData.slug);
    setSuccess('Slug copié !');
    setTimeout(() => setSuccess(''), 2000);
  };

  const renderPreview = () => {
    let html = formData.content;
    
    // Convertir le markdown en HTML avec style professionnel
    // Titres
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white border-l-4 border-blue-600 pl-4">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white border-l-4 border-blue-600 pl-4">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">$1</h1>');
    
    // Formatage de texte
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-sm text-red-600 dark:text-red-400">$1</code>');
    
    // Blocs de code
    html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="font-mono text-sm">$2</code></pre>');
    
    // Listes
    html = html.replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul class="list-disc ml-6 my-4 space-y-1 text-gray-700 dark:text-gray-300">$1</ul>');
    
    // Listes numérotées
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ol class="list-decimal ml-6 my-4 space-y-1 text-gray-700 dark:text-gray-300">$1</ol>');
    
    // Citations
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300 rounded-r">$1</blockquote>');
    
    // Liens
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure class="my-6"><img src="$2" alt="$1" class="w-full rounded-lg shadow-md max-w-full" /><figcaption class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">$1</figcaption></figure>');
    
    // Séparateurs horizontaux
    html = html.replace(/^---$/gm, '<hr class="my-8 border-t-2 border-gray-300 dark:border-gray-600" />');
    
    // Paragraphes
    html = html.replace(/\n\n/g, '</p><p class="my-4 leading-relaxed text-gray-700 dark:text-gray-300">');
    html = '<p class="my-4 leading-relaxed text-gray-700 dark:text-gray-300">' + html + '</p>';
    
    return { __html: html };
  };

  const handleSave = async (e) => {
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
          .insert([{
            ...postData,
            created_at: new Date().toISOString(),
          }])
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
    } catch (error) {
      setError('Erreur lors de l\'enregistrement: ' + (error.message || ''));
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuccess('Article supprimé');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (error) {
      setError('Erreur lors de la suppression');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const toolbarButtons = [
    { icon: Bold, action: formatBold, tooltip: 'Gras (Ctrl+B)', shortcut: 'B' },
    { icon: Italic, action: formatItalic, tooltip: 'Italique (Ctrl+I)', shortcut: 'I' },
    { icon: Heading, action: () => formatHeading(2), tooltip: 'Titre H2', shortcut: 'H' },
    { divider: true },
    { icon: List, action: formatList, tooltip: 'Liste à puces', shortcut: 'L' },
    { icon: ListOrdered, action: formatOrderedList, tooltip: 'Liste numérotée', shortcut: 'O' },
    { icon: Quote, action: formatQuote, tooltip: 'Citation', shortcut: 'Q' },
    { divider: true },
    { icon: Link, action: formatLink, tooltip: 'Insérer un lien', shortcut: 'K' },
    { icon: ImageIcon, action: insertImageUrl, tooltip: 'Insérer une image', shortcut: 'M' },
    { icon: Code, action: formatCode, tooltip: 'Code inline', shortcut: 'C' },
    { icon: Table, action: insertTable, tooltip: 'Insérer un tableau', shortcut: 'T' },
    { divider: true },
    { icon: Minus, action: formatDivider, tooltip: 'Séparateur horizontal', shortcut: 'D' },
    { icon: Undo, action: undo, tooltip: 'Annuler (Ctrl+Z)', shortcut: 'Z', disabled: historyIndex <= 0 },
    { icon: Redo, action: redo, tooltip: 'Rétablir (Ctrl+Y)', shortcut: 'Y', disabled: historyIndex >= history.length - 1 },
  ];

  useEffect(() => {
    const handleKeyboard = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
          case 'b': e.preventDefault(); formatBold(); break;
          case 'i': e.preventDefault(); formatItalic(); break;
          case 'k': e.preventDefault(); formatLink(); break;
          case 'z': e.preventDefault(); undo(); break;
          case 'y': e.preventDefault(); redo(); break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [historyIndex, history]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ${isFullscreen ? 'fixed inset-0 z-50 pt-0' : 'pt-16'}`}>
      <div className={`mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 ${isFullscreen ? 'max-w-full h-full' : 'max-w-7xl'}`}>
        {/* Header - Responsive */}
        {!isFullscreen && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:hover:text-blue-400 font-semibold transition-colors text-sm md:text-base"
            >
              <ArrowLeft className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Retour au tableau de bord</span>
              <span className="sm:hidden">Retour</span>
            </button>

            {isEdit && (
              <button
                onClick={handleDelete}
                disabled={saving}
                className="inline-flex items-center justify-center px-3 md:px-4 py-2 md:py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition-colors text-sm md:text-base"
              >
                {saving ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2 flex-shrink-0" />
                )}
                Supprimer
              </button>
            )}
          </div>
        )}

        {/* Alerts - Responsive */}
        {error && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 animate-in">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-red-600 dark:text-red-400 flex-1">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3 animate-in">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-green-600 dark:text-green-400 flex-1">{success}</p>
          </div>
        )}

        <div className={`grid gap-4 md:gap-8 ${isFullscreen ? 'grid-cols-1 h-[calc(100vh-8rem)]' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Main Editor - Responsive */}
          <div className={`${isFullscreen ? 'col-span-1' : 'lg:col-span-2'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 p-3 md:p-6 lg:p-8 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {isEdit ? 'Modifier l\'article' : 'Nouvel article'}
                </h1>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="p-2 md:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Aperçu"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 md:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Plein écran"
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-4 md:space-y-6 flex-1 flex flex-col overflow-hidden">
                {!isFullscreen && (
                  <>
                    {/* Title */}
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 md:mb-2">
                        Titre de l'article *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-base md:text-lg font-semibold"
                        placeholder="Ex: L'avenir de l'IA en Afrique"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 md:mb-2">
                        Slug (URL) *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="slug"
                          value={formData.slug}
                          onChange={handleChange}
                          required
                          className={`flex-1 px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white font-mono text-xs md:text-sm ${
                            slugTaken ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                          }`}
                          placeholder="avenir-ia-afrique"
                        />
                        <button
                          type="button"
                          onClick={copySlug}
                          className="px-3 md:px-4 py-2 md:py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors flex-shrink-0"
                          title="Copier le slug"
                        >
                          <Copy className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Advanced Toolbar - Responsive */}
                <div className="space-y-2 flex-1 flex flex-col overflow-hidden">
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Contenu de l'article *
                  </label>
                  
                  {/* Toolbar - Mobile scrollable */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Keyboard className="w-4 h-4" />
                        <span className="hidden sm:inline">Raccourcis: Ctrl+B=Gras | Ctrl+I=Italique | Ctrl+K=Lien | Ctrl+Z=Annuler</span>
                        <span className="sm:hidden">Raccourcis clavier disponibles</span>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input 
                          type="checkbox" 
                          checked={autoSaveEnabled} 
                          onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-600 dark:text-gray-400">Auto-save</span>
                        {lastSaved && isEdit && (
                          <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {lastSaved.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </label>
                    </div>

                    {/* Toolbar principale */}
                    <div className="flex flex-wrap gap-0.5 md:gap-1 p-2 md:p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 overflow-x-auto">
                      {toolbarButtons.map((btn, idx) => 
                        btn.divider ? (
                          <div key={idx} className="w-px bg-gray-300 dark:bg-gray-600 mx-0.5 md:mx-1" />
                        ) : (
                          <button
                            key={idx}
                            type="button"
                            onClick={btn.action}
                            disabled={btn.disabled}
                            className="p-1.5 md:p-2 bg-white dark:bg-gray-500 hover:bg-blue-100 dark:hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all duration-200 flex-shrink-0 active:scale-95 shadow-sm hover:shadow-md"
                            title={btn.tooltip}
                          >
                            <btn.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                        )
                      )}
                      
                      <div className="w-px bg-gray-300 dark:bg-gray-600 mx-0.5 md:mx-1 flex-shrink-0" />
                      
                      {/* Templates Dropdown */}
                      <div className="relative group flex-shrink-0">
                        <button
                          type="button"
                          className="p-1.5 md:p-2 bg-white dark:bg-gray-500 hover:bg-blue-100 dark:hover:bg-gray-400 rounded transition-all duration-200 flex items-center gap-0.5 md:gap-1 shadow-sm hover:shadow-md active:scale-95"
                          title="Modèles de contenu"
                        >
                          <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600" />
                          <span className="text-xs hidden sm:inline font-semibold">Modèles</span>
                        </button>
                        <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-10 min-w-[200px] text-xs md:text-sm">
                          <button type="button" onClick={() => insertTemplate('intro')} className="block w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-gray-600 font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-600">📝 Introduction</button>
                          <button type="button" onClick={() => insertTemplate('section')} className="block w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-gray-600 font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-600">📄 Section</button>
                          <button type="button" onClick={() => insertTemplate('conclusion')} className="block w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-gray-600 font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-600">🎯 Conclusion</button>
                          <button type="button" onClick={() => insertTemplate('callout')} className="block w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-gray-600 font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-600">💡 Point important</button>
                          <button type="button" onClick={() => insertTemplate('steps')} className="block w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-gray-600 font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-600">🔢 Étapes</button>
                          <button type="button" onClick={() => insertTemplate('pros_cons')} className="block w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-gray-600 font-medium text-gray-700 dark:text-gray-200">⚖️ Avantages/Inconvénients</button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={autoFormat}
                        className="p-1.5 md:p-2 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900/70 rounded transition-all duration-200 flex items-center gap-0.5 md:gap-1 flex-shrink-0 shadow-sm hover:shadow-md active:scale-95"
                        title="Formatage automatique"
                      >
                        <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs text-purple-600 dark:text-purple-400 hidden sm:inline font-semibold">Auto</span>
                      </button>

                      <button
                        type="button"
                        onClick={exportMarkdown}
                        className="p-1.5 md:p-2 bg-white dark:bg-gray-500 hover:bg-blue-100 dark:hover:bg-gray-400 rounded transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow-md active:scale-95"
                        title="Exporter en Markdown"
                      >
                        <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>

                      <label className="p-1.5 md:p-2 bg-white dark:bg-gray-500 hover:bg-blue-100 dark:hover:bg-gray-400 rounded transition-all duration-200 cursor-pointer flex-shrink-0 shadow-sm hover:shadow-md active:scale-95" title="Importer Markdown">
                        <Upload className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <input type="file" accept=".md,.txt" onChange={importMarkdown} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Editor/Preview Split - Responsive */}
                  <div className="flex-1 grid grid-cols-1 gap-3 md:gap-4 overflow-hidden" style={{ gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr' }}>
                    {/* Editor */}
                    <div className="flex flex-col overflow-hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                      <div className="flex-1 overflow-hidden">
                        <textarea
                          ref={textareaRef}
                          name="content"
                          value={formData.content}
                          onChange={(e) => {
                            handleChange(e);
                            if (history.length === 0 || history[history.length - 1] !== e.target.value) {
                              addToHistory(e.target.value);
                            }
                          }}
                          required
                          className="w-full h-full px-3 md:px-4 py-3 md:py-4 bg-gray-50 dark:bg-gray-750 text-gray-900 dark:text-white font-mono text-xs md:text-sm resize-none focus:outline-none focus:ring-inset focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 leading-relaxed"
                          placeholder="✍️ Écrivez votre article ici...

🔥 Raccourcis:
• Ctrl+B = **Gras**
• Ctrl+I = *Italique*
• Ctrl+K = Lien
• Ctrl+Z = Annuler

📝 Tips:
• Utilisez ## pour les titres
• - pour les listes à puces
• > pour les citations
• ``` pour le code"
                          spellCheck="true"
                        />
                      </div>
                      
                      {/* Stats bar */}
                      <div className="border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 md:px-4 py-2 md:py-3">
                        <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex gap-3 md:gap-4">
                            <span className="flex items-center gap-1">
                              <Type className="w-4 h-4" />
                              {wordCount} mots
                            </span>
                            <span className="flex items-center gap-1 hidden sm:flex">
                              <Code className="w-4 h-4" />
                              {charCount} caractères
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {readingTime} min
                            </span>
                          </div>
                          <span className="font-mono text-blue-600 dark:text-blue-400">
                            Ligne {formData.content.substring(0, textareaRef.current?.selectionStart || 0).split('\n').length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    {showPreview && (
                      <div className="overflow-auto hidden sm:flex sm:flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                        <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-600 px-4 py-3 flex items-center justify-between">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Eye className="w-4 h-4 text-blue-600" />
                            Aperçu en direct
                          </h3>
                          <button
                            type="button"
                            onClick={() => setShowPreview(false)}
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                            title="Fermer l'aperçu"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex-1 overflow-auto">
                          <article className="prose dark:prose-invert max-w-none p-4 md:p-6 text-sm md:text-base">
                            <div dangerouslySetInnerHTML={renderPreview()} />
                          </article>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons - Responsive */}
                {!isFullscreen && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="submit"
                      disabled={saving || slugTaken}
                      className="inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg transition-colors text-sm md:text-base w-full sm:w-auto order-1 sm:order-none"
                    >
                      {saving ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                          Enregistrer comme brouillon
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={saving || !formData.title || !formData.slug || !formData.content || !formData.author || !formData.category}
                      onClick={async () => {
                        setFormData(prev => ({ ...prev, is_published: true }));
                        setSaving(true);
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
                            is_published: true,
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
                            const { error: insertError } = await supabase
                              .from('blog_posts')
                              .insert([{
                                ...postData,
                                created_at: new Date().toISOString(),
                              }]);

                            if (insertError) throw insertError;
                          }

                          setFormData(prev => ({ ...prev, is_published: true }));
                          setSuccess('Article publié avec succès ! 🎉');
                          setTimeout(() => navigate('/admin/dashboard'), 2000);
                        } catch (error) {
                          setError('Erreur lors de la publication: ' + (error?.message || ''));
                          setFormData(prev => ({ ...prev, is_published: false }));
                        } finally {
                          setSaving(false);
                        }
                      }}
                      className="inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold rounded-lg transition-colors text-sm md:text-base w-full sm:w-auto"
                    >
                      {saving ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Publi...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                          <span className="hidden sm:inline">Publier l'article</span>
                          <span className="sm:hidden">Publier</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const url = formData.slug ? `/blog/${formData.slug}` : '/blog';
                        window.open(url, '_blank');
                      }}
                      className="inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-colors text-sm md:text-base w-full sm:w-auto"
                    >
                      <Eye className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                      <span className="hidden sm:inline">Prévisualiser</span>
                      <span className="sm:hidden">Aperçu</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar - Responsive */}
          {!isFullscreen && (
            <div className="lg:col-span-1 space-y-4 md:space-y-6">
              {/* Metadata */}
              <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                  📋 Métadonnées
                </h3>
                
                <div className="space-y-3 md:space-y-4">
                  {/* Author */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 md:mb-2">
                      Auteur *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-xs md:text-sm"
                      placeholder="Medessi Coovi"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 md:mb-2">
                      Catégorie *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-xs md:text-sm"
                    >
                      <option value="">Sélectionner</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 md:mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-xs md:text-sm"
                      placeholder="IA, Tech, Innovation"
                    />
                  </div>

                  {/* Cloudinary image upload */}
                  <div>
                    <CloudinaryUploader
                      label="Image mise en avant"
                      value={formData.image_url}
                      onChange={(value) => setFormData(prev => ({ ...prev, image_url: value }))}
                      folder="blog"
                      placeholder="https://res.cloudinary.com/..."
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 md:mb-2">
                      Extrait ({formData.excerpt.length}/200)
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleChange}
                      maxLength={200}
                      rows={3}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-xs md:text-sm"
                      placeholder="Résumé de l'article..."
                    />
                  </div>

                  {/* Publishing options */}
                  <div className="space-y-2 md:space-y-3 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                      />
                      <span className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200">
                        ⭐ Article à la une
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        name="is_published"
                        checked={formData.is_published}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                      />
                      <span className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200">
                        🌐 Publier
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                  📊 Statistiques
                </h3>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Mots:</span>
                    <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white">{wordCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Caractères:</span>
                    <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white">{charCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Temps de lecture:</span>
                    <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white">{readingTime} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Paragraphes:</span>
                    <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white">
                      {formData.content.split(/\n\n+/).filter(Boolean).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* SEO Advanced */}
              <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                  🎯 SEO Avancé
                </h3>
                
                <div className="space-y-3 md:space-y-4">
                  {/* Focus Keyword */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 md:mb-2">
                      Mot-clé principal
                    </label>
                    <input
                      type="text"
                      name="focus_keyword"
                      value={formData.focus_keyword}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-xs md:text-sm"
                      placeholder="Ex: marketing digital"
                    />
                  </div>

                  {/* Meta Title */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 md:mb-2">
                      Titre SEO ({formData.meta_title.length}/60)
                    </label>
                    <input
                      type="text"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleChange}
                      maxLength={60}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-xs md:text-sm"
                      placeholder="Titre optimisé..."
                    />
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 md:mb-2">
                      Description SEO ({formData.meta_description.length}/160)
                    </label>
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleChange}
                      maxLength={160}
                      rows={3}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-xs md:text-sm"
                      placeholder="Description optimisée..."
                    />
                  </div>
                </div>
              </div>

              {/* SEO Checklist */}
              <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                  ✅ Checklist SEO
                </h3>
                <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                  <li className={wordCount >= 300 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                    {wordCount >= 300 ? '✓' : '○'} Minimum 300 mots ({wordCount}/300)
                  </li>
                  <li className={formData.excerpt.length >= 150 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                    {formData.excerpt.length >= 150 ? '✓' : '○'} Extrait 150+ caractères
                  </li>
                  <li className={formData.tags.split(',').filter(Boolean).length >= 3 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                    {formData.tags.split(',').filter(Boolean).length >= 3 ? '✓' : '○'} Au moins 3 tags
                  </li>
                  <li className={formData.image_url ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                    {formData.image_url ? '✓' : '○'} Image mise en avant
                  </li>
                  <li className={formData.focus_keyword ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                    {formData.focus_keyword ? '✓' : '○'} Mot-clé défini
                  </li>
                  <li className={formData.content.includes('##') ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                    {formData.content.includes('##') ? '✓' : '○'} Titres structurés (H2/H3)
                  </li>
                  <li className={formData.content.split(/\n\n+/).length >= 5 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                    {formData.content.split(/\n\n+/).length >= 5 ? '✓' : '○'} Paragraphes bien structurés
                  </li>
                </ul>
                
                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200">Score SEO:</span>
                    <span className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400">
                      {Math.round((
                        [
                          wordCount >= 300,
                          formData.excerpt.length >= 150,
                          formData.tags.split(',').filter(Boolean).length >= 3,
                          formData.image_url,
                          formData.focus_keyword,
                          formData.content.includes('##'),
                          formData.content.split(/\n\n+/).length >= 5
                        ].filter(Boolean).length / 7
                      ) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen bottom bar */}
        {isFullscreen && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 md:p-4 z-40">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
              <div className="flex flex-wrap gap-3 md:gap-6 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                <span>{wordCount} mots</span>
                <span>{charCount} caractères</span>
                <span>{readingTime} min</span>
                <span>SEO: {Math.round((
                  [
                    wordCount >= 300,
                    formData.excerpt.length >= 150,
                    formData.tags.split(',').filter(Boolean).length >= 3,
                    formData.image_url,
                    formData.focus_keyword
                  ].filter(Boolean).length / 5
                ) * 100)}%</span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-3 md:px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-colors text-sm md:text-base"
                >
                  Quitter
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 md:px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {saving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPostEditor;