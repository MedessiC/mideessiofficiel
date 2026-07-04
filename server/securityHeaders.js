const isProduction = process.env.NODE_ENV === 'production';

export function getSecurityHeaders() {
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com https://images.unsplash.com https://*.unsplash.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co https://*.supabase.com https://*.cloudinary.com https://api.cloudinary.com https://ep1.adtrafficquality.google",
    "media-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com",
    "frame-src https://www.youtube.com https://player.vimeo.com https://googleads.g.doubleclick.net",
    "upgrade-insecure-requests",
  ].join('; ');

  return {
    'Content-Security-Policy': csp,
    'Strict-Transport-Security': isProduction
      ? 'max-age=31536000; includeSubDomains'
      : 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'X-DNS-Prefetch-Control': 'off',
  };
}
