import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const variantStyles = {
  success: 'bg-[#ecfdf5] text-[#16a34a]',
  error: 'bg-[#fee2e2] text-[#b91c1c]',
  info: 'bg-[var(--brand-gold)]/10 text-[var(--brand-midnight)]',
};

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className={`fixed bottom-24 left-1/2 z-50 w-[min(90vw,420px)] -translate-x-1/2 rounded-[20px] border border-[var(--border)] p-4 shadow-soft ${variantStyles[type]}`}>
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}
