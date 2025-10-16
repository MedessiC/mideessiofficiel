import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Plus, Edit2, Trash2, Save, X, ExternalLink,
  Eye, Calendar, Tag, Star, Users, Loader, Image as ImageIcon, 
  LogOut, TrendingUp, Clock, Award, Download
} from 'lucide-react';
import { supabase } from '../lib/supabase';
// Simuler supabase pour la démo


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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
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
    { id: 'mobile', name: 'Tutoriels Mobile', icon: <Download className="w-4 h-4" /> },
    { id: 'cybersec', name: 'Cybersécurité', icon: <Award className="w-4 h-4" /> },
    { id: 'webdev', name: 'Développement Web', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'design', name: 'Design & UI/UX', icon: <Star className="w-4 h-4" /> },
    { id: 'business', name: 'Tech Business', icon: <Users className="w-4 h-4" /> },
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
    { id: 'Débutant', name: 'Débutant', color: 'bg-green-100 text-green-800' },
    { id: 'Intermédiaire', name: 'Intermédiaire', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'Avancé', name: 'Avancé', color: 'bg-red-100 text-red-800' },
  ];
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
      console.error('Erreur lors de la vérification:', err);
      navigate('/admin/login');
    }
  };

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des livres :', error.message);
        return;
      }

      if (data) setBooks(data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.article_url || !formData.buy_url) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      if (editingBook) {
        setBooks(books.map(b => b.id === editingBook.id ? { ...formData, id: editingBook.id } : b));
        alert('PDF mis à jour avec succès !');
      } else {
        const newBook = { ...formData, id: Date.now(), created_at: new Date().toISOString() };
        setBooks([newBook, ...books]);
        alert('PDF publié avec succès !');
      }

      resetForm();
    } catch (err: any) {
      console.error('Erreur:', err);
      alert(`Erreur: ${err.message || 'Erreur lors de la publication'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce PDF ?')) return;
    setBooks(books.filter(b => b.id !== id));
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
    return levelObj?.color || 'bg-gray-100 text-gray-800';
  };

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-semibold">
            Vérification de l'authentification...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-yellow-400" />
              <div>
                <h1 className="text-2xl font-bold">MIDEESSI Learn - Admin</h1>
                <p className="text-blue-200 text-sm">Gestion des PDFs</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-lg transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Nouveau PDF
              </button>
              <button
                onClick={() => alert('Déconnexion')}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-3 rounded-lg transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Total PDFs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{books.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Nouveaux</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {books.filter(b => b.is_new).length}
                </p>
              </div>
              <Star className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Bestsellers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {books.filter(b => b.is_bestseller).length}
                </p>
              </div>
              <Star className="w-12 h-12 text-red-500 fill-red-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Étudiants totaux</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {books.reduce((sum, b) => sum + b.students, 0)}
                </p>
              </div>
              <Users className="w-12 h-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Books List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Liste des PDFs</h2>
          </div>
          
          {books.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">Aucun PDF publié</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Cliquez sur "Nouveau PDF" pour commencer</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">PDF</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Niveau</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Stats</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Prix</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {books.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-16 rounded bg-gradient-to-br ${book.cover_color} flex items-center justify-center flex-shrink-0`}>
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{book.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{book.week_added}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {categories.find(c => c.id === book.category)?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(book.level)}`}>
                          {book.level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold">{book.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold">{book.students}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{book.price} F</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {book.is_new && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                              ✨ Nouveau
                            </span>
                          )}
                          {book.is_bestseller && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                              🔥 Best
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={book.article_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="Voir l'article"
                          >
                            <Eye className="w-5 h-5" />
                          </a>
                          <button
                            onClick={() => handleEdit(book)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(book.id!)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingBook ? '✏️ Modifier le PDF' : '✨ Nouveau PDF'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Informations de base */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b pb-2">📚 Informations de base</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Titre du PDF *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                    placeholder="Ex: Guide complet du développement mobile"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Catégorie *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Niveau *
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({...formData, level: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
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
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Décrivez le contenu du PDF..."
                    required
                  />
                </div>
              </div>

              {/* Apparence */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b pb-2">🎨 Apparence</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Couleur de couverture
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {coverColors.map(color => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setFormData({...formData, cover_color: color.id})}
                        className={`h-16 rounded-lg ${color.preview} flex items-center justify-center transition-all ${
                          formData.cover_color === color.id ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-105'
                        }`}
                      >
                        {formData.cover_color === color.id && (
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <span className="text-gray-900 font-bold">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    URL de l'image de couverture (optionnel)
                  </label>
                  <input
                    type="url"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://exemple.com/image.jpg"
                  />
                </div>
              </div>

              {/* Liens et métadonnées */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b pb-2">🔗 Liens et métadonnées</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Lien article *
                    </label>
                    <input
                      type="url"
                      value={formData.article_url}
                      onChange={(e) => setFormData({...formData, article_url: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://mideessi.com/article"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Lien d'achat *
                    </label>
                    <input
                      type="url"
                      value={formData.buy_url}
                      onChange={(e) => setFormData({...formData, buy_url: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://mideessi.com/acheter"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Prix (FCFA)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 1000})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Nombre de pages
                    </label>
                    <input
                      type="number"
                      value={formData.pages}
                      onChange={(e) => setFormData({...formData, pages: parseInt(e.target.value) || 50})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Note (sur 5)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value) || 4.5})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="0"
                      max="5"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Nombre d'étudiants
                    </label>
                    <input
                      type="number"
                      value={formData.students}
                      onChange={(e) => setFormData({...formData, students: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Semaine d'ajout
                    </label>
                    <input
                      type="text"
                      value={formData.week_added}
                      onChange={(e) => setFormData({...formData, week_added: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Ex: 15 janvier 2025"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Auteur
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="MIDEESSI Team"
                  />
                </div>
              </div>

              {/* Badges et statuts */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b pb-2">🏷️ Badges et statuts</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-yellow-400 transition-colors">
                    <input
                      type="checkbox"
                      id="is_new"
                      checked={formData.is_new}
                      onChange={(e) => setFormData({...formData, is_new: e.target.checked})}
                      className="w-5 h-5 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                    />
                    <label htmlFor="is_new" className="flex items-center gap-2 cursor-pointer">
                      <span className="text-2xl">✨</span>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">Nouveau</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Afficher le badge "NOUVEAU"</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-red-400 transition-colors">
                    <input
                      type="checkbox"
                      id="is_bestseller"
                      checked={formData.is_bestseller}
                      onChange={(e) => setFormData({...formData, is_bestseller: e.target.checked})}
                      className="w-5 h-5 text-red-400 border-gray-300 rounded focus:ring-red-400"
                    />
                    <label htmlFor="is_bestseller" className="flex items-center gap-2 cursor-pointer">
                      <span className="text-2xl">🔥</span>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">Bestseller</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Afficher le badge "BEST"</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Aperçu */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b pb-2">👁️ Aperçu</h3>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden max-w-sm mx-auto">
                    <div className="relative h-56">
                      {formData.cover_image ? (
                        <img 
                          src={formData.cover_image} 
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const fallback = parent.querySelector('.fallback-cover');
                              if (fallback) (fallback as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div className={`fallback-cover absolute inset-0 bg-gradient-to-br ${formData.cover_color} ${formData.cover_image ? 'hidden' : 'flex'} flex-col items-center justify-center`}>
                        <BookOpen className="w-20 h-20 text-white opacity-90 mb-2" />
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                          <p className="text-white font-bold text-sm">📱 100% Mobile</p>
                        </div>
                      </div>

                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {formData.is_new && (
                          <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            ✨ NOUVEAU
                          </div>
                        )}
                        {formData.is_bestseller && (
                          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            🔥 BEST
                          </div>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getLevelColor(formData.level)}`}>
                          {formData.level}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {formData.title || 'Titre du PDF'}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                        {formData.description || 'Description du PDF...'}
                      </p>

                      <div className="grid grid-cols-3 gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-sm">{formData.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">Note</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="font-bold text-sm">{formData.students}</span>
                          </div>
                          <p className="text-xs text-gray-500">Étudiants</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <BookOpen className="w-4 h-4 text-green-500" />
                            <span className="font-bold text-sm">{formData.pages}</span>
                          </div>
                          <p className="text-xs text-gray-500">Pages</p>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-yellow-500">
                          {formData.price}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-all shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Publication...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingBook ? 'Mettre à jour' : 'Publier le PDF'}
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