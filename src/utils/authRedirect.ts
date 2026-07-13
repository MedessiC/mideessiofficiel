const REDIRECT_STORAGE_KEY = 'mideessi.auth.redirect';

export const getStoredRedirectTarget = (fallback = '/') => {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.sessionStorage.getItem(REDIRECT_STORAGE_KEY);
    if (!raw) return fallback;

    const value = raw.trim();
    return value.startsWith('/') ? value : fallback;
  } catch {
    return fallback;
  }
};

export const persistRedirectTarget = (target: string | null | undefined) => {
  if (typeof window === 'undefined') return;

  try {
    if (!target) {
      window.sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
      return;
    }

    const normalizedTarget = target.trim();
    if (!normalizedTarget || !normalizedTarget.startsWith('/')) {
      window.sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
      return;
    }

    if (normalizedTarget === '/login' || normalizedTarget === '/signup' || normalizedTarget.startsWith('/admin')) {
      window.sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
      return;
    }

    window.sessionStorage.setItem(REDIRECT_STORAGE_KEY, normalizedTarget);
  } catch {
    // ignore storage errors
  }
};

export const clearStoredRedirectTarget = () => {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
};

export const getRedirectTargetFromLocation = (location?: Location | URL) => {
  if (!location) return null;

  const search = typeof location === 'string' ? '' : location.search;
  const params = new URLSearchParams(search);
  const redirectParam = params.get('redirect');

  if (redirectParam) return redirectParam;

  return null;
};

export const peekStoredRedirectTarget = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(REDIRECT_STORAGE_KEY);
    if (!raw) return null;
    const value = raw.trim();
    return value.startsWith('/') ? value : null;
  } catch {
    return null;
  }
};
