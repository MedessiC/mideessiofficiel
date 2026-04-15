import { Home, FileText, BarChart3, Calendar, Download, Target } from 'lucide-react';

interface BottomNavigationProps {
  activeSection: 'home' | 'infos' | 'kpis' | 'calendar' | 'reports' | 'messages' | 'objectives';
  onNavigate: (section: 'home' | 'infos' | 'kpis' | 'calendar' | 'reports' | 'messages' | 'objectives') => void;
}

const BottomNavigation = ({ activeSection, onNavigate }: BottomNavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'objectives', label: 'Objectifs', icon: Target },
    { id: 'kpis', label: 'Perfs', icon: BarChart3 },
    { id: 'calendar', label: 'Calendrier', icon: Calendar },
    { id: 'infos', label: 'Mes infos', icon: FileText },
    { id: 'reports', label: 'Rapports', icon: Download },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden z-40 safe-bottom">
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center justify-center h-full transition-all relative group ${
                isActive
                  ? 'text-gold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-midnight dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold to-yellow-400 transition-all"></div>
              )}

              {/* Icon */}
              <div className="relative flex items-center justify-center mb-1">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
              </div>

              {/* Label */}
              <span className="text-xs font-semibold leading-tight text-center line-clamp-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
