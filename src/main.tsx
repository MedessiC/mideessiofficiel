import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import initVersionCheck from './utils/versionCheck';

const rootElement = document.getElementById('root')!;

// Support pour react-snap (pre-rendering)
// Si la page a déjà été pré-rendue, on utilise hydrate
// Sinon, on utilise le rendu classique
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

// Initialiser la vérification de version toutes les 3 minutes
// Recharge silencieusement quand une nouvelle version est détectée
initVersionCheck({
  checkInterval: 3 * 60 * 1000, // 3 minutes
});