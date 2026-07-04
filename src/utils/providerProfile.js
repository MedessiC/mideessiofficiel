export function getProviderAvatarUrl(userMetadata = {}) {
  const picture = typeof userMetadata?.picture === 'string' ? userMetadata.picture.trim() : '';
  if (picture) return picture;

  const avatarUrl = typeof userMetadata?.avatar_url === 'string' ? userMetadata.avatar_url.trim() : '';
  return avatarUrl || '';
}
