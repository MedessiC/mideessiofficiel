import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, CreditCard as Edit, Trash2, Eye, LogOut, TrendingUp, FileText, Users } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, views: 0 });

  useEffect(() => {
    checkAuth();
    fetchPosts();
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

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setPosts(data);
      setStats({
        total: data.length,
        published: data.filter(p => p.is_published).length,
        draft: data.filter(p => !p.is_published).length,
        views: data.reduce((sum, p) => sum + p.views, 0),
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchPosts();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const togglePublish = async (post: BlogPost) => {
    const { error } = await supabase
      .from('blog_posts')
      .update({ is_published: !post.is_published })
      .eq('id', post.id);

    if (!error) {
      fetchPosts();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 md:gap-6 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
              Tableau de bord
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Gérez vos articles de blog
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <Link
              to="/admin/post/new"
              className="inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm md:text-base"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Nouvel article</span>
              <span className="sm:hidden">Nouvel</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center px-3 md:px-4 py-2 md:py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-colors text-sm md:text-base"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Déconnexion</span>
              <span className="sm:hidden">Quitter</span>
            </button>
          </div>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-600 flex-shrink-0" />
              <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Total articles</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-6 h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0" />
              <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stats.published}</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Publiés</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-orange-600 flex-shrink-0" />
              <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stats.draft}</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Brouillons</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-purple-600 flex-shrink-0" />
              <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stats.views}</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Vues totales</p>
          </div>
        </div>

        {/* Posts Table - Responsive */}
        <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200">
                    Article
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-200">
                    Catégorie
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200">
                    Statut
                  </th>
                  <th className="hidden sm:table-cell px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-200">
                    Vues
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-200">
                    Date
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>Aucun article pour le moment</p>
                      <Link to="/admin/post/new" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                        Créer le premier article
                      </Link>
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="flex items-start md:items-center gap-2 md:gap-3 min-w-0">
                          {post.image_url && (
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="w-10 h-8 md:w-16 md:h-12 object-cover rounded flex-shrink-0"
                              onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white text-xs md:text-base line-clamp-1 md:line-clamp-none">
                              {post.title}
                            </p>
                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-1 md:line-clamp-none">
                              {post.author}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4">
                        <span className="inline-flex px-2 py-1 md:px-3 md:py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <button
                          onClick={() => togglePublish(post)}
                          className={`px-2 md:px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                            post.is_published
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50'
                          }`}
                        >
                          {post.is_published ? '✓ Publié' : '○ Brouillon'}
                        </button>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {post.views || 0}
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(post.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="flex items-center justify-end gap-1 md:gap-2">
                          <Link
                            to={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Voir"
                          >
                            <Eye className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
                          </Link>
                          <Link
                            to={`/admin/post/${post.id}`}
                            className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-1.5 md:p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
