import { useState, ImgHTMLAttributes, FC } from 'react';

interface RobustImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  onLoadError?: (error: any) => void;
}

/**
 * Composant Image robuste avec gestion d'erreurs
 * Utilise un fallback SVG si l'image ne charge pas
 */
const RobustImage: FC<RobustImageProps> = ({
  src,
  alt = 'Image',
  fallbackSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="16" fill="%23999" text-anchor="middle" dy=".3em"%3E📷 Image indisponible%3C/text%3E%3C/svg%3E',
  onLoadError,
  ...props
}) => {
  const [imageSource, setImageSource] = useState<string>(src || '');
  const [isError, setIsError] = useState(false);

  const handleError = (error: any) => {
    console.warn(`⚠️ Image non chargée: ${src}`);
    if (!isError) {
      setIsError(true);
      setImageSource(fallbackSrc);
      if (onLoadError) {
        onLoadError(error);
      }
    }
  };

  const handleLoad = () => {
    if (isError) {
      console.log(`✅ Image chargée après fallback: ${imageSource}`);
      setIsError(false);
    }
  };

  return (
    <img
      {...props}
      src={imageSource}
      alt={alt}
      onError={handleError}
      onLoad={handleLoad}
      loading={props.loading || 'lazy'}
      decoding={props.decoding || 'async'}
    />
  );
};

export default RobustImage;
