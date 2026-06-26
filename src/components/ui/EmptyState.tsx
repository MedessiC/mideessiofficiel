import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-[24px] border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center ${className}`}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--brand-gold)]/15 text-[var(--brand-midnight)]">
        {icon || <span className="text-2xl">✨</span>}
      </div>
      <h3 className="text-lg font-semibold text-[var(--brand-midnight)]">{title}</h3>
      {description && <p className="mt-2 text-sm text-[var(--text-secondary)]">{description}</p>}
    </div>
  );
}
