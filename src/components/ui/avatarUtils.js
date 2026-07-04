export function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'M';
}

export function hasValidAvatarUrl(value) {
  if (!value) return false;
  return /^https?:\/\//i.test(value.trim());
}
