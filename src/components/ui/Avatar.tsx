import React from 'react';
import { getInitials, hasValidAvatarUrl } from './avatarUtils';

interface AvatarProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string | null;
}

export function Avatar({ name, className = '', size = 'md', src }: AvatarProps) {
  const initials = getInitials(name);
  const sizes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-16 w-16 text-xl',
  };

  if (hasValidAvatarUrl(src)) {
    return (
      <img
        src={src!}
        alt={name}
        className={`rounded-full object-cover ${sizes[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[var(--brand-midnight)] text-[var(--brand-gold)] font-semibold ${sizes[size]} ${className}`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
