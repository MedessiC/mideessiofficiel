import React from 'react';

interface StatutBadgeProps {
  status: 'Payée' | 'En attente';
}

export function StatutBadge({ status }: StatutBadgeProps) {
  const isPaid = status === 'Payée';
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${
      isPaid ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#ffedd5] text-[#92400e]'
    }`}>
      {status}
    </span>
  );
}
