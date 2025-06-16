
import { useMemo } from 'react';
import { useResponsiveQueries } from './useMediaQuery';
import { cn } from '@/lib/utils';

interface ResponsiveStyleConfig {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  xl?: string;
  base?: string;
  // Conditions avancées
  touch?: string;
  portrait?: string;
  landscape?: string;
  reducedMotion?: string;
  darkMode?: string;
}

interface ConditionalStyle {
  condition: boolean;
  className: string;
}

export const useResponsiveStyles = (config: ResponsiveStyleConfig) => {
  const queries = useResponsiveQueries();
  
  const computedClasses = useMemo(() => {
    const classes: string[] = [];
    
    // Classe de base
    if (config.base) {
      classes.push(config.base);
    }
    
    // Classes responsive selon les breakpoints
    if (config.mobile && queries.isMobile) {
      classes.push(config.mobile);
    }
    
    if (config.tablet && queries.isTablet) {
      classes.push(config.tablet);
    }
    
    if (config.desktop && queries.isDesktop) {
      classes.push(config.desktop);
    }
    
    if (config.xl && queries.isXl) {
      classes.push(config.xl);
    }
    
    // Classes conditionnelles
    if (config.touch && queries.isTouch) {
      classes.push(config.touch);
    }
    
    if (config.portrait && queries.isPortrait) {
      classes.push(config.portrait);
    }
    
    if (config.landscape && queries.isLandscape) {
      classes.push(config.landscape);
    }
    
    if (config.reducedMotion && queries.prefersReducedMotion) {
      classes.push(config.reducedMotion);
    }
    
    if (config.darkMode && queries.prefersDarkMode) {
      classes.push(config.darkMode);
    }
    
    return cn(...classes);
  }, [config, queries]);
  
  return computedClasses;
};

// Hook pour styles conditionnels multiples
export const useConditionalStyles = (styles: ConditionalStyle[]) => {
  return useMemo(() => {
    const activeClasses = styles
      .filter(style => style.condition)
      .map(style => style.className);
    
    return cn(...activeClasses);
  }, [styles]);
};

// Hook pour créer des styles comme styled-components
export const useStyledComponent = (baseClasses: string) => {
  const queries = useResponsiveQueries();
  
  const styled = useMemo(() => ({
    mobile: (classes: string) => queries.isMobile ? cn(baseClasses, classes) : baseClasses,
    tablet: (classes: string) => queries.isTablet ? cn(baseClasses, classes) : baseClasses,
    desktop: (classes: string) => queries.isDesktop ? cn(baseClasses, classes) : baseClasses,
    xl: (classes: string) => queries.isXl ? cn(baseClasses, classes) : baseClasses,
    when: (condition: boolean, classes: string) => condition ? cn(baseClasses, classes) : baseClasses,
    variant: (variant: Record<string, string>, activeVariant: string) => 
      cn(baseClasses, variant[activeVariant] || ''),
  }), [baseClasses, queries]);
  
  return styled;
};
