
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveVideoProps {
  src?: string;
  poster?: string;
  className?: string;
  aspectRatio?: 'square' | '16/9' | '4/3' | '3/2' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill';
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  playsInline?: boolean;
  sources?: Array<{
    src: string;
    type: string;
    media?: string;
  }>;
  onLoad?: () => void;
  onError?: () => void;
}

export const ResponsiveVideo = ({
  src,
  poster,
  className,
  aspectRatio = '16/9',
  objectFit = 'cover',
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  preload = 'metadata',
  playsInline = true,
  sources = [],
  onLoad,
  onError,
}: ResponsiveVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoad = () => onLoad?.();
    const handleError = () => onError?.();

    video.addEventListener('loadeddata', handleLoad);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('error', handleError);
    };
  }, [onLoad, onError]);

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
      default:
        return 'object-cover';
    }
  };

  const videoClasses = cn(
    'w-full h-full max-w-full',
    getAspectRatioClass(),
    getObjectFitClass(),
    'transition-opacity duration-300',
    className
  );

  return (
    <div className={cn('relative w-full', getAspectRatioClass())}>
      <video
        ref={videoRef}
        className={videoClasses}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        preload={preload}
        playsInline={playsInline}
      >
        {sources.map((source, index) => (
          <source
            key={index}
            src={source.src}
            type={source.type}
            media={source.media}
          />
        ))}
        {src && <source src={src} />}
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
    </div>
  );
};
