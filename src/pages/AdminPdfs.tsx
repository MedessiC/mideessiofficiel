import { useState, useEffect } from 'react';
import {
  BookOpen, Plus, Edit2, Trash2, Save, X, ExternalLink,
  Eye, Calendar, Tag, Star, Users
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type Book = {
  id: number | null;
  title: string;
  category: string;
  description: string;
  price: number;
  author: string;
  coverColor: string;
  articleUrl: string;
  buyUrl: string;
  weekAdded: string;
  isNew: boolean;
  rating: number;
  students: number;
};

const AdminDashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Book>({
    id: null,
    title: '',
    category: 'mobile',
    description: '',
    price: 1000,
    author: 'MIDEESSI Team',
    coverColor: 'from-blue-500 to-blue-700',
    articleUrl: '',
    buyUrl: '',
    weekAdded: '',
    isNew: true,
    rating: 4.5,
    students: 0
  });

  const categories = [
    { id: 'mobile', name: 'Tutoriels Mobile' },
    { id: 'cybersec', name: 'Cybersécurité' },
    { id: 'webdev', name: 'Développement Web' },
    { id: 'design', name: 'Design & UI/UX' },
    { id: 'business', name: 'Tech Business' },
    { id: 'data', name: 'Data & IA' },
  ];

  const coverColors = [
    { id: 'from-blue-500 to-blue-700', name: 'Bleu' },
    { id: 'from-red-500 to-red-700', name: 'Rouge' },
    { id: 'from-green-500 to-green-700', name: 'Vert' },
    { id: 'from-purple-500 to-purple-700', name: 'Violet' },
    { id: 'from-yellow-500 to-yellow-700', name: 'Jaune' },
    { id: 'from-indigo-500 to-indigo-700', name: 'Indigo' },
    { id: 'from-pink-500 to-pink-700', name: 'Rose' },
    { id: 'from-teal-500 to-teal-700', name: 'Turquoise' },
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors du chargement des livres :', error.message);
      return;
    }

    if (data) setBooks(data);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.articleUrl || !formData.buyUrl) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingBook) {
        // Mise à jour d'un PDF existant
        const { error: updateError } = await supabase
          .from('books')
          .update({
            title: formData.title,
            category: formData.category,
            cover_color: formData.coverColor,
            description: formData.description,
            price: formData.price,
            author: formData.author,
            article_url: formData.articleUrl,
            buy_url: formData.buyUrl,
            week_added: formData.weekAdded,
            is_new: formData.isNew,
            rating: formData.rating,
            students: formData.students,
          })
          .eq('id', editingBook.id);

        if (updateError) throw updateError;

        setBooks(books.map(b => b.id === editingBook.id ? { ...formData, id: editingBook.id } : b));
        alert('PDF mis à jour avec succès !');
      } else {
        // Création d'un nouveau PDF
        const { data, error: insertError } = await supabase
          .from('books')
          .insert([{
            title: formData.title,
            category: formData.category,
            cover_color: formData.coverColor,
            description: formData.description,
            price: formData.price,
            author: formData.author,
            article_url: formData.articleUrl,
            buy_url: formData.buyUrl,
            week_added: formData.weekAdded,
            is_new: formData.isNew,
            rating: formData.rating,
            students: formData.students,
          }])
          .select();

        if (insertError) throw insertError;
        if (data) setBooks([data[0], ...books]);
        alert('PDF publié avec succès !');
      }

      resetForm();
      fetchBooks(); // Rafraîchir la liste
    } catch (err: any) {
      console.error('Erreur lors de la publication :', err);
      alert(`Erreur: ${err.message || 'Erreur lors de la publication'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) return;

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression :', error.message);
      return;
    }

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
      coverColor: 'from-blue-500 to-blue-700',
      articleUrl: '',
      buyUrl: '',
      weekAdded: '',
      isNew: true,
      rating: 4.5,
      students: 0
    });
    setEditingBook(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-yellow-400" />
              <div>
                <h1 className="text-2xl font-bold">MIDEESSI Learn - Admin</h1>
                <p className="text-blue-200 text-sm">Gestion des PDFs</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-lg transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nouveau PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total PDFs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{books.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Nouveaux cette semaine</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {books.filter(b => b.isNew).length}
                </p>
              </div>
              <Star className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Étudiants totaux</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {books.reduce((sum, b) => sum + b.students, 0)}
                </p>
              </div>
              <Users className="w-12 h-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full my-8">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingBook ? 'Modifier le PDF' : 'Nouveau PDF'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titre du PDF *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ex: Créer une App Mobile sans PC"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Catégorie *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Couleur de couverture *
                    </label>
                    <select
                      value={formData.coverColor}
                      onChange={(e) => setFormData({ ...formData, coverColor: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {coverColors.map(color => (
                        <option key={color.id} value={color.id}>{color.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Décrivez le contenu du PDF..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prix (FCFA) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Semaine d'ajout *
                    </label>
                    <input
                      type="text"
                      value={formData.weekAdded}
                      onChange={(e) => setFormData({ ...formData, weekAdded: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Ex: Semaine 1 - Janvier 2025"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lien de l'article *
                  </label>
                  <input
                    type="url"
                    value={formData.articleUrl}
                    onChange={(e) => setFormData({ ...formData, articleUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://mideessi.com/blog/article-exemple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lien d'achat (redirection boutique) *
                  </label>
                  <input
                    type="url"
                    value={formData.buyUrl}
                    onChange={(e) => setFormData({ ...formData, buyUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://boutique.mideessi.com/achat/pdf-123"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Note
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Étudiants
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.students}
                      onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nouveau ?
                    </label>
                    <label className="flex items-center gap-2 mt-3">
                      <input
                        type="checkbox"
                        checked={formData.isNew}
                        onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Badge NOUVEAU</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingBook ? 'Mettre à jour' : 'Publier'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Books List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              PDFs Publiés ({books.length})
            </h2>
          </div>

          {books.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Aucun PDF publié pour le moment</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {books.map((book) => (
                <div key={book.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${book.coverColor} flex items-center justify-center flex-shrink-0`}>
                      <BookOpen className="w-10 h-10 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              {book.title}
                            </h3>
                            {book.isNew && (
                              <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded">
                                NOUVEAU
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {book.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {book.weekAdded}
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="w-4 h-4" />
                              {book.price} FCFA
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              {book.rating}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {book.students} étudiants
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a
                            href={book.articleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="Voir l'article"
                          >
                            <Eye className="w-5 h-5" />
                          </a>
                          <a
                            href={book.buyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                            title="Tester le lien d'achat"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                          <button
                            onClick={() => handleEdit(book)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;