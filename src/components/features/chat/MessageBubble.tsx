import React from 'react';

interface MessageBubbleProps {
  author: 'client' | 'admin';
  message: string;
  timestamp: string;
  read?: boolean;
  tag?: string;
}

export function MessageBubble({ author, message, timestamp, read, tag }: MessageBubbleProps) {
  const isClient = author === 'client';
  return (
    <div className={`flex ${isClient ? 'justify-end' : 'justify-start'} px-2 py-1`}>
      <div className={`max-w-[85%] rounded-[24px] border p-4 text-sm shadow-sm ${
        isClient
          ? 'bg-[var(--brand-midnight)] text-white rounded-[18px_18px_4px_18px] border-transparent'
          : 'bg-[var(--bg-card)] text-[var(--text-primary)] rounded-[18px_18px_18px_4px] border border-[var(--border)]'
      }`}>
        {tag && (
          <div className="mb-2 inline-flex rounded-full bg-[var(--brand-gold)]/15 px-3 py-1 text-xs font-semibold text-[var(--brand-midnight)]">
            {tag}
          </div>
        )}
        <p className="whitespace-pre-wrap leading-relaxed">{message}</p>
        <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--text-hint)]">
          <span>{timestamp}</span>
          {isClient && (
            <span className="font-semibold text-[var(--brand-gold)]">{read ? 'Lu' : 'Envoyé'}</span>
          )}
        </div>
      </div>
    </div>
  );
}
