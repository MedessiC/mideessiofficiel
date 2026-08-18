import { Search, BookOpen, FileText, Lightbulb, Info, Home, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  category: string;
  shortcut?: string;
}

interface CommandPaletteProps {
  triggerClassName?: string;
  showKeyboardHint?: boolean;
  buttonLabel?: string;
}

const CommandPalette = ({
  triggerClassName = 'hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-800 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600 rounded-lg text-gray-600 dark:text-gray-300 text-sm transition-all duration-300 hover:shadow-md border border-gray-300 dark:border-gray-600',
  showKeyboardHint = true,
  buttonLabel = 'Ctrl+K',
}: CommandPaletteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    {
      id: 'site-vitrine',
      label: 'Site web vitrine',
      description: 'Présence digitale premium, SEO et conversion pour votre activité',
      href: '/solutions/site-vitrine',
      icon: <Lightbulb className="w-4 h-4" />,
      category: 'Services',
    },
    {
      id: 'application-web',
      label: 'Application web',
      description: 'Outils, dashboards et automations sur mesure pour votre entreprise',
      href: '/solutions/application-web',
      icon: <Lightbulb className="w-4 h-4" />,
      category: 'Services',
    },
    {
      id: 'application-mobile',
      label: 'Application mobile',
      description: 'Expérience mobile native et sur mesure pour vos utilisateurs',
      href: '/solutions/application-mobile',
      icon: <Lightbulb className="w-4 h-4" />,
      category: 'Services',
    },
    {
      id: 'social-media',
      label: 'Réseaux sociaux & marketing',
      description: 'Gestion de contenus, visibilité et croissance sur les réseaux sociaux',
      href: '/solutions',
      icon: <Lightbulb className="w-4 h-4" />,
      category: 'Services',
    },
    {
      id: 'formations',
      label: 'Formations',
      description: 'Ateliers et formations pour monter en compétences',
      href: '/apprendre#formations',
      icon: <BookOpen className="w-4 h-4" />,
      category: 'Formation',
    },
    {
      id: 'livres',
      label: 'Livres',
      description: 'Consulter nos livres et ressources numériques',
      href: '/apprendre#livres',
      icon: <BookOpen className="w-4 h-4" />,
      category: 'Livres',
    },
    {
      id: 'articles',
      label: 'Articles',
      description: 'Lire nos articles et analyses',
      href: '/article',
      icon: <BookOpen className="w-4 h-4" />,
      category: 'Contenu',
    },
    {
      id: 'home',
      label: 'Accueil',
      description: 'Aller à la page d\'accueil',
      href: '/',
      icon: <Home className="w-4 h-4" />,
      category: 'Navigation',
      shortcut: 'H',
    },
    {
      id: 'learn',
      label: 'Apprendre',
      description: 'Accéder à la plateforme d\'apprentissage',
      href: '/apprendre',
      icon: <BookOpen className="w-4 h-4" />,
      category: 'Principal',
      shortcut: 'A',
    },
    {
      id: 'solutions',
      label: 'Solutions',
      description: 'Découvrir nos solutions',
      href: '/solutions',
      icon: <Lightbulb className="w-4 h-4" />,
      category: 'Principal',
      shortcut: 'S',
    },
    {
      id: 'projects',
      label: 'Projets',
      description: 'Explorer nos projets',
      href: '/projects',
      icon: <Lightbulb className="w-4 h-4" />,
      category: 'Navigation',
    },
    {
      id: 'about',
      label: 'À propos',
      description: 'En savoir plus sur MIDEESSI',
      href: '/about',
      icon: <Info className="w-4 h-4" />,
      category: 'Navigation',
    },
    {
      id: 'contact',
      label: 'Contact',
      description: 'Nous contacter',
      href: '/contact',
      icon: <FileText className="w-4 h-4" />,
      category: 'Navigation',
    },
  ];

  // Filter commands based on search
  const filteredCommands = [...commands]
    .filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description.toLowerCase().includes(search.toLowerCase()) ||
        cmd.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const categoryPriority: Record<string, number> = {
        Services: 0,
        Formation: 1,
        Livres: 2,
        Principal: 3,
        Navigation: 4,
      };

      const aPriority = categoryPriority[a.category] ?? 99;
      const bPriority = categoryPriority[b.category] ?? 99;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      const aLabel = a.label.toLowerCase();
      const bLabel = b.label.toLowerCase();
      const query = search.toLowerCase();

      const aStarts = aLabel.startsWith(query) ? 0 : 1;
      const bStarts = bLabel.startsWith(query) ? 0 : 1;

      if (aStarts !== bStarts) {
        return aStarts - bStarts;
      }

      return aLabel.localeCompare(bLabel);
    });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
        setSearch('');
        setSelectedIndex(0);
      }

      // Close on Escape
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
        setSelectedIndex(0);
      }

      // Navigate with arrow keys
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        }
        // Enter to select
        if (e.key === 'Enter' && filteredCommands.length > 0) {
          e.preventDefault();
          handleSelect(filteredCommands[selectedIndex]);
        }

        // Single letter shortcuts
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const matchingCmd = commands.find((cmd) => cmd.shortcut?.toLowerCase() === e.key.toLowerCase());
          if (matchingCmd && !search) {
            e.preventDefault();
            handleSelect(matchingCmd);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, search, selectedIndex, filteredCommands]);

  const handleSelect = (cmd: CommandItem) => {
    navigate(cmd.href);
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(0);
  };

  return (
    <>
      {/* Command Palette Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setSelectedIndex(0);
        }}
        className={triggerClassName}
        title="Appuie sur Cmd+K ou Ctrl+K pour rechercher"
        type="button"
      >
        <Search className="w-4 h-4" />
        {showKeyboardHint && <span className="hidden sm:inline min-w-fit text-xs font-semibold">{buttonLabel}</span>}
      </button>

      {/* Command Palette Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl animate-in slide-in-from-top-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Search Input */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-gray-50 dark:bg-gray-800">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Cherche une page... (H pour Accueil, A pour Apprendre, B pour Blog, S pour Solutions)"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Results */}
              {filteredCommands.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  {/* Group by category */}
                  {Array.from(new Set(filteredCommands.map((c) => c.category))).map((category) => (
                    <div key={category}>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                        {category}
                      </div>
                      {filteredCommands
                        .filter((c) => c.category === category)
                        .map((cmd) => {
                          const globalIndex = filteredCommands.indexOf(cmd);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <button
                              key={cmd.id}
                              onClick={() => handleSelect(cmd)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={`w-full px-4 py-3 flex items-center gap-3 transition-colors duration-150 border-l-2 ${
                                isSelected
                                  ? 'bg-[#ffd700]/20 border-[#ffd700] text-[#191970] dark:text-[#ffd700]'
                                  : 'border-transparent text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              <div className="text-[#191970] dark:text-[#ffd700] flex-shrink-0">
                                {cmd.icon}
                              </div>
                              <div className="text-left flex-1">
                                <div className="font-semibold text-sm">{cmd.label}</div>
                                <div className="text-xs opacity-60">{cmd.description}</div>
                              </div>
                              {cmd.shortcut && (
                                <div className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-semibold opacity-60">
                                  {cmd.shortcut}
                                </div>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Aucun résultat pour "{search}"</p>
                </div>
              )}

              {/* Footer */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                <div>
                  <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded mr-2">↓↑</span>
                  <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded mr-2">Entrée</span>
                  <span>pour sélectionner</span>
                </div>
                <span>
                  <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Esc</span>
                  {' pour fermer'}
                </span>
              </div>
            </div>
          </div>

          {/* Backdrop click to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => {
              setIsOpen(false);
              setSearch('');
              setSelectedIndex(0);
            }}
          />
        </div>
      )}
    </>
  );
};

export default CommandPalette;
