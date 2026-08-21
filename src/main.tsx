import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ── Suppression des erreurs parasites générées par les extensions Chrome ──────
// Ces erreurs ("message port closed") viennent de content.js des extensions
// (Copilot, Grammarly, LastPass…) — elles n'affectent PAS l'application.
if (import.meta.env.DEV) {
  const _origError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    const msg = String(args[0] ?? '');
    if (
      msg.includes('message port closed') ||
      msg.includes('message channel closed') ||
      msg.includes('A listener indicated an asynchronous response')
    ) return;
    _origError(...args);
  };

  window.addEventListener('unhandledrejection', (e) => {
    const msg = String(e.reason?.message ?? e.reason ?? '');
    if (
      msg.includes('message port closed') ||
      msg.includes('message channel closed') ||
      msg.includes('A listener indicated an asynchronous response')
    ) {
      e.preventDefault(); // Empêche l'affichage dans la console
    }
  });
}
// ─────────────────────────────────────────────────────────────────────────────

const rootElement = document.getElementById('root')!;

// Support pour react-snap (pre-rendering)
if (rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
