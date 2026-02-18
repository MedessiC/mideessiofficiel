import { BookOpen, FileText, Lightbulb, Info, Menu, Rocket, MessageCircle, Home } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const BottomNavigation = () => {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);

  const mainLinks: BottomNavItem[] = [
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
      label: 'Solutions',
      href: '/solutions',
      icon: <Lightbulb className="w-6 h-6" />,
    },
  ];

  const moreLinks: BottomNavItem[] = [
    { label: 'À propos', href: '/about', icon: <Info className="w-5 h-5" /> },
    { label: 'Projets', href: '/projects', icon: <Rocket className="w-5 h-5" /> },
    { label: 'Biblio', href: '/library', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Contact', href: '/contact', icon: <MessageCircle className="w-5 h-5" /> },
  ];

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl safe-area-bottom">
        <div className="flex justify-around items-center h-20">
          {mainLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative group ${
                isActive(link.href)
                  ? 'text-[#ffd700]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-[#191970] dark:hover:text-[#ffd700]'
              }`}
            >
              <div className="relative">
                {link.icon}
                {isActive(link.href) && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ffd700] rounded-full"></div>
                )}
              </div>
              <span className="text-xs font-semibold">{link.label}</span>
            </a>
          ))}

          {/* More Menu Button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-600 dark:text-gray-400 hover:text-[#191970] dark:hover:text-[#ffd700] transition-all duration-300"
          >
            <Menu className="w-6 h-6" />
            <span className="text-xs font-semibold">Plus</span>
          </button>
        </div>

        {/* More Menu Dropdown */}
        {showMore && (
          <div className="absolute bottom-20 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
            <div className="grid grid-cols-4 gap-2 p-4">
              {moreLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setShowMore(false)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all duration-300 ${
                    isActive(link.href)
                      ? 'bg-[#ffd700]/20 text-[#ffd700]'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#ffd700]'
                  }`}
                >
                  <div className="text-[#191970] dark:text-[#ffd700]">
                    {link.icon}
                  </div>
                  <span className="text-xs font-semibold text-center">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Safe area for content to not be hidden under bottom nav */}
      <div className="h-20 md:h-0 md:hidden" />
    </>
  );
};

export default BottomNavigation;
