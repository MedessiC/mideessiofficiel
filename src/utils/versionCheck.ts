/**
 * Détecte automatiquement les nouvelles versions et recharge silencieusement
 * Utilise le hash du fichier pour détecter les changements
 */

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
    // Force le fetch sans cache
    const response = await fetch('/index.html', {
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
    return hashMatch ? hashMatch[1] : 'unknown';
  } catch (error) {
    console.error('Erreur lors de la vérification de version:', error);
    return 'error';
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
export const initVersionCheck = (config: VersionCheckConfig = {}) => {
  const { checkInterval = 3 * 60 * 1000 } = config;

  // Vérification initiale au chargement
  getIndexVersion().then((version) => {
    currentVersion = version;
    console.log('✅ Version actuelle:', version);
  });

  // Vérification périodique
  const checkForUpdates = async () => {
    const newVersion = await getIndexVersion();

    if (currentVersion && newVersion !== currentVersion && newVersion !== 'error') {
      console.log('🔄 Nouvelle version détectée! Recharge en cours...');
      silentReload();
      return;
    }

    currentVersion = newVersion;
  };

  // Vérifier au chargement initial + périodique
  checkTimeout = setInterval(checkForUpdates, checkInterval);

  // Vérifier aussi au focus (quand l'utilisateur revient à l'app)
  window.addEventListener('focus', checkForUpdates);

  return () => {
    if (checkTimeout) clearInterval(checkTimeout);
    window.removeEventListener('focus', checkForUpdates);
  };
};

export default initVersionCheck;
