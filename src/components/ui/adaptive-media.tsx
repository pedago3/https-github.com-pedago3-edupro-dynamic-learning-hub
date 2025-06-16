
import React from 'react';
import { ResponsiveImage } from './responsive-image';
import { ResponsiveVideo } from './responsive-video';
import { cn } from '@/lib/utils';

interface AdaptiveMediaProps {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  className?: string;
  aspectRatio?: 'square' | '16/9' | '4/3' | '3/2' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  webpSrc?: string;
  avifSrc?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const AdaptiveMedia = ({
  type,
  src,
  alt = '',
  className,
  aspectRatio = 'auto',
  objectFit = 'cover',
  priority = false,
  loading = 'lazy',
  sizes = '100vw',
  poster,
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  webpSrc,
  avifSrc,
  fallbackSrc,
  onLoad,
  onError,
}: AdaptiveMediaProps) => {
  const containerClasses = cn(
    'relative w-full overflow-hidden',
    {
      'aspect-square': aspectRatio === 'square',
      'aspect-video': aspectRatio === '16/9',
      'aspect-[4/3]': aspectRatio === '4/3',
      'aspect-[3/2]': aspectRatio === '3/2',
    },
    className
  );

  if (type === 'video') {
    // Filter out 'scale-down' for video as it's not supported
    const videoObjectFit = objectFit === 'scale-down' ? 'contain' : objectFit as 'cover' | 'contain' | 'fill';
    
    return (
      <div className={containerClasses}>
        <ResponsiveVideo
          src={src}
          poster={poster}
          aspectRatio={aspectRatio}
          objectFit={videoObjectFit}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          onLoad={onLoad}
          onError={onError}
          className="absolute inset-0"
        />
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <ResponsiveImage
        src={src}
        alt={alt}
        aspectRatio={aspectRatio}
        objectFit={objectFit}
        priority={priority}
        loading={loading}
        sizes={sizes}
        webpSrc={webpSrc}
        avifSrc={avifSrc}
        fallbackSrc={fallbackSrc}
        onLoad={onLoad}
        onError={onError}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};
