import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, ArrowLeft, Eye, Image as ImageIcon, AlertCircle, Check, Copy, Trash2,
  Bold, Italic, Heading, List, Link, Code, Quote, ListOrdered, Minus,
  Table, Undo, Redo, Type, AlignLeft, AlignCenter, AlignRight,
  FileText, Download, Upload, Maximize2, Minimize2, Palette, Sparkles
} from 'lucide-react';

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
  const [imagePreview, setImagePreview] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editorTheme, setEditorTheme] = useState('light');

  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).filter(Boolean).length;
    const chars = formData.content.length;
    const time = Math.ceil(words / 200);
    
    setWordCount(words);
    setCharCount(chars);
    setReadingTime(time);
  }, [formData.content]);

  useEffect(() => {
    if (formData.image_url) {
      setImagePreview(formData.image_url);
    }
  }, [formData.image_url]);

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
      intro: '\n## Introduction\n\nDans cet article, nous allons explorer...\n\n',
      section: '\n## Section\n\nContenu de la section...\n\n',
      conclusion: '\n## Conclusion\n\nPour conclure, nous avons vu que...\n\n',
      callout: '\n> 💡 **Point important:** Message à retenir\n\n',
      steps: '\n## Étapes à suivre\n\n1. Première étape\n2. Deuxième étape\n3. Troisième étape\n\n',
      pros_cons: '\n## Avantages et Inconvénients\n\n### ✅ Avantages\n- Point positif 1\n- Point positif 2\n\n### ❌ Inconvénients\n- Point négatif 1\n- Point négatif 2\n\n',
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
    
    // Convert markdown to HTML (basic)
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded">$1</code>');
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul class="list-disc ml-6 my-4">$1</ul>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 italic my-4">$1</blockquote>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="my-4 rounded-lg max-w-full" />');
    html = html.replace(/\n\n/g, '</p><p class="my-4">');
    html = '<p class="my-4">' + html + '</p>';
    
    return { __html: html };
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      setSuccess('Article enregistré avec succès !');
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
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
    <div className={`min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50 pt-0' : ''}`}>
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isFullscreen ? 'max-w-full h-full' : 'max-w-7xl'}`}>
        {/* Header */}
        {!isFullscreen && (
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour au tableau de bord
            </button>

            {isEdit && (
              <button
                onClick={() => {}}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </button>
            )}
          </div>
        )}

        {/* Alerts */}
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

        <div className={`grid gap-8 ${isFullscreen ? 'grid-cols-1 h-[calc(100vh-8rem)]' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Main Editor */}
          <div className={`${isFullscreen ? 'col-span-1' : 'lg:col-span-2'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isEdit ? 'Modifier l\'article' : 'Nouvel article'}
                </h1>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Aperçu"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Plein écran"
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-6 flex-1 flex flex-col overflow-hidden">
                {!isFullscreen && (
                  <>
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Titre de l'article *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-lg font-semibold"
                        placeholder="Ex: L'avenir de l'IA en Afrique"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Slug (URL) *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="slug"
                          value={formData.slug}
                          onChange={handleChange}
                          required
                          className={`flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white font-mono text-sm ${
                            slugTaken ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                          }`}
                          placeholder="avenir-ia-afrique"
                        />
                        <button
                          type="button"
                          onClick={copySlug}
                          className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Copier le slug"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Advanced Toolbar */}
                <div className="space-y-2 flex-1 flex flex-col overflow-hidden">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Contenu de l'article *
                  </label>
                  
                  {/* Toolbar */}
                  <div className="flex flex-wrap gap-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    {toolbarButtons.map((btn, idx) => 
                      btn.divider ? (
                        <div key={idx} className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                      ) : (
                        <button
                          key={idx}
                          type="button"
                          onClick={btn.action}
                          disabled={btn.disabled}
                          className="p-2 bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                          title={btn.tooltip}
                        >
                          <btn.icon className="w-4 h-4" />
                        </button>
                      )
                    )}
                    
                    <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                    
                    {/* Templates Dropdown */}
                    <div className="relative group">
                      <button
                        type="button"
                        className="p-2 bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded transition-colors flex items-center gap-1"
                        title="Modèles de contenu"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-xs">Modèles</span>
                      </button>
                      <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[200px]">
                        <button type="button" onClick={() => insertTemplate('intro')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm">📝 Introduction</button>
                        <button type="button" onClick={() => insertTemplate('section')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm">📄 Section</button>
                        <button type="button" onClick={() => insertTemplate('conclusion')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm">🎯 Conclusion</button>
                        <button type="button" onClick={() => insertTemplate('callout')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm">💡 Point important</button>
                        <button type="button" onClick={() => insertTemplate('steps')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm">🔢 Étapes</button>
                        <button type="button" onClick={() => insertTemplate('pros_cons')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm">⚖️ Avantages/Inconvénients</button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={autoFormat}
                      className="p-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded transition-colors flex items-center gap-1"
                      title="Formatage automatique"
                    >
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs text-purple-600 dark:text-purple-400">Auto</span>
                    </button>

                    <button
                      type="button"
                      onClick={exportMarkdown}
                      className="p-2 bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded transition-colors"
                      title="Exporter en Markdown"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <label className="p-2 bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded transition-colors cursor-pointer" title="Importer Markdown">
                      <Upload className="w-4 h-4" />
                      <input type="file" accept=".md,.txt" onChange={importMarkdown} className="hidden" />
                    </label>
                  </div>

                  {/* Editor/Preview Split */}
                  <div className="flex-1 grid grid-cols-1 gap-4 overflow-hidden" style={{ gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr' }}>
                    {/* Editor */}
                    <div className="flex flex-col overflow-hidden">
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
                        className="flex-1 w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white font-mono text-sm resize-none overflow-auto"
                        placeholder="Écrivez votre contenu ici... (Markdown supporté)

Raccourcis clavier:
Ctrl+B = Gras
Ctrl+I = Italique
Ctrl+K = Lien
Ctrl+Z = Annuler
Ctrl+Y = Rétablir"
                      />
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{wordCount} mots · {charCount} caractères · {readingTime} min de lecture</span>
                        <span>Ligne {formData.content.substring(0, textareaRef.current?.selectionStart || 0).split('\n').length}</span>
                      </div>
                    </div>

                    {/* Preview */}
                    {showPreview && (
                      <div className="overflow-auto">
                        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Aperçu</h3>
                          <div 
                            className="prose dark:prose-invert max-w-none text-gray-900 dark:text-white"
                            dangerouslySetInnerHTML={renderPreview()}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {!isFullscreen && (
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="submit"
                      disabled={saving || slugTaken}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg transition-colors"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      Prévisualiser l'article
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar - Only visible when not fullscreen */}
          {!isFullscreen && (
            <div className="lg:col-span-1 space-y-6">
              {/* Metadata */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  📋 Métadonnées
                </h3>
                
                <div className="space-y-4">
                  {/* Author */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Auteur *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-sm"
                      placeholder="Medessi Coovi"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Catégorie *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-sm"
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
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-sm"
                      placeholder="IA, Tech, Innovation"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Image mise en avant
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-sm"
                      placeholder="https://..."
                    />
                    {imagePreview && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                        <img
                          src={imagePreview}
                          alt="Aperçu"
                          className="w-full h-32 object-cover"
                          onError={() => setImagePreview('')}
                        />
                      </div>
                    )}
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Extrait ({formData.excerpt.length}/200)
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleChange}
                      maxLength={200}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-sm"
                      placeholder="Résumé de l'article..."
                    />
                  </div>

                  {/* Publishing options */}
                  <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                      />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        ⭐ Article à la une
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_published"
                        checked={formData.is_published}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                      />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        🌐 Publier
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  📊 Statistiques
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Mots:</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{wordCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Caractères:</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{charCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Temps de lecture:</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{readingTime} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Paragraphes:</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {formData.content.split(/\n\n+/).filter(Boolean).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* SEO Advanced */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  🎯 SEO Avancé
                </h3>
                
                <div className="space-y-4">
                  {/* Focus Keyword */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Mot-clé principal
                    </label>
                    <input
                      type="text"
                      name="focus_keyword"
                      value={formData.focus_keyword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-sm"
                      placeholder="Ex: marketing digital"
                    />
                  </div>

                  {/* Meta Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Titre SEO ({formData.meta_title.length}/60)
                    </label>
                    <input
                      type="text"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleChange}
                      maxLength={60}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-sm"
                      placeholder="Titre optimisé..."
                    />
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Description SEO ({formData.meta_description.length}/160)
                    </label>
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleChange}
                      maxLength={160}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white text-sm"
                      placeholder="Description optimisée..."
                    />
                  </div>
                </div>
              </div>

              {/* SEO Checklist */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  ✅ Checklist SEO
                </h3>
                <ul className="space-y-2 text-sm">
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
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Score SEO:</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
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

              {/* Markdown Help */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  📝 Aide Markdown
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="font-mono text-xs">
                    <span className="text-blue-600 dark:text-blue-400">**texte**</span> → <strong>gras</strong>
                  </div>
                  <div className="font-mono text-xs">
                    <span className="text-blue-600 dark:text-blue-400">*texte*</span> → <em>italique</em>
                  </div>
                  <div className="font-mono text-xs">
                    <span className="text-blue-600 dark:text-blue-400">## Titre</span> → Titre H2
                  </div>
                  <div className="font-mono text-xs">
                    <span className="text-blue-600 dark:text-blue-400">- Item</span> → Liste à puces
                  </div>
                  <div className="font-mono text-xs">
                    <span className="text-blue-600 dark:text-blue-400">[lien](url)</span> → Lien hypertexte
                  </div>
                  <div className="font-mono text-xs">
                    <span className="text-blue-600 dark:text-blue-400">![alt](url)</span> → Image
                  </div>
                  <div className="font-mono text-xs">
                    <span className="text-blue-600 dark:text-blue-400">`code`</span> → Code inline
                  </div>
                  <div className="font-mono text-xs">
                    <span className="text-blue-600 dark:text-blue-400">&gt; citation</span> → Citation
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  💡 Conseils de rédaction
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Utilisez des titres clairs (H2, H3)</li>
                  <li>• Ajoutez des images tous les 300 mots</li>
                  <li>• Rédigez des paragraphes courts (3-4 lignes)</li>
                  <li>• Incluez des listes à puces</li>
                  <li>• Ajoutez des liens pertinents</li>
                  <li>• Utilisez des exemples concrets</li>
                  <li>• Terminez par une conclusion claire</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen bottom bar */}
        {isFullscreen && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                <span>{wordCount} mots</span>
                <span>{charCount} caractères</span>
                <span>{readingTime} min</span>
                <span>Score SEO: {Math.round((
                  [
                    wordCount >= 300,
                    formData.excerpt.length >= 150,
                    formData.tags.split(',').filter(Boolean).length >= 3,
                    formData.image_url,
                    formData.focus_keyword
                  ].filter(Boolean).length / 5
                ) * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-colors"
                >
                  Quitter plein écran
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
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