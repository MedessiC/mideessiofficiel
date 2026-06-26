import React from 'react';
import { Link2, FileText, BarChart2, ChevronRight } from 'lucide-react';

interface LivrableCardProps {
  title: string;
  description: string;
  type: 'link' | 'file' | 'report';
  date: string;
  onAction: () => void;
}

const iconMap = {
  link: Link2,
  file: FileText,
  report: BarChart2,
};

const colors = {
  link: 'bg-[#fef3c7] text-[#92400e]',
  file: 'bg-[#e0f2fe] text-[#075985]',
  report: 'bg-[#fef3c7] text-[#92400e]',
};

export function LivrableCard({ title, description, type, date, onAction }: LivrableCardProps) {
  const Icon = iconMap[type];

  return (
    <button
      type="button"
      onClick={onAction}
      className="w-full rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] p-4 text-left shadow-soft transition hover:border-[var(--brand-gold)]/30 hover:shadow-glow"
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-2xl p-3 ${colors[type]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-[var(--brand-midnight)]">{title}</h3>
            <ChevronRight className="h-4 w-4 text-[var(--text-hint)]" />
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)] line-clamp-2">{description}</p>
          <p className="mt-3 text-xs text-[var(--text-hint)]">{date}</p>
        </div>
      </div>
    </button>
  );
}
