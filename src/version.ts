/**
 * Version info - simple
 */

export const VERSION = {
  major: 1,
  minor: 0,
  patch: 2,
  build: 3,
  
  get fullVersion() {
    return `${this.major}.${this.minor}.${this.patch}`;
  }
};

// Log version on startup
console.log(`🚀 MIDEESSI v${VERSION.fullVersion}`);
