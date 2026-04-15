/**
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
  timestamp: new Date('2026-04-15T14:55:27.406Z').toISOString(),
  
  // Build number - increment for each deployment
  build: 2,
  
  // Full version string for debugging
  get fullVersion() {
    return `${this.major}.${this.minor}.${this.patch} (build ${this.build})`;
  },
  
  // Date for cache busting headers
  get cacheKey() {
    return `v${this.major}${this.minor}${this.patch}-${this.build}`;
  }
};

// Log version on console
console.log(`🚀 MIDEESSI v${VERSION.fullVersion}`);
console.log(`📦 Cache Key: ${VERSION.cacheKey}`);
console.log(`⏰ Deploy Time: ${VERSION.timestamp}`);
