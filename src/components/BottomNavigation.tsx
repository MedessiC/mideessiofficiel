import { BookOpen, FileText, Home, Tag, MoreVertical } from 'lucide-react';
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
      label: 'Apprendre',
      href: '/learn',
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      label: 'Blog',
      href: '/blog',
      icon: <FileText className="w-6 h-6" />,
    },
    {
      label: 'Nos Offres',
      href: '/offres',
      icon: <Tag className="w-6 h-6" />,
    },
  ];

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <>
      {/* Bottom Navigation - Mobile Only (OPTION 2: Hybrid - Reduced to 4 items) */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl safe-area-bottom">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative group ${
                isActive(item.href)
                  ? 'text-gold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-midnight dark:hover:text-gold'
              }`}
            >
              <div className="relative">
                {item.icon}
                {isActive(item.href) && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gold rounded-full"></div>
                )}
              </div>
              <span className="text-xs font-semibold">{item.label}</span>
            </a>
          ))}

          {/* Plus Button - Opens Drawer */}
          <button
            onClick={() => setShowDrawer(true)}
            className="flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 hover:text-midnight dark:hover:text-gold text-gray-600 dark:text-gray-400 group"
            aria-label="Plus de pages"
            title="Autres pages"
          >
            <div className="relative">
              <MoreVertical className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold">Plus</span>
          </button>
        </div>
      </div>

      {/* Safe area for content to not be hidden under bottom nav */}
      <div className="h-20 md:h-0 md:hidden" />
    </>
  );
};

export default BottomNavigation;
