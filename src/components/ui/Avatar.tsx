import React from 'react';

interface AvatarProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ name, className = '', size = 'md' }: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const sizes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-16 w-16 text-xl',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[var(--brand-midnight)] text-[var(--brand-gold)] font-semibold ${sizes[size]} ${className}`}
      aria-hidden="true"
    >
      {initials || 'M'}
    </div>
  );
}
