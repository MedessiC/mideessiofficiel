import React, { ReactNode } from 'react';

interface BottomSheetProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ open, title, onClose, children }: BottomSheetProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm transition-opacity ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      <div className={`w-full max-w-2xl rounded-t-[28px] bg-[var(--bg-card)] p-5 shadow-soft transition-transform duration-300 ease-out ${open ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex items-center justify-between pb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-hint)]">{title}</p>
          </div>
          <button type="button" onClick={onClose} className="text-[var(--text-hint)] hover:text-[var(--brand-midnight)]">
            Fermer
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
