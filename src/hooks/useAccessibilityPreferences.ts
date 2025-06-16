
import { useMemo } from 'react';
import { useMediaQuery } from './useMediaQuery';

export interface AccessibilityPreferences {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersLargeText: boolean;
  prefersDarkMode: boolean;
  prefersReducedTransparency: boolean;
  isUsingKeyboard: boolean;
}

export const useAccessibilityPreferences = (): AccessibilityPreferences => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersHighContrast = useMediaQuery('(prefers-contrast: high)');
  const prefersLargeText = useMediaQuery('(prefers-reduced-data: reduce)');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersReducedTransparency = useMediaQuery('(prefers-reduced-transparency: reduce)');
  
  // Détection de navigation clavier basique
  const isUsingKeyboard = useMemo(() => {
    if (typeof window === 'undefined') return false;
    
    let keyboardDetected = false;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        keyboardDetected = true;
        document.body.classList.add('using-keyboard');
      }
    };
    
    const handleMouseDown = () => {
      keyboardDetected = false;
      document.body.classList.remove('using-keyboard');
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return {
    prefersReducedMotion,
    prefersHighContrast,
    prefersLargeText,
    prefersDarkMode,
    prefersReducedTransparency,
    isUsingKeyboard: false, // Sera géré par les classes CSS
  };
};

// Hook pour les styles d'accessibilité adaptatifs
export const useAccessibleResponsiveStyles = (baseClasses: string) => {
  const a11yPrefs = useAccessibilityPreferences();
  
  return useMemo(() => {
    const classes = [baseClasses];
    
    // Ajout de classes selon les préférences
    if (a11yPrefs.prefersReducedMotion) {
      classes.push('motion-reduce:transition-none motion-reduce:animate-none');
    }
    
    if (a11yPrefs.prefersHighContrast) {
      classes.push('contrast-more:border-2 contrast-more:border-black');
    }
    
    if (a11yPrefs.prefersReducedTransparency) {
      classes.push('backdrop-blur-none bg-opacity-100');
    }
    
    // Classes pour navigation clavier
    classes.push(
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-white',
      'dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900'
    );
    
    return classes.join(' ');
  }, [baseClasses, a11yPrefs]);
};
