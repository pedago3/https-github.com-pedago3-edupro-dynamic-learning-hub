
import React from 'react';
import { cn } from '@/lib/utils';
import { useImageFormat } from '@/hooks/useImageFormat';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  aspectRatio?: 'square' | '16/9' | '4/3' | '3/2' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  priority?: boolean;
  quality?: number;
  width?: number;
  height?: number;
  srcSet?: string;
  webpSrc?: string;
  avifSrc?: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export const ResponsiveImage = ({
  src,
  alt,
  className,
  sizes = '100vw',
  aspectRatio = 'auto',
  objectFit = 'cover',
  priority = false,
  quality = 75,
  width,
  height,
  srcSet,
  webpSrc,
  avifSrc,
  fallbackSrc,
  loading = 'lazy',
  onLoad,
  onError,
}: ResponsiveImageProps) => {
  const { webp: supportsWebP, avif: supportsAVIF } = useImageFormat();

  // Générer automatiquement les srcset si des variantes sont fournies
  const generateSrcSet = (baseSrc: string) => {
    if (srcSet) return srcSet;
    
    const breakpoints = [320, 640, 768, 1024, 1280, 1920];
    return breakpoints
      .map(bp => `${baseSrc}?w=${bp}&q=${quality} ${bp}w`)
      .join(', ');
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case '16/9':
        return 'aspect-video';
      case '4/3':
        return 'aspect-[4/3]';
      case '3/2':
        return 'aspect-[3/2]';
      default:
        return '';
    }
  };

  const getObjectFitClass = () => {
    switch (objectFit) {
      case 'cover':
        return 'object-cover';
      case 'contain':
        return 'object-contain';
      case 'fill':
        return 'object-fill';
      case 'scale-down':
        return 'object-scale-down';
      default:
        return 'object-cover';
    }
  };

  const imageClasses = cn(
    'max-w-full h-auto',
    getAspectRatioClass(),
    getObjectFitClass(),
    'transition-opacity duration-300',
    className
  );

  // Si nous avons plusieurs formats, utiliser la balise picture
  if ((avifSrc && supportsAVIF) || (webpSrc && supportsWebP)) {
    return (
      <picture className="block w-full">
        {avifSrc && supportsAVIF && (
          <source
            srcSet={generateSrcSet(avifSrc)}
            sizes={sizes}
            type="image/avif"
          />
        )}
        {webpSrc && supportsWebP && (
          <source
            srcSet={generateSrcSet(webpSrc)}
            sizes={sizes}
            type="image/webp"
          />
        )}
        <img
          src={fallbackSrc || src}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          alt={alt}
          className={imageClasses}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          onLoad={onLoad}
          onError={onError}
          decoding="async"
        />
      </picture>
    );
  }

  // Image simple avec srcset
  return (
    <img
      src={src}
      srcSet={generateSrcSet(src)}
      sizes={sizes}
      alt={alt}
      className={imageClasses}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
      onLoad={onLoad}
      onError={onError}
      decoding="async"
    />
  );
};
