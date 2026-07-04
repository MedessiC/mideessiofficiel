export function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

export function sanitizeUsername(value) {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
  const cleaned = normalized.replace(/(^-|-$)/g, '');
  return cleaned || 'user';
}

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères.' };
  }

  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins une majuscule et un chiffre.' };
  }

  return { valid: true, message: null };
}

export function validateProfileData(data) {
  const username = (data.username || '').trim();
  if (!username || username.length < 3) {
    return { valid: false, message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères.' };
  }

  if (username.length > 24) {
    return { valid: false, message: 'Le nom d\'utilisateur ne peut pas dépasser 24 caractères.' };
  }

  if (data.avatar_url && !/^https?:\/\//i.test(data.avatar_url.trim())) {
    return { valid: false, message: 'L’URL de l’avatar doit commencer par http:// ou https://.' };
  }

  return { valid: true, message: null };
}
