import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'ghost';
}

const variantStyles: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-[var(--bg-card)] border border-[var(--border)] shadow-soft',
  elevated: 'bg-[var(--bg-card)] border border-[var(--border)] shadow-glow',
  ghost: 'bg-[var(--bg-card)] border border-transparent',
};

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  return (
    <div className={`rounded-[20px] p-5 ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
