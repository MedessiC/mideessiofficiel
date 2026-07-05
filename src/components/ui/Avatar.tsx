import React, { useState } from 'react';
import { getInitials, hasValidAvatarUrl } from './avatarUtils';

interface AvatarProps {
  name: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  src?: string | null;
  onClick?: () => void;
}

const sizes = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl',
};

export function Avatar({ name, className = '', size = 'md', src, onClick }: AvatarProps) {
  const initials = getInitials(name);
  const [imgError, setImgError] = useState(false);

  const sizeClass = sizes[size];
  const baseClass = `rounded-full flex-shrink-0 ${sizeClass} ${className} ${onClick ? 'cursor-pointer' : ''}`;

  if (hasValidAvatarUrl(src) && !imgError) {
    return (
      <img
        src={src!}
        alt={name}
        onClick={onClick}
        onError={() => setImgError(true)}
        className={`${baseClass} object-cover ring-2 ring-[var(--brand-gold)]/20`}
      />
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${baseClass} flex items-center justify-center bg-gradient-to-br from-[var(--brand-midnight)] to-[#1e2a4a] text-[var(--brand-gold)] font-bold ring-2 ring-[var(--brand-gold)]/20 select-none`}
      aria-label={`Avatar de ${name}`}
    >
      {initials}
    </div>
  );
}
