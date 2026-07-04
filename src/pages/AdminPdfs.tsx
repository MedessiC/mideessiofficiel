import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, Plus, Edit2, Trash2, Save, X, Palette, Sparkles, Users, Loader, LogOut,
  TrendingUp, Award, Download, Clock, AlertCircle, CheckCircle, FileText, Upload, Image, ExternalLink
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { uploadFileToCloudinary } from '../lib/cloudinary';
import { isCloudinaryUrl } from '../utils/cloudinaryImage';

type Book = {
  id: string | null;
  title: string;
  category: string;
  description: string;
  price: number;
  author: string;
  cover_color: string;
  cover_image: string;
  article_url: string;
  buy_url: string;
  pdf_url: string;
  week_added: string;
  is_new: boolean;
  is_bestseller: boolean;
  rating: number;
  students: number;
  pages: number;
  level: string;
  created_at?: string;
};

type Toast = {
  id: string;
  type: 'success' | 'error';
  message: string;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Upload states
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<{ pdf: number; cover: number } | null>(null);
  const [uploadHint, setUploadHint] = useState('');

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Book>({
    id: null,
    title: '',
    category: 'mobile',
    description: '',
    price: 1000,
    author: 'MIDEESSI Team',
    cover_color: 'from-blue-500 to-blue-700',
    cover_image: '',
    article_url: '',
    buy_url: '',
    pdf_url: '',
    week_added: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }),
    is_new: true,
    is_bestseller: false,
    rating: 4.5,
    students: 0,
    pages: 50,
    level: 'Débutant'
  });

  const categories = [
    { id: 'mobile', name: 'Mobile', icon: <Download className="w-4 h-4" /> },
    { id: 'cybersec', name: 'Cybersec', icon: <Award className="w-4 h-4" /> },
    { id: 'webdev', name: 'Web Dev', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'design', name: 'Design', icon: <Palette className="w-4 h-4" /> },
    { id: 'business', name: 'Business', icon: <Users className="w-4 h-4" /> },
    { id: 'data', name: 'Data & IA', icon: <Clock className="w-4 h-4" /> },
  ];

  const coverColors = [
    { id: 'from-blue-500 to-blue-700', name: 'Bleu', preview: 'bg-gradient-to-br from-blue-500 to-blue-700' },
    { id: 'from-red-500 to-red-700', name: 'Rouge', preview: 'bg-gradient-to-br from-red-500 to-red-700' },
    { id: 'from-green-500 to-green-700', name: 'Vert', preview: 'bg-gradient-to-br from-green-500 to-green-700' },
    { id: 'from-purple-500 to-purple-700', name: 'Violet', preview: 'bg-gradient-to-br from-purple-500 to-purple-700' },
    { id: 'from-yellow-500 to-yellow-700', name: 'Jaune', preview: 'bg-gradient-to-br from-yellow-500 to-yellow-700' },
    { id: 'from-indigo-500 to-indigo-700', name: 'Indigo', preview: 'bg-gradient-to-br from-indigo-500 to-indigo-700' },
    { id: 'from-pink-500 to-pink-700', name: 'Rose', preview: 'bg-gradient-to-br from-pink-500 to-pink-700' },
    { id: 'from-teal-500 to-teal-700', name: 'Turquoise', preview: 'bg-gradient-to-br from-teal-500 to-teal-700' },
    { id: 'from-[#191970] to-[#2d2daa]', name: 'Midnight', preview: 'bg-gradient-to-br from-[#191970] to-[#2d2daa]' },
  ];

  const levels = [
    { id: 'Débutant', name: 'Débutant', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { id: 'Intermédiaire', name: 'Intermédiaire', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    { id: 'Avancé', name: 'Avancé', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  ];

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsAuthenticating(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate('/admin/login');
        return;
      }

      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }

      await fetchBooks();
      setIsAuthenticating(false);
    } catch (err) {
      console.error('Erreur auth:', err);
      navigate('/admin/login');
    }
  };

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setBooks(data);
    } catch (err) {
      console.error('Erreur chargement:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  // ── Cover image file picker ───────────────────────────────────────────────
  const handleCoverFileChange = (file: File | null) => {
    setCoverFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCoverPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setCoverPreview('');
    }
  };

  // ── PDF file picker ───────────────────────────────────────────────────────
  const handlePdfFileChange = (file: File | null) => {
    setPdfFile(file);
    setUploadHint(file ? `📄 ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} Mo)` : '');
  };

  // ── Upload to Cloudinary ──────────────────────────────────────────────────
  const uploadToCloudinary = async (file: File, folder: string, progressKey: 'pdf' | 'cover', resourceType: 'auto' | 'raw' = 'auto') => {
    setUploadProgress(prev => ({ ...(prev ?? { pdf: 0, cover: 0 }), [progressKey]: 10 }));
    console.debug('[AdminPdfs] uploadToCloudinary', { fileName: file.name, fileType: file.type, fileSize: file.size, folder, progressKey, resourceType });
    try {
      const url = await uploadFileToCloudinary(file, folder, resourceType);
      console.debug('[AdminPdfs] uploadToCloudinary succeeded', { url, folder, resourceType });
      setUploadProgress(prev => ({ ...(prev ?? { pdf: 0, cover: 0 }), [progressKey]: 100 }));
      return url;
    } catch (err) {
      console.error('[AdminPdfs] uploadToCloudinary failed', { err, folder, progressKey, resourceType, fileName: file.name });
      setUploadProgress(null);
      throw err;
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.debug('[AdminPdfs] handleSubmit start', {
      editingBookId: editingBook?.id ?? null,
      formData: {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        price: formData.price,
        author: formData.author,
        cover_color: formData.cover_color,
        cover_image: formData.cover_image,
        article_url: formData.article_url,
        buy_url: formData.buy_url,
        pdf_url: formData.pdf_url,
        week_added: formData.week_added,
        is_new: formData.is_new,
        is_bestseller: formData.is_bestseller,
        rating: formData.rating,
        students: formData.students,
        pages: formData.pages,
        level: formData.level,
      },
      pdfFile: pdfFile ? { name: pdfFile.name, type: pdfFile.type, size: pdfFile.size } : null,
      coverFile: coverFile ? { name: coverFile.name, type: coverFile.type, size: coverFile.size } : null,
    });

    if (!formData.title || !formData.description) {
      addToast('error', 'Le titre et la description sont obligatoires');
      return;
    }

    if (!editingBook && !pdfFile && !formData.pdf_url) {
      addToast('error', 'Ajoutez un fichier PDF ou un lien direct pour publier');
      return;
    }

    if (formData.pdf_url && !isCloudinaryUrl(formData.pdf_url)) {
      addToast('error', 'Le lien PDF doit être hébergé sur Cloudinary');
      return;
    }

    if (formData.cover_image && !isCloudinaryUrl(formData.cover_image)) {
      addToast('error', 'L’image de couverture doit être hébergée sur Cloudinary');
      return;
    }

    setLoading(true);
    setUploadProgress({ pdf: 0, cover: 0 });

    try {
      let pdfUrl = formData.pdf_url;
      let coverImageUrl = formData.cover_image;

      // Upload PDF to Cloudinary as raw
      if (pdfFile) {
        addToast('success', '📤 Upload du PDF en cours...');
        console.debug('[AdminPdfs] starting Cloudinary PDF upload', { fileName: pdfFile.name, fileType: pdfFile.type });
        pdfUrl = await uploadToCloudinary(pdfFile, 'mideessi/pdfs', 'pdf', 'raw');
        console.debug('[AdminPdfs] Cloudinary PDF upload completed', { pdfUrl });
      }

      // Upload cover image to Cloudinary as image
      if (coverFile) {
        addToast('success', '🖼️ Upload de la couverture en cours...');
        console.debug('[AdminPdfs] starting Cloudinary cover upload', { fileName: coverFile.name, fileType: coverFile.type });
        coverImageUrl = await uploadToCloudinary(coverFile, 'mideessi/covers', 'cover', 'auto');
        console.debug('[AdminPdfs] Cloudinary cover upload completed', { coverImageUrl });
      }

      if (!pdfUrl) {
        addToast('error', 'Le lien PDF est requis');
        return;
      }

      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        price: formData.price,
        author: formData.author,
        cover_color: formData.cover_color,
        cover_image: coverImageUrl,
        article_url: formData.article_url,
        buy_url: formData.buy_url,
        pdf_url: pdfUrl,
        week_added: formData.week_added,
        is_new: formData.is_new,
        is_bestseller: formData.is_bestseller,
        rating: formData.rating,
        students: formData.students,
        pages: formData.pages,
        level: formData.level,
      };

      console.debug('[AdminPdfs] supabase payload ready', { payload, editing: Boolean(editingBook) });

      if (editingBook) {
        const { error } = await supabase
          .from('books')
          .update(payload)
          .eq('id', editingBook.id);

        if (error) throw error;
        setBooks(books.map(b => b.id === editingBook.id ? { ...formData, id: editingBook.id, pdf_url: pdfUrl, cover_image: coverImageUrl } : b));
        addToast('success', '✅ PDF mis à jour avec succès');
      } else {
        const { error } = await supabase
          .from('books')
          .insert([{ ...payload, created_at: new Date().toISOString() }]);

        if (error) throw error;
        console.debug('[AdminPdfs] supabase insert succeeded');
        await fetchBooks();
        addToast('success', '🚀 PDF publié avec succès sur la bibliothèque');
      }

      resetForm();
    } catch (err: any) {
      console.error('Erreur publication:', err, {
        editingBookId: editingBook?.id ?? null,
        formData: {
          title: formData.title,
          pdf_url: formData.pdf_url,
          cover_image: formData.cover_image,
        },
        pdfFile: pdfFile ? { name: pdfFile.name, type: pdfFile.type, size: pdfFile.size } : null,
        coverFile: coverFile ? { name: coverFile.name, type: coverFile.type, size: coverFile.size } : null,
      });
      addToast('error', err.message || 'Erreur lors de la publication');
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      addToast('error', 'ID du PDF invalide');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce PDF ?')) return;

    try {
      const { data, error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)
        .select('*');

      if (error) throw error;
      if (!data || data.length === 0) {
        addToast('error', 'Aucun PDF supprimé : vérifiez l’ID');
        console.warn('Suppression réussie mais aucune ligne retournée pour id:', id);
        return;
      }

      setBooks(books.filter(b => b.id !== id));
      addToast('success', '🗑️ PDF supprimé');
    } catch (err: any) {
      console.error('Erreur suppression:', err);
      addToast('error', err.message || 'Erreur lors de la suppression');
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData(book);
    setCoverPreview(book.cover_image || '');
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      title: '',
      category: 'mobile',
      description: '',
      price: 1000,
      author: 'MIDEESSI Team',
      cover_color: 'from-blue-500 to-blue-700',
      cover_image: '',
      article_url: '',
      buy_url: '',
      pdf_url: '',
      week_added: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }),
      is_new: true,
      is_bestseller: false,
      rating: 4.5,
      students: 0,
      pages: 50,
      level: 'Débutant'
    });
    setPdfFile(null);
    setCoverFile(null);
    setCoverPreview('');
    setUploadHint('');
    setUploadProgress(null);
    setEditingBook(null);
    setShowForm(false);
  };

  const getLevelColor = (level: string) => {
    const levelObj = levels.find(l => l.id === level);
    return levelObj?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-14 h-14 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
          <p className="text-gray-600 dark:text-gray-300 font-semibold">Vérification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-20">
      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm px-4 sm:px-0">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-right-4 ${
              toast.type === 'success'
                ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100 border border-red-200 dark:border-red-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 p-2 bg-[var(--brand-midnight)] rounded-lg">
                <BookOpen className="w-6 h-6 text-[var(--brand-gold)]" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">Admin PDFs</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Gestion des ebooks · Cloudinary</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center justify-center gap-2 bg-[var(--brand-midnight)] hover:bg-[var(--brand-midnight-dark)] text-[var(--brand-gold)] font-semibold px-4 py-2 rounded-lg transition-colors min-h-10 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Nouveau PDF</span>
                <span className="sm:hidden">Nouveau</span>
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-10"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${showForm ? 'hidden' : ''}`}>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: 'Total', value: books.length, icon: BookOpen, color: 'blue' },
            { label: 'Nouveaux', value: books.filter(b => b.is_new).length, icon: Sparkles, color: 'yellow' },
            { label: 'Bestsellers', value: books.filter(b => b.is_bestseller).length, icon: Award, color: 'red' },
            { label: 'Étudiants', value: books.reduce((sum, b) => sum + b.students, 0), icon: Users, color: 'green' },
          ].map((stat) => {
            const Icon = stat.icon;
            const colorClass = {
              blue: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-200',
              yellow: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-200',
              red: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-700 dark:text-red-200',
              green: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-700 dark:text-green-200',
            }[stat.color];

            return (
              <div key={stat.label} className={`p-4 rounded-lg border ${colorClass}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium opacity-75">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 opacity-20" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Books Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Bibliothèque ({books.length})</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              Stockage : Cloudinary
            </span>
          </div>

          {books.length === 0 ? (
            <div className="p-8 sm:p-12 text-center space-y-4">
              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" />
              <div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Aucun PDF publié</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Créez votre premier ebook pour commencer</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="group flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-750 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Cover */}
                  <div className={`relative h-40 bg-gradient-to-br ${book.cover_color} flex items-center justify-center overflow-hidden`}>
                    {book.cover_image ? (
                      <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    ) : (
                      <BookOpen className="w-12 h-12 text-white opacity-50" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                    {/* Badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {book.is_new && <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full">✨ NEW</span>}
                      {book.is_bestseller && <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">🔥 BEST</span>}
                    </div>

                    {/* Level */}
                    <div className="absolute bottom-2 left-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${getLevelColor(book.level)}`}>
                        {book.level}
                      </span>
                    </div>

                    {/* PDF indicator */}
                    {book.pdf_url && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <FileText className="w-3 h-3" /> PDF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col">
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 text-sm mb-1">{book.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{book.author} · {book.category}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{book.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-200 dark:border-gray-700 mb-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Sparkles className="w-3 h-3 text-yellow-400" />
                          <span className="font-bold text-xs text-gray-700 dark:text-gray-300">{book.rating}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">Note</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="w-3 h-3 text-blue-500" />
                          <span className="font-bold text-xs text-gray-700 dark:text-gray-300">{book.students}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">Lecteurs</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <BookOpen className="w-3 h-3 text-green-500" />
                          <span className="font-bold text-xs text-gray-700 dark:text-gray-300">{book.pages}p</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">Pages</p>
                      </div>
                    </div>

                    <p className="text-base font-bold text-[var(--brand-midnight)] dark:text-[var(--brand-gold)] mb-3">{book.price} FCFA</p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-auto flex-wrap">
                      {/* View public page */}
                      <Link
                        to={`/library/${book.id}`}
                        target="_blank"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-2 bg-[var(--brand-midnight)]/10 hover:bg-[var(--brand-midnight)]/20 text-[var(--brand-midnight)] dark:text-[var(--brand-gold)] rounded-lg font-medium text-xs transition-colors"
                        title="Voir la page publique"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Voir</span>
                      </Link>
                      <button
                        onClick={() => handleEdit(book)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/40 rounded-lg font-medium text-xs transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDelete(book.id!)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/40 rounded-lg font-medium text-xs transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Suppr.</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Form Page ───────────────────────────────────────────────────────── */}
      {showForm && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col min-h-[calc(100vh-10rem)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-[var(--brand-midnight)] text-white">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[var(--brand-gold)]" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                    {editingBook ? 'Modifier le PDF' : 'Publier un nouveau PDF'}
                  </h2>
                  <p className="text-sm text-[var(--brand-gold)] opacity-90">
                    Utilisez le formulaire pour publier ou mettre à jour un ebook Cloudinary.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="inline-flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-6">

                {/* ── Preview banner ── */}
                <div className="rounded-2xl border border-[var(--brand-midnight)]/20 bg-[var(--brand-midnight)]/5 p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 text-[var(--brand-midnight)]" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--brand-midnight)] dark:text-[var(--brand-gold)]">
                        {formData.title || '— Titre du livre —'}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {formData.category} · {formData.level} · {formData.price} FCFA · {formData.pages}p
                      </p>
                      {(pdfFile || formData.pdf_url) && (
                        <p className="mt-1 text-xs text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {pdfFile ? `PDF prêt : ${pdfFile.name}` : 'PDF existant configuré'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Section: Infos de base ── */}
                <section className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    📚 Informations générales
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Titre du livre *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-midnight)] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Ex: Guide complet du développement mobile"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Auteur
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-midnight)] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="MIDEESSI Team"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Catégorie *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-midnight)] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Niveau *</label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-midnight)] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        {levels.map(lvl => (
                          <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-midnight)] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="Décrivez le contenu du livre, ce que le lecteur va apprendre..."
                      required
                    />
                  </div>
                </section>

                {/* ── Section: Fichiers (Cloudinary) ── */}
                <section className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    ☁️ Fichiers (Cloudinary)
                  </h3>

                  {/* PDF Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Fichier PDF *
                    </label>
                    <div
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-[var(--brand-midnight)] transition-colors cursor-pointer group"
                      onClick={() => pdfInputRef.current?.click()}
                    >
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => handlePdfFileChange(e.target.files?.[0] || null)}
                      />
                      <Upload className="w-8 h-8 text-gray-400 group-hover:text-[var(--brand-midnight)] mx-auto mb-2 transition-colors" />
                      {pdfFile ? (
                        <div>
                          <p className="text-sm font-semibold text-green-600">{pdfFile.name}</p>
                          <p className="text-xs text-gray-500">{(pdfFile.size / 1024 / 1024).toFixed(1)} Mo · Sera uploadé sur Cloudinary</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Cliquez pour sélectionner un PDF
                          </p>
                          <p className="text-xs text-gray-400 mt-1">ou glissez-déposez ici</p>
                          {uploadHint && (
                            <p className="text-xs text-gray-500 mt-2">{uploadHint}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* URL fallback for existing books */}
                    {(editingBook || formData.pdf_url) && (
                      <div className="mt-3">
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Ou lien PDF Cloudinary direct (si vous ne ré-uploadez pas)
                        </label>
                        <input
                          type="url"
                          value={formData.pdf_url}
                          onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="https://res.cloudinary.com/..."
                        />
                        {formData.pdf_url && !pdfFile && (
                          <a href={formData.pdf_url} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 mt-1 text-xs text-blue-600 hover:underline">
                            <ExternalLink className="w-3 h-3" /> Voir le PDF actuel
                          </a>
                        )}
                      </div>
                    )}

                    {/* Progress bars */}
                    {uploadProgress && (
                      <div className="mt-3 space-y-2">
                        {uploadProgress.pdf > 0 && (
                          <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Upload PDF…</span>
                              <span>{uploadProgress.pdf}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[var(--brand-midnight)] transition-all duration-500 rounded-full"
                                style={{ width: `${uploadProgress.pdf}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {uploadProgress.cover > 0 && (
                          <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Upload couverture…</span>
                              <span>{uploadProgress.cover}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[var(--brand-gold)] transition-all duration-500 rounded-full"
                                style={{ width: `${uploadProgress.cover}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Cover Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Image de couverture (optionnel)
                    </label>
                    <div className="flex gap-4 items-start">
                      {/* Preview */}
                      <div
                        className={`w-24 h-32 rounded-lg flex-shrink-0 overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-[var(--brand-gold)] transition-colors flex items-center justify-center bg-gradient-to-br ${formData.cover_color}`}
                        onClick={() => coverInputRef.current?.click()}
                      >
                        {coverPreview ? (
                          <img src={coverPreview} alt="Couverture" className="w-full h-full object-cover" />
                        ) : (
                          <Image className="w-6 h-6 text-white/60" />
                        )}
                      </div>

                      <div className="flex-1">
                        <input
                          ref={coverInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleCoverFileChange(e.target.files?.[0] || null)}
                        />
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-[var(--brand-gold)] hover:text-[var(--brand-midnight)] dark:hover:text-[var(--brand-gold)] transition-colors text-left flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          {coverFile ? coverFile.name : 'Choisir une image…'}
                        </button>
                        <p className="text-xs text-gray-400 mt-2">
                          JPG, PNG, WebP. Max 5Mo. Uploadée sur Cloudinary.
                        </p>
                        {/* Or URL */}
                        <input
                          type="url"
                          value={coverFile ? '' : formData.cover_image}
                          onChange={(e) => { setFormData({ ...formData, cover_image: e.target.value }); setCoverPreview(e.target.value); }}
                          className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                          placeholder="Ou entrez une URL Cloudinary..."
                          disabled={!!coverFile}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── Section: Apparence ── */}
                <section className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    🎨 Couleur de fond (si pas d'image)
                  </h3>
                  <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                    {coverColors.map(color => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, cover_color: color.id })}
                        className={`h-10 rounded-lg ${color.preview} transition-all ${
                          formData.cover_color === color.id ? 'ring-4 ring-offset-2 ring-[var(--brand-gold)] dark:ring-offset-gray-800 scale-110' : 'hover:scale-105'
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </section>

                {/* ── Section: Liens (optionnels) ── */}
                <section className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    🔗 Liens externes (optionnels)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Article de blog associé
                      </label>
                      <input
                        type="url"
                        value={formData.article_url}
                        onChange={(e) => setFormData({ ...formData, article_url: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-midnight)] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Lien d'achat
                      </label>
                      <input
                        type="url"
                        value={formData.buy_url}
                        onChange={(e) => setFormData({ ...formData, buy_url: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-midnight)] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </section>

                {/* ── Section: Métadonnées ── */}
                <section className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    📊 Statistiques
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Prix (FCFA)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Pages</label>
                      <input
                        type="number"
                        value={formData.pages}
                        onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Note /5</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.5 })}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        min="0" max="5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Lecteurs</label>
                      <input
                        type="number"
                        value={formData.students}
                        onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Semaine d'ajout</label>
                    <input
                      type="text"
                      value={formData.week_added}
                      onChange={(e) => setFormData({ ...formData, week_added: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Ex: 4 juillet 2026"
                    />
                  </div>
                </section>

                {/* ── Section: Badges ── */}
                <section className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    🏷️ Badges
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-yellow-400 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_new}
                        onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                        className="w-5 h-5 rounded accent-[var(--brand-gold)]"
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">✨ Nouveau</p>
                        <p className="text-xs text-gray-500">Badge "NEW" sur la carte</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-400 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_bestseller}
                        onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                        className="w-5 h-5 rounded accent-red-500"
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">🔥 Bestseller</p>
                        <p className="text-xs text-gray-500">Badge "BEST" + mis en avant</p>
                      </div>
                    </label>
                  </div>
                </section>
              </div>

              {/* Form Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-4 sm:p-6 flex-shrink-0 flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--brand-midnight)] hover:bg-[var(--brand-midnight-dark)] text-[var(--brand-gold)] font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Publication…</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{editingBook ? 'Mettre à jour' : '🚀 Publier'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
