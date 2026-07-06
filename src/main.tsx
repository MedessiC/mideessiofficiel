import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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

if ('serviceWorker' in navigator) {
  // Disable service worker: unregister any existing registrations and
  // prevent new registration from being created.
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const r of registrations) await r.unregister();
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) await reg.unregister();
    } catch (e) {
      // ignore failures during unregister
    }
  });
}
