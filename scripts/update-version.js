#!/usr/bin/env node

/**
 * Script pour automatiser la mise à jour de la version
 * Exécuté avant chaque build pour forcer un cache bust
 * 
 * Usage: node scripts/update-version.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const versionFile = path.join(__dirname, '../src/version.ts');

// Lire le fichier de version actuel
let versionContent = fs.readFileSync(versionFile, 'utf8');

// Parser la version actuelle
const buildMatch = versionContent.match(/build:\s*(\d+)/);
const currentBuild = buildMatch ? parseInt(buildMatch[1]) : 0;
const newBuild = currentBuild + 1;

// Générer nouveau contenu
const newContent = `/**
 * CACHE VERSION MANAGEMENT
 * Update this file to force a new version and invalidate caches
 * Useful for forcing clients to reload all assets
 */

export const VERSION = {
  // Main version number - increment this to force full cache bust
  major: 1,
  minor: 0,
  patch: 0,
  
  // Cache bust timestamp - auto-update on each deployment
  timestamp: new Date('${new Date().toISOString()}').toISOString(),
  
  // Build number - increment for each deployment
  build: ${newBuild},
  
  // Full version string for debugging
  get fullVersion() {
    return \`\${this.major}.\${this.minor}.\${this.patch} (build \${this.build})\`;
  },
  
  // Date for cache busting headers
  get cacheKey() {
    return \`v\${this.major}\${this.minor}\${this.patch}-\${this.build}\`;
  }
};

// Log version on console
console.log(\`🚀 MIDEESSI v\${VERSION.fullVersion}\`);
console.log(\`📦 Cache Key: \${VERSION.cacheKey}\`);
console.log(\`⏰ Deploy Time: \${VERSION.timestamp}\`);
`;

// Écrire le nouveau fichier
fs.writeFileSync(versionFile, newContent, 'utf8');

console.log(`✅ Version updated: build ${currentBuild} → build ${newBuild}`);
console.log(`📦 Timestamp: ${new Date().toISOString()}`);
console.log(`🔄 Cache will be busted on deployment`);
