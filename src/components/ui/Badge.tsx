import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-[var(--brand-midnight)] text-white',
  secondary: 'bg-[var(--brand-gold)] text-[var(--brand-midnight)]',
  success: 'bg-[#dcfce7] text-[#166534]',
  warning: 'bg-[#fef9c3] text-[#78350f]',
  danger: 'bg-[#fee2e2] text-[#b91c1c]',
};

export function Badge({ label, variant = 'primary', size = 'md', className = '' }: BadgeProps) {
  const sizeStyles = size === 'sm' ? 'h-7 text-[11px]' : 'h-8 text-[12px]';

  return (
    <span className={`inline-flex items-center justify-center rounded-full px-3 font-semibold tracking-[0.02em] ${sizeStyles} ${variantStyles[variant]} ${className}`}>
      {label}
    </span>
  );
}
