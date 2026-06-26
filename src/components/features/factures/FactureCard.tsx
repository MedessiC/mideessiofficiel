import React from 'react';
import { StatutBadge } from './StatutBadge';

interface FactureCardProps {
  periode: string;
  montant: string;
  status: 'Payée' | 'En attente';
  issuedAt: string;
  onReport?: () => void;
}

export function FactureCard({ periode, montant, status, issuedAt, onReport }: FactureCardProps) {
  return (
    <div className="rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--brand-gold)]/90">{periode}</p>
          <p className={`mt-2 text-2xl font-semibold ${status === 'En attente' ? 'text-[var(--brand-gold)]' : 'text-[var(--brand-midnight)]'}`}>
            {montant}
          </p>
        </div>
        <StatutBadge status={status} />
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[var(--text-hint)]">Émise le {issuedAt}</p>
        {status === 'En attente' && onReport && (
          <button
            type="button"
            onClick={onReport}
            className="rounded-full border border-[var(--brand-gold)] bg-transparent px-4 py-2 text-xs font-semibold text-[var(--brand-gold)] transition hover:bg-[var(--brand-gold)]/10"
          >
            Signaler un paiement
          </button>
        )}
      </div>
    </div>
  );
}
