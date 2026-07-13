import { X, Home, BookOpen, Lightbulb, Tag, Rocket, Info, Book, MessageCircle, Building, Wrench, Library, Users, Briefcase } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideDrawer = ({ isOpen, onClose }: SideDrawerProps) => {
  const location = useLocation();

  if (!isOpen) return null;

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/');

  const menuSections = [
    {
      title: 'Agence',
      icon: <Building className="w-3.5 h-3.5" />,
      items: [
        { id: 'home',    label: 'Accueil',   href: '/',           icon: <Home className="w-5 h-5" /> },
        { id: 'about',   label: 'À propos',  href: '/about',      icon: <Info className="w-5 h-5" /> },
        { id: 'team',    label: 'Équipe',    href: '/about#team', icon: <Users className="w-5 h-5" /> },
        { id: 'contact', label: 'Contact',   href: '/contact',    icon: <MessageCircle className="w-5 h-5" /> },
        { id: 'careers', label: 'Carrières', href: '/careers',    icon: <Briefcase className="w-5 h-5" /> },
      ]
    },
    {
      title: 'Services',
      icon: <Wrench className="w-3.5 h-3.5" />,
      items: [
        { id: 'offres',    label: 'Offres',   href: '/offres',    icon: <Tag className="w-5 h-5" /> },
        { id: 'solutions', label: 'Solutions', href: '/solutions', icon: <Lightbulb className="w-5 h-5" /> },
        { id: 'projects',  label: 'Projets',   href: '/projects',  icon: <Rocket className="w-5 h-5" /> },
        { id: 'ateliers',  label: 'Ateliers',  href: '/ateliers',  icon: <BookOpen className="w-5 h-5" /> },
      ]
    },
    {
      title: 'Ressources',
      icon: <Library className="w-3.5 h-3.5" />,
      items: [
        { id: 'blog',    label: 'Blog',      href: '/blog',    icon: <BookOpen className="w-5 h-5" /> },
        { id: 'learn',   label: 'Apprendre', href: '/learn',   icon: <Lightbulb className="w-5 h-5" /> },
        { id: 'library', label: 'Biblio.',   href: '/library', icon: <Book className="w-5 h-5" /> },
      ]
    }
  ];

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isOpen
            ? 'bg-black/60 backdrop-blur-sm pointer-events-auto'
            : 'bg-transparent pointer-events-none backdrop-blur-none'
        }`}
      />

      {/* ── Floating centered panel ── */}
      <div className="fixed inset-0 z-50 md:hidden flex items-center justify-center pointer-events-none">
        <div
          className={`pointer-events-auto w-[88vw] max-w-sm max-h-[90vh] flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ease-out
            bg-white dark:bg-[#080d1a]
            border border-gray-200 dark:border-white/10
            shadow-[0_24px_64px_-8px_rgba(0,0,0,0.18)] dark:shadow-[0_24px_80px_-8px_rgba(0,0,0,0.75)]
            ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-6 pointer-events-none'}
          `}
        >
          {/* ── Header: adapts per theme ── */}
          <div className="relative flex flex-col items-center pt-7 pb-5 px-6 flex-shrink-0
            bg-gradient-to-b from-gray-50 to-white border-b border-gray-200
            dark:from-[#191970] dark:to-[#080d1a] dark:border-white/10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Fermer le menu"
              className="absolute top-4 right-4 p-2 rounded-xl transition-all active:scale-95
                bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-500
                dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/10 dark:text-white/70"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo — light mode uses dark logo, dark mode uses light logo */}
            <div className="relative h-9 mb-3">
              {/* Logo pour mode CLAIR */}
              <img
                src="/mideessi-light.webp"
                alt="MIDEESSI"
                className="h-9 w-auto object-contain dark:hidden"
              />
              {/* Logo pour mode SOMBRE */}
              <img
                src="/mideessi.webp"
                alt="MIDEESSI"
                className="h-9 w-auto object-contain hidden dark:block"
              />
            </div>

            <span className="text-[10px] font-black uppercase tracking-[0.2em]
              text-gray-500 dark:text-yellow-400/80">
              Menu principal
            </span>
          </div>

          {/* ── Navigation ── */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 scrollbar-none [scrollbar-width:none]
            bg-white dark:bg-[#080d1a]"
          >
            {menuSections.map((section, idx) => (
              <div
                key={idx}
                className="rounded-2xl overflow-hidden
                  bg-gray-50 border border-gray-200
                  dark:bg-[#0d1530] dark:border-white/8"
              >
                {/* Section label */}
                <div className="flex items-center gap-1.5 px-4 pt-3 pb-2">
                  <span className="text-[#191970] dark:text-yellow-400">{section.icon}</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.18em]
                    text-[#191970] dark:text-yellow-400/90">
                    {section.title}
                  </span>
                </div>

                {/* Items grid — 3 per row */}
                <div className="grid grid-cols-3 gap-1 p-2 pt-0">
                  {section.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        onClick={onClose}
                        className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200 text-center ${
                          active
                            ? 'bg-[#191970]/10 dark:bg-yellow-500/12 ring-1 ring-[#191970]/25 dark:ring-yellow-500/30'
                            : 'hover:bg-gray-100 dark:hover:bg-white/6'
                        }`}
                      >
                        <span className={`transition-colors ${
                          active
                            ? 'text-[#191970] dark:text-yellow-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {item.icon}
                        </span>
                        <span className={`text-[10px] font-bold leading-tight ${
                          active
                            ? 'text-[#191970] dark:text-yellow-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {item.label}
                        </span>
                        {active && (
                          <span className="w-1 h-1 rounded-full bg-[#191970] dark:bg-yellow-400 shadow-[0_0_5px_rgba(25,25,112,0.5)] dark:shadow-[0_0_6px_#FFD700]" />
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* ── Footer CTA ── */}
          <div className="px-4 pb-5 pt-3 flex-shrink-0
            border-t border-gray-200 bg-gray-50
            dark:border-white/8 dark:bg-[#080d1a]"
          >
            <a
              href="/contact"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3.5
                bg-[#191970] hover:bg-[#14145a] dark:bg-gradient-to-r dark:from-yellow-500 dark:to-amber-400 dark:hover:from-yellow-400 dark:hover:to-yellow-500
                text-white dark:text-midnight font-black text-xs uppercase tracking-widest
                rounded-2xl transition-all duration-300
                shadow-lg shadow-[#191970]/25 dark:shadow-yellow-500/25 active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              Démarrer un projet
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
