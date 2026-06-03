/**
 * Détecte automatiquement les nouvelles versions et recharge silencieusement
 * Utilise le hash du fichier pour détecter les changements
 */

import { VERSION } from '../version';

interface VersionCheckConfig {
  checkInterval?: number; // Millisecondes entre les vérifications (default: 5 minutes)
}

let currentVersion: string | null = null;
let checkTimeout: NodeJS.Timeout | null = null;

/**
 * Récupère la version du fichier HTML (via son hash)
 */
const getIndexVersion = async (): Promise<string> => {
  try {
    // Essayer d'abord de charger version.json
    const versionResponse = await fetch('/version.json?t=' + Date.now(), {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      cache: 'no-store',
    });

    if (versionResponse.ok) {
      const versionData = await versionResponse.json();
      return versionData.version || versionData.buildHash || VERSION.cacheKey;
    }

    // Fallback: charger index.html et extraire le hash
    const response = await fetch('/index.html?t=' + Date.now(), {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      cache: 'no-store',
    });

    const html = await response.text();
    
    // Extrait le hash des scripts (ils contiennent [hash])
    const hashMatch = html.match(/\/assets\/.*?\-([a-f0-9]+)\.js/);
    return hashMatch ? hashMatch[1] : VERSION.cacheKey;
  } catch (error) {
    console.error('Erreur lors de la vérification de version:', error);
    return VERSION.cacheKey; // Utiliser la version du fichier comme fallback
  }
};

/**
 * Recharge silencieusement la page
 */
const silentReload = () => {
  console.log('🔄 Recharge silencieuse - nouvelle version disponible');
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }

  // Recharge
  window.location.href = window.location.href;
};

/**
 * Initialise la vérification périodique de nouvelles versions
 */
export const initVersionCheck = () => {
  // Désactivé - cache HTTP navigateur suffit
};

export default initVersionCheck;
