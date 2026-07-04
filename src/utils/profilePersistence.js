export function getProfileSavePayloadAttempts(data) {
  const basePayload = {
    id: data.id,
    email: data.email,
    username: data.username,
    avatar_url: data.avatar_url?.trim() || null,
    bio: data.bio?.trim() || null,
  };

  const extendedPayload = {
    ...basePayload,
    website: data.website?.trim() || null,
    location: data.location?.trim() || null,
  };

  return [extendedPayload, basePayload];
}
