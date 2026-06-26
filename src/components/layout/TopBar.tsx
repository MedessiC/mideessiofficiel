import { Bell, Menu } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

interface TopBarProps {
  title: string;
  subtitle?: string;
  clientName: string;
  email: string;
  hasUnread: boolean;
  onMenuClick?: () => void;
}

export function TopBar({ title, subtitle, clientName, email, hasUnread, onMenuClick }: TopBarProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-card)]/98 backdrop-blur-xl px-4 py-3 shadow-sm lg:px-6">
      <div className="flex min-h-[60px] items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Ouvrir le menu"
              className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--bg-surface)] text-[var(--brand-midnight)] transition hover:bg-[var(--bg-card)] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--brand-gold-muted)]">Espace client</p>
            <h1 className="mt-1 text-lg font-display font-semibold text-[var(--brand-midnight)] sm:text-xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</p>}
          </div>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-[var(--bg-surface)] text-[var(--brand-midnight)] transition hover:bg-[var(--bg-card)]"
          >
            <Bell className="h-5 w-5" />
            {hasUnread && <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-600" />}
          </button>
          <div className="flex items-center gap-3 rounded-3xl bg-[var(--bg-surface)] px-3 py-2 shadow-inner-soft">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-midnight)] text-[var(--brand-gold)] text-xs font-semibold">
              {clientName?.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold text-[var(--brand-midnight)]">{clientName}</p>
              <p className="text-[var(--text-hint)]">{email}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4 lg:hidden">
        <div className="flex items-center gap-3 rounded-3xl bg-[var(--bg-surface)] px-3 py-2 shadow-inner-soft">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-midnight)] text-[var(--brand-gold)] text-xs font-semibold">
            {clientName?.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-[var(--brand-midnight)]">{clientName}</p>
            <p className="text-[var(--text-hint)]">{email}</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-[var(--bg-surface)] text-[var(--brand-midnight)] transition hover:bg-[var(--bg-card)]"
        >
          <Bell className="h-5 w-5" />
          {hasUnread && <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-600" />}
        </button>
      </div>
    </div>
  );
}
