
import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    
    // Utiliser addEventListener pour la compatibilité moderne
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback pour les anciens navigateurs
      media.addListener(listener);
    }
    
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [matches, query]);

  return matches;
};

// Hook pour les breakpoints prédéfinis
export const useResponsiveQueries = () => {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px) and (max-width: 1279px)');
  const isXl = useMediaQuery('(min-width: 1280px)');
  
  const isSmallScreen = useMediaQuery('(max-width: 767px)');
  const isMediumScreen = useMediaQuery('(min-width: 768px) and (max-width: 1199px)');
  const isLargeScreen = useMediaQuery('(min-width: 1200px)');
  
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isLandscape = useMediaQuery('(orientation: landscape)');
  
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isXl,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isPortrait,
    isLandscape,
    prefersReducedMotion,
    prefersDarkMode,
    // Fonctions utilitaires
    isTouch: isMobile || isTablet,
    isWideScreen: isDesktop || isXl,
  };
};
