import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, CreditCard as Edit, Trash2, Eye, LogOut, TrendingUp, FileText, Bell, PenTool, Tag, Film, Users, Sparkles } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';
import HeroManager from '../components/admin/HeroManager';
import PopupManager from '../components/admin/PopupManager';
import PromoCodeManager from '../components/admin/PromoCodeManager';
import HeroSlidesManager from '../components/admin/HeroSlidesManager';
import AdminClientManagement from './AdminClientManagement';
import AdminQuoteRequests from './AdminQuoteRequests';
import AtelierManager from '../components/admin/AtelierManager';
import ContentManager from '../components/admin/ContentManager';

type TabType = 'blog' | 'hero' | 'slides' | 'popups' | 'promo' | 'clients' | 'quotes' | 'ateliers' | 'content';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('blog');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, views: 0 });
  const [page, setPage] = useState(0);
  const pageSize = 10; // articles par page
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchPosts(true);
  }, []);

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate('/admin/login');
      return;
    }

    const { data: adminData } = await supabase.from('admins').select('*').eq('id', user.id).maybeSingle();

    if (!adminData) {
      await supabase.auth.signOut();
      navigate('/admin/login');
      return;
    }

    setAuthLoading(false);
  };

  const fetchPosts = async (reset = false) => {
    setPostsLoading(true);

    const currentPage = reset ? 0 : page;
    const start = currentPage * pageSize;
    const end = start + pageSize - 1;

    const { data, count, error } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(start, end);

    if (!error) {
      if (data && data.length > 0) {
        setPosts((prev) => (reset ? data : [...prev, ...data]));

        // Update stats using count when available
        const totalCount = typeof count === 'number' ? count : (reset ? data.length : posts.length + data.length);
        const combined = reset ? data : [...posts, ...data];
        setStats({
          total: totalCount,
          published: combined.filter((post) => post.is_published).length,
          draft: combined.filter((post) => !post.is_published).length,
          views: combined.reduce((sum, post) => sum + (post.views || 0), 0),
        });

        setHasMore(data.length === pageSize && (typeof count !== 'number' || start + data.length < count));
        if (reset) setPage(1); else setPage((p) => p + 1);
      } else {
        // no data returned
        if (reset) {
          setPosts([]);
          setStats({ total: 0, published: 0, draft: 0, views: 0 });
        }
        setHasMore(false);
      }
    } else {
      console.error('Error fetching posts:', error);
    }

    setPostsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (!error) {
      fetchPosts();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const togglePublish = async (post: BlogPost) => {
    const { error } = await supabase.from('blog_posts').update({ is_published: !post.is_published }).eq('id', post.id);
    if (!error) {
      fetchPosts();
    }
  };

  if (authLoading || postsLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-slate-300">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <header className="mb-6 rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm shadow-slate-200/50 dark:shadow-none">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 font-semibold">Administration</p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Tableau de bord Admin</h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-6 text-slate-600 dark:text-slate-400">
                Un espace mobile-first pour piloter les articles, les clients, les popups et les promotions.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-900/10 transition hover:bg-slate-800 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </header>

        <section className="mb-6">
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {[
              { id: 'blog', label: 'Blog', icon: <FileText className="w-4 h-4" /> },
              { id: 'hero', label: 'Hero', icon: <PenTool className="w-4 h-4" /> },
              { id: 'slides', label: 'Slides', icon: <Film className="w-4 h-4" /> },
              { id: 'popups', label: 'Popups', icon: <Bell className="w-4 h-4" /> },
              { id: 'promo', label: 'Promo', icon: <Tag className="w-4 h-4" /> },
              { id: 'ateliers', label: 'Ateliers', icon: <Users className="w-4 h-4" /> },
              { id: 'content', label: 'Contenus', icon: <Sparkles className="w-4 h-4" /> },
              { id: 'clients', label: 'Clients', icon: <Users className="w-4 h-4" /> },
              { id: 'quotes', label: 'Devis', icon: <FileText className="w-4 h-4" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`inline-flex min-w-[8rem] items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {activeTab === 'blog' && (
          <section className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total articles</p>
              </div>
              <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <Eye className="w-6 h-6 text-green-600" />
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.published}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Publiés</p>
              </div>
              <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <FileText className="w-6 h-6 text-orange-600" />
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.draft}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Brouillons</p>
              </div>
              <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.views}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Vues totales</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Articles du blog</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Gérez facilement les publications depuis un affichage optimisé mobile.</p>
                </div>
                <Link
                  to="/admin/post/new"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Nouvel article
                </Link>
                <Link
                  to="/admin/solutions"
                  className="ml-3 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-midnight transition hover:brightness-95"
                >
                  <Sparkles className="w-4 h-4" />
                  Solutions
                </Link>
              </div>

              {posts.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-8 text-center">
                  <FileText className="mx-auto mb-4 h-14 w-14 text-slate-300" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Aucun article pour le moment.</p>
                  <Link
                    to="/admin/post/new"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Créer le premier article
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <article key={post.id} className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-5 shadow-sm transition hover:shadow-md">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-200">
                              <FileText className="w-3.5 h-3.5" />
                              {post.category || 'Général'}
                            </span>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                post.is_published
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200'
                                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200'
                              }`}
                            >
                              {post.is_published ? 'Publié' : 'Brouillon'}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-2">{post.title}</h3>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{post.excerpt || 'Aucun résumé disponible.'}</p>
                        </div>
                        <div className="flex flex-col items-start gap-1 text-xs text-slate-500 dark:text-slate-400 sm:items-end">
                          <span>{post.views || 0} vues</span>
                          <span>{new Date(post.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <Eye className="w-4 h-4" /> Voir
                        </Link>
                        <Link
                          to={`/admin/post/${post.id}`}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <Edit className="w-4 h-4" /> Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-red-200 dark:border-red-700/40 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                        >
                          <Trash2 className="w-4 h-4" /> Supprimer
                        </button>
                      </div>
                    </article>
                  ))}
                  {hasMore && (
                    <div className="text-center mt-4">
                      <button
                        onClick={() => fetchPosts(false)}
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                      >
                        Charger plus
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'hero' && <HeroManager />}

        {activeTab === 'slides' && <HeroSlidesManager />}

        {activeTab === 'popups' && <PopupManager />}

        {activeTab === 'quotes' && <AdminQuoteRequests />}

        {activeTab === 'promo' && <PromoCodeManager />}

        {activeTab === 'ateliers' && <AtelierManager />}

        {activeTab === 'content' && <ContentManager />}

        {activeTab === 'clients' && <AdminClientManagement />}
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-40 lg:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="max-w-6xl mx-auto flex justify-between items-center h-20 px-4">
          {[
            { id: 'blog', label: 'Blog', icon: <FileText className="w-5 h-5" /> },
            { id: 'slides', label: 'Slides', icon: <Film className="w-5 h-5" /> },
            { id: 'popups', label: 'Popups', icon: <Bell className="w-5 h-5" /> },
            { id: 'clients', label: 'Clients', icon: <Users className="w-5 h-5" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition ${
                activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </footer>
      <div className="h-24 lg:hidden" />
    </div>
  );
};

export default AdminDashboard;
