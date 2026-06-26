import React from 'react';

interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export function SkeletonCard({ lines = 3, className = '' }: SkeletonCardProps) {
  return (
    <div className={`space-y-3 rounded-[24px] bg-[var(--bg-card)] p-5 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="h-4 w-full rounded-full bg-slate-200/80 motion-safe:animate-pulse"></div>
      ))}
    </div>
  );
}
