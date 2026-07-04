export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'M';
}

export function hasValidAvatarUrl(value?: string | null): boolean {
  if (!value) return false;
  return /^https?:\/\//i.test(value.trim());
}
