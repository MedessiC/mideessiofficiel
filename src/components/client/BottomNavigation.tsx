import { Home, Package, MessageCircle, Receipt, User } from 'lucide-react';

interface BottomNavigationProps {
  activeSection: 'home' | 'livrables' | 'messages' | 'factures' | 'compte' | 'infos' | 'kpis' | 'calendar' | 'reports' | 'objectives';
  unreadMessagesCount: number;
  onNavigate: (section: 'home' | 'livrables' | 'messages' | 'factures' | 'compte' | 'infos' | 'kpis' | 'calendar' | 'reports' | 'objectives') => void;
}

const BottomNavigation = ({ activeSection, unreadMessagesCount, onNavigate }: BottomNavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'livrables', label: 'Livrables', icon: Package },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'factures', label: 'Factures', icon: Receipt },
    { id: 'compte', label: 'Compte', icon: User },
  ] as const;

  return (
    <nav
      role="navigation"
      aria-label="Navigation principale"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--bg-card)]/98 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              className={`flex-1 flex flex-col items-center justify-center gap-1 rounded-3xl px-2 py-2 transition duration-150 ${
                isActive ? 'text-[var(--brand-midnight)]' : 'text-[var(--text-hint)] hover:text-[var(--brand-midnight)]'
              }`}
            >
              <div className={`relative flex h-11 w-11 items-center justify-center rounded-3xl ${
                isActive ? 'bg-[var(--brand-gold)]/20 text-[var(--brand-midnight)]' : 'bg-[var(--bg-surface)] text-[var(--text-hint)]'
              }`}>
                <Icon className="h-5 w-5" />
                {item.id === 'messages' && unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white">
                    {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] uppercase tracking-[0.12em]">{item.label}</span>
              {isActive && <span className="mt-1 h-1.5 w-8 rounded-full bg-[var(--brand-gold)]" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
