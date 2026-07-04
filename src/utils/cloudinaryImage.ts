export const isCloudinaryUrl = (url?: string | null) => !!url && /cloudinary\.com/i.test(url);

export const toCloudinaryUrl = (url?: string | null, options?: { width?: number; height?: number; quality?: number; crop?: string }) => {
  if (!url) return '';

  if (!isCloudinaryUrl(url)) {
    return url;
  }

  const params = new URLSearchParams();
  if (options?.width) params.set('w', String(options.width));
  if (options?.height) params.set('h', String(options.height));
  if (options?.quality) params.set('q', String(options.quality));
  if (options?.crop) params.set('c', options.crop);

  const suffix = params.toString();
  return suffix ? `${url}${url.includes('?') ? '&' : '?'}${suffix}` : url;
};
