import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Plus, Edit2, Trash2, Save, X, Eye, Star, Users, Loader, LogOut, TrendingUp, Award, Download, Clock, AlertCircle, CheckCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type Book = {
  id: number | null;
  title: string;
  category: string;
  description: string;
  price: number;
  author: string;
  cover_color: string;
  cover_image: string;
  article_url: string;
  buy_url: string;
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
    { id: 'design', name: 'Design', icon: <Star className="w-4 h-4" /> },
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
  ];

  const levels = [
    { id: 'Débutant', name: 'Débutant', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { id: 'Intermédiaire', name: 'Intermédiaire', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    { id: 'Avancé', name: 'Avancé', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  ];

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.article_url || !formData.buy_url || !formData.description) {
      addToast('error', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      if (editingBook) {
        const { error } = await supabase
          .from('books')
          .update({
            title: formData.title,
            category: formData.category,
            description: formData.description,
            price: formData.price,
            author: formData.author,
            cover_color: formData.cover_color,
            cover_image: formData.cover_image,
            article_url: formData.article_url,
            buy_url: formData.buy_url,
            week_added: formData.week_added,
            is_new: formData.is_new,
            is_bestseller: formData.is_bestseller,
            rating: formData.rating,
            students: formData.students,
            pages: formData.pages,
            level: formData.level,
          })
          .eq('id', editingBook.id);

        if (error) throw error;
        setBooks(books.map(b => b.id === editingBook.id ? { ...formData, id: editingBook.id } : b));
        addToast('success', 'PDF mis à jour ✓');
      } else {
        const { error } = await supabase
          .from('books')
          .insert([
            {
              title: formData.title,
              category: formData.category,
              description: formData.description,
              price: formData.price,
              author: formData.author,
              cover_color: formData.cover_color,
              cover_image: formData.cover_image,
              article_url: formData.article_url,
              buy_url: formData.buy_url,
              week_added: formData.week_added,
              is_new: formData.is_new,
              is_bestseller: formData.is_bestseller,
              rating: formData.rating,
              students: formData.students,
              pages: formData.pages,
              level: formData.level,
              created_at: new Date().toISOString(),
            }
          ]);

        if (error) throw error;
        await fetchBooks();
        addToast('success', 'PDF publié ✓');
      }

      resetForm();
    } catch (err: any) {
      console.error('Erreur publication:', err);
      addToast('error', err.message || 'Erreur lors de la publication');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce PDF ?')) return;
    
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBooks(books.filter(b => b.id !== id));
      addToast('success', 'PDF supprimé ✓');
    } catch (err: any) {
      console.error('Erreur suppression:', err);
      addToast('error', err.message || 'Erreur lors de la suppression');
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData(book);
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
      week_added: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }),
      is_new: true,
      is_bestseller: false,
      rating: 4.5,
      students: 0,
      pages: 50,
      level: 'Débutant'
    });
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
      <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
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
              <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">Admin PDFs</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Gestion des contenus</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg transition-colors min-h-10 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Nouveau</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: 'Total', value: books.length, icon: BookOpen, color: 'blue' },
            { label: 'Nouveaux', value: books.filter(b => b.is_new).length, icon: Star, color: 'yellow' },
            { label: 'Best', value: books.filter(b => b.is_bestseller).length, icon: Award, color: 'red' },
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
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Vos PDFs</h2>
          </div>

          {books.length === 0 ? (
            <div className="p-8 sm:p-12 text-center space-y-4">
              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" />
              <div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Aucun PDF publié</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Créez votre premier PDF pour commencer</p>
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
                      <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
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
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col">
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 text-sm mb-2">{book.title}</h3>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{book.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-200 dark:border-gray-700 mb-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="font-bold text-xs">{book.rating}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="w-3 h-3 text-blue-500" />
                          <span className="font-bold text-xs">{book.students}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <BookOpen className="w-3 h-3 text-green-500" />
                          <span className="font-bold text-xs">{book.pages}p</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">{book.price} F</p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-auto">
                      <a
                        href={book.article_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg font-medium text-sm transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Voir</span>
                      </a>
                      <button
                        onClick={() => handleEdit(book)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800 rounded-lg font-medium text-sm transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(book.id!)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg font-medium text-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Del</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 w-full sm:max-w-3xl sm:rounded-2xl shadow-2xl sm:my-8 h-screen sm:h-auto max-h-screen sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {editingBook ? '✏️ Modifier' : '✨ Nouveau PDF'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-6">
                {/* Section: Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-b pb-2">📚 Infos</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Titre *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Titre du PDF"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Catégorie *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
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
                        onChange={(e) => setFormData({...formData, level: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        {levels.map(lvl => (
                          <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="Décrivez le PDF..."
                      required
                    />
                  </div>
                </div>

                {/* Section: Appearance */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-b pb-2">🎨 Apparence</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Couleur</label>
                    <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                      {coverColors.map(color => (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setFormData({...formData, cover_color: color.id})}
                          className={`h-12 rounded-lg ${color.preview} transition-all ${
                            formData.cover_color === color.id ? 'ring-4 ring-offset-2 ring-blue-400 dark:ring-offset-gray-800' : 'hover:scale-105'
                          }`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Image (optionnel)</label>
                    <input
                      type="url"
                      value={formData.cover_image}
                      onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="URL de l'image"
                    />
                  </div>
                </div>

                {/* Section: URLs & Metadata */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-b pb-2">🔗 Liens</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Article *</label>
                      <input
                        type="url"
                        value={formData.article_url}
                        onChange={(e) => setFormData({...formData, article_url: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="URL article"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Achat *</label>
                      <input
                        type="url"
                        value={formData.buy_url}
                        onChange={(e) => setFormData({...formData, buy_url: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="URL achat"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Prix</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 1000})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Pages</label>
                      <input
                        type="number"
                        value={formData.pages}
                        onChange={(e) => setFormData({...formData, pages: parseInt(e.target.value) || 50})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Note</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.rating}
                        onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value) || 4.5})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        min="0"
                        max="5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Étudiants</label>
                      <input
                        type="number"
                        value={formData.students}
                        onChange={(e) => setFormData({...formData, students: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Semaine</label>
                      <input
                        type="text"
                        value={formData.week_added}
                        onChange={(e) => setFormData({...formData, week_added: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="Ex: 15 janvier"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Auteur</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="MIDEESSI Team"
                    />
                  </div>
                </div>

                {/* Section: Badges */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-b pb-2">🏷️ Badges</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-yellow-400 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_new}
                        onChange={(e) => setFormData({...formData, is_new: e.target.checked})}
                        className="w-5 h-5 rounded"
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">✨ Nouveau</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Badge "NOUVEAU"</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-red-400 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_bestseller}
                        onChange={(e) => setFormData({...formData, is_bestseller: e.target.checked})}
                        className="w-5 h-5 rounded"
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">🔥 Bestseller</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Badge "BEST"</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 flex-shrink-0 flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span className="hidden sm:inline">Publication...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{editingBook ? 'Mettre à jour' : 'Publier'}</span>
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
