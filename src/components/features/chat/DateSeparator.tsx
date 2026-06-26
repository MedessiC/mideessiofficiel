import React from 'react';

interface DateSeparatorProps {
  label: string;
}

export function DateSeparator({ label }: DateSeparatorProps) {
  return (
    <div className="flex items-center gap-3 py-4 text-[12px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
      <span className="h-px flex-1 bg-[var(--border)]" />
      <span>{label}</span>
      <span className="h-px flex-1 bg-[var(--border)]" />
    </div>
  );
}
