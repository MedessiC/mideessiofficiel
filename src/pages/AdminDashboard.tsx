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
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-lg text-corporate-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-corporate-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-midnight dark:text-white mb-2">
              Tableau de bord
            </h1>
            <p className="text-corporate-600 dark:text-corporate-300">
              Gérez vos articles de blog
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/post/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvel article
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-3 bg-corporate-200 dark:bg-corporate-800 hover:bg-corporate-300 dark:hover:bg-corporate-700 text-corporate-700 dark:text-corporate-200 font-semibold rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-corporate-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-midnight dark:text-white">{stats.total}</span>
            </div>
            <p className="text-corporate-600 dark:text-corporate-300 font-medium">Total articles</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-corporate-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-midnight dark:text-white">{stats.published}</span>
            </div>
            <p className="text-corporate-600 dark:text-corporate-300 font-medium">Publiés</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-corporate-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-bold text-midnight dark:text-white">{stats.draft}</span>
            </div>
            <p className="text-corporate-600 dark:text-corporate-300 font-medium">Brouillons</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-corporate-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-midnight dark:text-white">{stats.views}</span>
            </div>
            <p className="text-corporate-600 dark:text-corporate-300 font-medium">Vues totales</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-corporate-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-corporate-50 dark:bg-gray-700 border-b border-corporate-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-corporate-700 dark:text-corporate-200">
                    Article
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-corporate-700 dark:text-corporate-200">
                    Catégorie
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-corporate-700 dark:text-corporate-200">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-corporate-700 dark:text-corporate-200">
                    Vues
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-corporate-700 dark:text-corporate-200">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-corporate-700 dark:text-corporate-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-corporate-200 dark:divide-gray-700">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-corporate-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold text-midnight dark:text-white">
                            {post.title}
                          </p>
                          <p className="text-sm text-corporate-500 dark:text-corporate-400">
                            {post.author}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(post)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          post.is_published
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {post.is_published ? 'Publié' : 'Brouillon'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-corporate-600 dark:text-corporate-300">
                      {post.views}
                    </td>
                    <td className="px-6 py-4 text-sm text-corporate-600 dark:text-corporate-300">
                      {new Date(post.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-corporate-100 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4 text-corporate-600 dark:text-corporate-300" />
                        </Link>
                        <Link
                          to={`/admin/post/${post.id}`}
                          className="p-2 hover:bg-corporate-100 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
