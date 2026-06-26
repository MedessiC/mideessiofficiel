import React from 'react';
import { Paperclip, Send } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function MessageInput({ value, onChange, onSend, disabled }: MessageInputProps) {
  return (
    <div className="sticky bottom-0 z-30 border-t border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.06)] lg:px-6">
      <div className="flex items-center gap-3">
        <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-surface)] text-[var(--text-hint)] hover:text-[var(--brand-midnight)] transition" aria-label="Ajouter un fichier">
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="flex-1 h-11 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-midnight)] focus:ring-2 focus:ring-[var(--brand-gold)]/15 transition"
          placeholder="Écrire un message..."
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-midnight)] text-white transition hover:bg-[#23238d] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Envoyer le message"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
