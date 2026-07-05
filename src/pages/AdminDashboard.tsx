import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, CreditCard as Edit, Trash2, Eye, LogOut, TrendingUp, FileText, Bell, PenTool, Tag, Film, Users, Sparkles, HelpCircle, Loader } from 'lucide-react';
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
  const pageSize = 10;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchPosts(true);
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/admin/login'); return; }
    const { data: adminData } = await supabase.from('admins').select('*').eq('id', user.id).maybeSingle();
    if (!adminData) { await supabase.auth.signOut(); navigate('/admin/login'); return; }
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
        if (reset) {
          setPosts([]);
          setStats({ total: 0, published: 0, draft: 0, views: 0 });
        }
        setHasMore(false);
      }
    }
    setPostsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (!error) { fetchPosts(true); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const togglePublish = async (post: BlogPost) => {
    const { error } = await supabase.from('blog_posts').update({ is_published: !post.is_published }).eq('id', post.id);
    if (!error) { fetchPosts(true); }
  };

  if (authLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white">
          <Loader className="w-10 h-10 text-[var(--brand-gold)] animate-spin" />
          <p className="text-sm text-gray-400">Chargement de l'administration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <header className="rounded-2xl border border-white/8 bg-white/5 p-6 backdrop-blur-md">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[var(--brand-gold)] font-black">Espace d'administration</span>
              <h1 className="text-2xl font-black text-white">Tableau de bord</h1>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
                Gérez vos articles de blog, vos publications de PDF, vos clients et vos devis depuis une interface premium et cohérente.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/admin/pdfs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-midnight)] font-black px-4 py-2.5 text-xs hover:opacity-90 transition-opacity"
              >
                <PenTool className="w-3.5 h-3.5" />
                Gérer les PDFs
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 text-white px-4 py-2.5 text-xs hover:bg-white/15 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap gap-2 pb-2">
          {[
            { id: 'blog', label: 'Blog', icon: <FileText className="w-4 h-4" /> },
            { id: 'clients', label: 'Clients', icon: <Users className="w-4 h-4" /> },
            { id: 'quotes', label: 'Devis', icon: <FileText className="w-4 h-4" /> },
            { id: 'hero', label: 'Hero', icon: <PenTool className="w-4 h-4" /> },
            { id: 'slides', label: 'Slides', icon: <Film className="w-4 h-4" /> },
            { id: 'popups', label: 'Popups', icon: <Bell className="w-4 h-4" /> },
            { id: 'promo', label: 'Promo', icon: <Tag className="w-4 h-4" /> },
            { id: 'ateliers', label: 'Ateliers', icon: <Users className="w-4 h-4" /> },
            { id: 'content', label: 'Contenus', icon: <Sparkles className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                activeTab === item.id
                  ? 'bg-[var(--brand-gold)] text-[var(--brand-midnight)] shadow-md'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Tab Contents */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Total articles', value: stats.total, color: 'text-blue-400', icon: FileText },
                { label: 'Publiés', value: stats.published, color: 'text-emerald-400', icon: CheckCircle2 },
                { label: 'Brouillons', value: stats.draft, color: 'text-amber-400', icon: HelpCircle },
                { label: 'Vues totales', value: stats.views, color: 'text-purple-400', icon: TrendingUp },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/8 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                    <p className="text-xl font-black text-white mt-1">{s.value}</p>
                  </div>
                  {s.icon && <s.icon className={`w-6 h-6 ${s.color} opacity-40`} />}
                </div>
              ))}
            </div>

            {/* Articles List */}
            <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-white/8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-black text-white text-base">Articles du blog</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Créez, modifiez ou supprimez vos publications.</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/admin/post/new"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-midnight)] px-4 py-2.5 font-black text-xs hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-3.5 h-3.5" /> Nouvel article
                  </Link>
                  <Link
                    to="/admin/solutions"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 text-white border border-white/15 px-4 py-2.5 font-bold text-xs hover:bg-white/15 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Solutions
                  </Link>
                </div>
              </div>

              {posts.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto" />
                  <p className="text-sm font-semibold text-gray-400">Aucun article disponible</p>
                </div>
              ) : (
                <div className="divide-y divide-white/8">
                  {posts.map((post) => (
                    <article key={post.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-white/2 transition-colors">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-gray-300">
                            {post.category || 'Général'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${post.is_published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                            {post.is_published ? 'Publié' : 'Brouillon'}
                          </span>
                          <span className="text-[10px] text-gray-500">{new Date(post.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <h3 className="font-black text-sm text-white line-clamp-1">{post.title}</h3>
                        <p className="text-xs text-gray-400 line-clamp-1">{post.excerpt || 'Aucun résumé.'}</p>
                      </div>

                      <div className="flex items-center gap-2 sm:self-center">
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-gray-300 transition-colors"
                          title="Voir l'article"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/post/${post.id}`}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-gray-300 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-xs font-semibold text-red-400 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
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
    </div>
  );
};

// Simple inline icons replacement
function CheckCircle2(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

export default AdminDashboard;
