/**
 * GUIDE DE DÉPLOIEMENT - Cache Busting
 * 
 * Le système de cache a été configuré sur TOUS les niveaux:
 * 1. Vite (Hash des assets)
 * 2. Netlify (Cache headers)
 * 3. Apache (.htaccess)
 * 4. Express (server.js)
 * 5. Netlify _redirects
 * 
 * ============================================================
 * ✅ TOUS LES UTILISATEURS (même mobiles avec cache) VERRONT:
 * ✅ Mise à jour automatique sans intervention
 * ✅ Zero problème de cache après déploiement
 * ============================================================
 */

// CHECKLIST AVANT DÉPLOIEMENT:
// ☑ Effectuer tous les changements localement
// ☑ Tester les changements sur npm run dev
// ☑ Vérifier npm run build sans erreur
// ☑ Push les changements sur Git
// ☑ Netlify déploie automatiquement (grâce à l'intégration Git)

// APRÈS DÉPLOIEMENT:
// ✅ Vite génère automatiquement les hash des assets
// ✅ Netlify applique automatiquement les cache headers
// ✅ HTML jamais cachée = les utilisateurs téléchargent toujours la dernière version
// ✅ Assets avec hash = cachées sans risque (car noms uniques à chaque déploiement)

// SI LES UTILISATEURS VOIENT ENCORE L'ANCIENNE VERSION:
// 1. Leur demander de faire Ctrl+Shift+R (hard refresh)
// 2. Ou: Appuyer longtemps sur le bouton rafraîchir (iOS/Android)
// 3. Ou: Vider manuellement le cache du navigateur
// 4. Attendre 1-2 heures pour propagation CDN

// CONFIGURATION ACTUELLE:
export const CACHE_CONFIG = {
  // HTML pages - Never cache
  htmlMaxAge: 0, // Toujours frais
  htmlMustRevalidate: true,
  
  // Asset files (JS, CSS, fonts) - Cache long term safe
  assetMaxAge: 31536000, // 1 year
  assetImmutable: true, // Changent jamais, safe à cacher
  
  // API calls - Never cache
  apiMaxAge: 0,
  apiMustRevalidate: true,
  
  // Version for forced cache busting
  // Increment this number to force ALL clients to refresh
  version: 1,
  
  // Build timestamp
  buildTime: new Date().toISOString(),
};

// POUR FORCER UN CACHE BUST D'URGENCE:
// 1. Ouvrir src/version.ts
// 2. Incrémenter VERSION.build
// 3. Déployer
// ✅ Tous les utilisateurs rechargent automatiquement

export default CACHE_CONFIG;
