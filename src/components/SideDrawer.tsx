import { X, Home, BookOpen, Lightbulb, Tag, Rocket, Info, Book, MessageCircle, Building, Wrench, Library, Zap, Briefcase } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideDrawer = ({ isOpen, onClose }: SideDrawerProps) => {
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');

  const menuSections = [
    {
      title: 'AGENCE',
      icon: <Building className="w-4 h-4" />,
      items: [
        { id: 'home', label: 'Accueil', href: '/', icon: <Home className="w-5 h-5" /> },
        { id: 'about', label: 'À propos', href: '/about', icon: <Info className="w-5 h-5" /> },
        { id: 'team', label: 'Équipe', href: '/about#team', icon: <Zap className="w-5 h-5" /> },
        { id: 'contact', label: 'Contact', href: '/contact', icon: <MessageCircle className="w-5 h-5" /> },
        { id: 'careers', label: 'Carrières', href: '/careers', icon: <Briefcase className="w-5 h-5" /> },
      ]
    },
    {
      title: 'SERVICES',
      icon: <Wrench className="w-4 h-4" />,
      items: [
        { id: 'offres', label: 'Nos Offres', href: '/offres', icon: <Tag className="w-5 h-5" /> },
        { id: 'solutions', label: 'Solutions', href: '/solutions', icon: <Lightbulb className="w-5 h-5" /> },
        { id: 'projects', label: 'Nos Projets', href: '/projects', icon: <Rocket className="w-5 h-5" /> },
        { id: 'ateliers', label: 'Ateliers', href: '/ateliers', icon: <BookOpen className="w-5 h-5" /> },
      ]
    },
    {
      title: 'RESSOURCES',
      icon: <Library className="w-4 h-4" />,
      items: [
        { id: 'blog', label: 'Blog', href: '/blog', icon: <BookOpen className="w-5 h-5" /> },
        { id: 'learn', label: 'Apprendre', href: '/learn', icon: <Lightbulb className="w-5 h-5" /> },
        { id: 'library', label: 'Bibliothèque', href: '/library', icon: <Book className="w-5 h-5" /> },
      ]
    }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-midnight to-blue-900 text-white p-6 flex items-center justify-between border-b-2 border-gold/30">
          <h2 className="text-xl font-bold text-gold">MIDEESSI</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Sections */}
        <div className="p-4 space-y-6">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-2 mb-3 pl-2">
                <span className="text-gold">{section.icon}</span>
                <h3 className="text-xs font-bold text-gold uppercase tracking-widest">
                  {section.title}
                </h3>
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-gold/20 to-yellow-100 dark:from-gold/30 dark:to-blue-900/30 text-gold border-l-4 border-gold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent'
                    }`}
                  >
                    <span className={isActive(item.href) ? 'text-gold' : 'text-midnight dark:text-gray-400'}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {isActive(item.href) && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-gold"></div>
                    )}
                  </a>
                ))}
              </div>
              {idx < menuSections.length - 1 && (
                <div className="my-4 h-px bg-gray-200 dark:bg-gray-700"></div>
              )}
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t-2 border-gray-200 dark:border-gray-700">
          <a
            href="/contact"
            onClick={onClose}
            className="w-full bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-midnight py-3 rounded-lg font-bold text-center transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Démarrer un projet
          </a>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
