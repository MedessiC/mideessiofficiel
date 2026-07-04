import { X, Home, BookOpen, Lightbulb, Tag, Rocket, Info, Book, MessageCircle, Building, Wrench, Library, Users, Briefcase } from 'lucide-react';
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
        { id: 'team', label: 'Équipe', href: '/about#team', icon: <Users className="w-5 h-5" /> },
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
      {/* Backdrop with premium blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Floating Modern Drawer */}
      <div
        className={`fixed top-4 bottom-4 left-4 w-72 max-w-[calc(100vw-32px)] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-50 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] transform transition-all duration-300 ease-in-out overflow-hidden md:hidden flex flex-col border border-white/20 dark:border-gray-800/60 ${
          isOpen ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-[calc(100%+24px)] opacity-0 scale-95'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--brand-midnight)] to-blue-950 text-white p-5 flex items-center justify-between border-b border-gray-100/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black tracking-wider text-gold">MIDEESSI</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 rounded-xl transition-all"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center gap-2 mb-2 pl-2">
                <span className="text-gold/80">{section.icon}</span>
                <h3 className="text-[10px] font-black text-gold/80 uppercase tracking-widest">
                  {section.title}
                </h3>
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                        active
                          ? 'bg-gold/10 text-gold border-l-4 border-gold shadow-sm font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 border-transparent'
                      }`}
                    >
                      <span className={active ? 'text-gold' : 'text-gray-400 dark:text-gray-500'}>
                        {item.icon}
                      </span>
                      <span className="text-sm font-semibold">{item.label}</span>
                      {active && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#FFD700]"></div>
                      )}
                    </a>
                  );
                })}
              </div>
              {idx < menuSections.length - 1 && (
                <div className="pt-2 h-px border-b border-gray-100 dark:border-gray-800/80 mx-2"></div>
              )}
            </div>
          ))}
        </div>

        {/* Premium Action Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800/80 bg-white/50 dark:bg-gray-900/50 flex-shrink-0">
          <a
            href="/contact"
            onClick={onClose}
            className="w-full bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-midnight py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-center transition-all duration-300 shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Démarrer un projet
          </a>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
