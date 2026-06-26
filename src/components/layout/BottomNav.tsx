import { NavLink } from 'react-router-dom';
import { Home, Package, MessageCircle, Receipt, User } from 'lucide-react';

const navItems = [
  { label: 'Accueil', path: '/clients/dashboard', icon: Home },
  { label: 'Livrables', path: '/clients/livrables', icon: Package },
  { label: 'Messages', path: '/clients/messages', icon: MessageCircle },
  { label: 'Factures', path: '/clients/factures', icon: Receipt },
  { label: 'Compte', path: '/clients/compte', icon: User },
];

interface BottomNavProps {
  unreadCount: number;
}

export function BottomNav({ unreadCount }: BottomNavProps) {
  return (
    <nav
      role="navigation"
      aria-label="Navigation principale"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--bg-card)] backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex flex-1 flex-col items-center justify-center gap-1 rounded-3xl px-2 py-2 text-[11px] font-semibold transition ${
                  isActive
                    ? 'text-[var(--brand-midnight)]'
                    : 'text-[var(--text-hint)] hover:text-[var(--brand-midnight)]'
                }`
              }
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl text-[var(--text-hint)] group-hover:text-[var(--brand-midnight)]">
                <Icon className="h-5 w-5" />
                {item.label === 'Messages' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] uppercase tracking-[0.15em]">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
