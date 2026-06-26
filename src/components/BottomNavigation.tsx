import { BookOpen, Home, Tag, MoreVertical, GraduationCap } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '../contexts/NavigationContext';

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const BottomNavigation = () => {
  const location = useLocation();
  const { setShowDrawer } = useNavigation();

  // OPTION 2: 4 main navigation items (Solutions in navbar, rest accessible via SideDrawer)
  const navItems: BottomNavItem[] = [
    {
      label: 'Accueil',
      href: '/',
      icon: <Home className="w-6 h-6" />,
    },
    {
      label: 'Ateliers',
      href: '/ateliers',
      icon: <GraduationCap className="w-6 h-6" />,
    },
    {
      label: 'Nos Offres',
      href: '/offres',
      icon: <Tag className="w-6 h-6" />,
    },
    {
      label: 'Apprendre',
      href: '/learn',
      icon: <BookOpen className="w-6 h-6" />,
    },
  ];

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <>
      <div className="fixed bottom-3 left-1/2 z-40 mx-auto w-[calc(100%-1rem)] max-w-md -translate-x-1/2 md:hidden safe-area-bottom">
        <div className="rounded-[28px] border border-white/70 bg-white/95 px-2 py-2 shadow-[0_18px_45px_-18px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/95">
          <div className="flex items-center justify-around gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`group relative flex h-14 flex-1 flex-col items-center justify-center gap-1 rounded-[20px] px-2 py-2 transition-all duration-300 ${
                    active
                      ? 'bg-gold/15 text-gold shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-midnight dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-gold'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    {item.icon}
                    {active && (
                      <span className="absolute -top-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold" />
                    )}
                  </div>
                  <span className={`text-[11px] font-semibold leading-none ${active ? 'text-gold' : ''}`}>
                    {item.label}
                  </span>
                </a>
              );
            })}

            <button
              onClick={() => setShowDrawer(true)}
              className="group relative flex h-14 flex-1 flex-col items-center justify-center gap-1 rounded-[20px] px-2 py-2 text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-midnight dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-gold"
              aria-label="Plus de pages"
              title="Autres pages"
            >
              <MoreVertical className="h-5 w-5" />
              <span className="text-[11px] font-semibold leading-none">Plus</span>
            </button>
          </div>
        </div>
      </div>

      <div className="h-24 md:h-0 md:hidden" />
    </>
  );
};

export default BottomNavigation;
