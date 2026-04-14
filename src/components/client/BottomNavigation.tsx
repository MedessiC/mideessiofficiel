import { Home, FileText, BarChart3, Calendar, Download, MessageCircle, Target } from 'lucide-react';

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
    { id: 'reports', label: 'Rapports', icon: Download },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden z-40">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-colors relative ${
                isActive
                  ? 'text-gold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-midnight dark:hover:text-white'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold to-yellow-400"></div>
              )}
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
