
import { useState, useEffect } from 'react';

interface OrientationState {
  isPortrait: boolean;
  isLandscape: boolean;
  angle: number;
  aspectRatio: number;
}

export const useOrientationQuery = () => {
  const [orientation, setOrientation] = useState<OrientationState>({
    isPortrait: window.innerHeight > window.innerWidth,
    isLandscape: window.innerWidth > window.innerHeight,
    angle: 0,
    aspectRatio: window.innerWidth / window.innerHeight
  });

  useEffect(() => {
    const updateOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isPortrait = height > width;
      
      setOrientation({
        isPortrait,
        isLandscape: !isPortrait,
        angle: screen.orientation?.angle || 0,
        aspectRatio: width / height
      });
    };

    // Écouter les changements d'orientation
    window.addEventListener('orientationchange', updateOrientation);
    window.addEventListener('resize', updateOrientation);
    
    // Écouter l'API d'orientation moderne
    if (screen.orientation) {
      screen.orientation.addEventListener('change', updateOrientation);
    }

    return () => {
      window.removeEventListener('orientationchange', updateOrientation);
      window.removeEventListener('resize', updateOrientation);
      
      if (screen.orientation) {
        screen.orientation.removeEventListener('change', updateOrientation);
      }
    };
  }, []);

  return orientation;
};
