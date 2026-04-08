import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, BookOpen } from 'lucide-react';

export default function MyLibrary() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Rediriger vers la connexion si pas authentifié
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Ma Bibliothèque
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bienvenue, <span className="font-semibold">{user.email}</span> !
            </p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
          >
            <LogOut size={20} />
            {loading ? 'Déconnexion...' : 'Déconnexion'}
          </button>
        </div>

        {/* Empty State */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-12 text-center">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Votre bibliothèque est vide
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Commencez à découvrir des ebooks et ajoutez-les à vos favoris !
          </p>
          <button
            onClick={() => navigate('/library')}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Découvrir les ebooks
          </button>
        </div>

        {/* User Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
            <p className="text-gray-600 dark:text-gray-400">Ebooks likés</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
            <p className="text-gray-600 dark:text-gray-400">Pages lues</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
            <p className="text-gray-600 dark:text-gray-400">Livres complétés</p>
          </div>
        </div>
      </div>
    </div>
  );
}
