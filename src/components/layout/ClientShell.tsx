import { useMemo, useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, MessageCircle, Receipt, User, BarChart3, Calendar, FileText, Target, Menu, X } from 'lucide-react';
import { useClientAuth } from '../../contexts/ClientContext';
import { supabase } from '../../lib/supabase';
import { TopBar } from './TopBar';
import BottomNavigation from '../client/BottomNavigation';
import { FloatingMessageButton } from './FloatingMessageButton';

const navItems = [
  { name: 'Accueil', path: '/clients/dashboard', icon: Home, section: 'home' },
  { name: 'Messages', path: '/clients/messages', icon: MessageCircle, section: 'messages' },
  { name: 'Performance', path: '/clients/kpis', icon: BarChart3, section: 'kpis' },
  { name: 'Calendrier', path: '/clients/calendar', icon: Calendar, section: 'calendar' },
  { name: 'Devis', path: '/clients/quotes', icon: FileText, section: 'quotes' },
  { name: 'Infos', path: '/clients/infos', icon: FileText, section: 'infos' },
  { name: 'Objectifs', path: '/clients/objectives', icon: Target, section: 'objectives' },
  { name: 'Livrables', path: '/clients/livrables', icon: Package, section: 'livrables' },
  { name: 'Factures', path: '/clients/factures', icon: Receipt, section: 'factures' },
  { name: 'Compte', path: '/clients/compte', icon: User, section: 'compte' },
];

export function ClientShell() {
  const { user } = useClientAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!user?.client_id) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('id')
          .eq('client_id', user.client_id)
          .eq('expediteur', 'admin')
          .eq('lu', false);

        if (!error) {
          setUnreadCount(data?.length || 0);
        }
      } catch (err) {
        console.error('Unread message fetch failed', err);
      }
    };

    fetchUnreadCount();

    const subscription = supabase
      .channel(`client_messages_live:${user.client_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `client_id=eq.${user.client_id}`,
        },
        fetchUnreadCount
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.client_id]);

  const title = useMemo(() => {
    const match = navItems.find((item) => location.pathname.startsWith(item.path));
    return match?.name || 'Espace client';
  }, [location.pathname]);

  const isClientReady = Boolean(user && user.client_id && user.is_first_login === false);

  const visibleNavItems = isClientReady
    ? navItems
    : navItems.filter((item) => ['home', 'infos', 'compte'].includes(item.section));

  const activeSection = useMemo<'home' | 'livrables' | 'messages' | 'factures' | 'compte' | 'infos' | 'kpis' | 'calendar' | 'reports' | 'objectives' | 'quotes'>(() => {
    const section = navItems.find((item) => location.pathname.startsWith(item.path))?.section;
    const allowedSections = ['home', 'livrables', 'messages', 'factures', 'compte', 'infos', 'kpis', 'calendar', 'reports', 'objectives', 'quotes'] as const;
    return allowedSections.includes(section as any) ? (section as typeof allowedSections[number]) : 'home';
  }, [location.pathname]);

  const handleNavigate = (section: 'home' | 'livrables' | 'messages' | 'factures' | 'compte' | 'infos' | 'kpis' | 'calendar' | 'reports' | 'objectives' | 'quotes') => {
    const item = navItems.find((navItem) => navItem.section === section);
    if (item) navigate(item.path);
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <div className="lg:flex lg:min-h-screen">
        {isClientReady && (
          <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-[var(--border)] lg:bg-[var(--bg-card)]">
          <div className="flex flex-col gap-6 px-6 py-8">
            <div>
              <div className="inline-flex items-center gap-2">
                <span className="text-3xl font-display tracking-[0.25em] text-[var(--brand-midnight)]">M</span>
                <span className="text-2xl font-semibold text-[var(--brand-midnight)]">MIDEESSI</span>
              </div>
              <p className="mt-2 text-sm uppercase tracking-[0.35em] text-[var(--brand-gold-muted)]">Votre espace personnel</p>
            </div>

            <div className="space-y-3">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-[var(--brand-gold)]/15 text-[var(--brand-midnight)] shadow-glow'
                          : 'text-[var(--text-hint)] hover:bg-[var(--bg-page)] hover:text-[var(--brand-midnight)]'
                      }`
                    }
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-surface)] text-[var(--brand-midnight)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>{item.name}</span>
                    {item.name === 'Messages' && unreadCount > 0 && (
                      <span className="ml-auto inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
            </div>
          </aside>
        )}

        <div className="flex-1 lg:overflow-hidden">
          <div className="border-b border-[var(--border)] bg-[var(--bg-card)]">
            <TopBar
              title={title}
              subtitle={isOnline ? undefined : 'Connexion perdue — certaines données peuvent être obsolètes'}
              clientName={user?.nom_marque ?? 'Client MIDEESSI'}
              email={user?.email ?? ''}
              hasUnread={unreadCount > 0}
              onMenuClick={() => setSidebarOpen(true)}
            />
          </div>

          <main className="relative min-h-[calc(100vh-64px)] pb-28 overflow-hidden">
            <div className="px-4 py-5 pb-10 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {isClientReady && <BottomNavigation activeSection={activeSection} unreadMessagesCount={unreadCount} onNavigate={handleNavigate} />}
      {isClientReady && <FloatingMessageButton />}

      {isClientReady && (
        <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-slate-950/40 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeSidebar}
        />
        <aside className={`relative z-50 h-full w-72 overflow-y-auto bg-[var(--bg-card)] border-r border-[var(--border)] shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-hint)]">Menu</p>
              <p className="font-semibold text-[var(--brand-midnight)]">Espace client</p>
            </div>
            <button type="button" onClick={closeSidebar} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--bg-surface)] text-[var(--brand-midnight)] transition hover:bg-[var(--bg-card)]">
              <X className="h-5 w-5" />
            </button>
          </div>
            <nav className="px-4 py-4">
            <div className="space-y-3">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-[var(--brand-gold)]/15 text-[var(--brand-midnight)]'
                          : 'text-[var(--text-hint)] hover:bg-[var(--bg-page)] hover:text-[var(--brand-midnight)]'
                      }`
                    }
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--bg-surface)] text-[var(--brand-midnight)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{item.name}</span>
                    {item.name === 'Messages' && unreadCount > 0 && (
                      <span className="ml-auto inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
