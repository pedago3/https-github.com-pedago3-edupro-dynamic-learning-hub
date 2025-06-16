import { useMemo } from 'react';
import { useResponsiveQueries } from './useMediaQuery';
import { cn } from '@/lib/utils';

interface ThemeBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  xl: number;
}

interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

interface ThemeConfig {
  breakpoints: ThemeBreakpoints;
  spacing: ThemeSpacing;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  transitions: Record<string, string>;
}

const defaultTheme: ThemeConfig = {
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    xl: 1280,
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    fast: 'all 150ms ease',
    normal: 'all 300ms ease',
    slow: 'all 500ms ease',
  },
};

export const useTheme = (customTheme?: Partial<ThemeConfig>) => {
  const queries = useResponsiveQueries();
  
  const theme = useMemo(() => ({
    ...defaultTheme,
    ...customTheme,
  }), [customTheme]);
  
  const responsive = useMemo(() => ({
    spacing: (size: keyof ThemeSpacing) => {
      if (queries.isMobile) return theme.spacing[size];
      if (queries.isTablet) return `calc(${theme.spacing[size]} * 1.2)`;
      return `calc(${theme.spacing[size]} * 1.5)`;
    },
    
    borderRadius: (size: keyof typeof theme.borderRadius) => theme.borderRadius[size],
    
    shadow: (size: keyof typeof theme.shadows) => theme.shadows[size],
    
    transition: (speed: keyof typeof theme.transitions) => 
      queries.prefersReducedMotion ? 'none' : theme.transitions[speed],
    
    // Fonction pour créer des styles CSS-in-JS
    css: (styles: Record<string, any>) => {
      const cssVars: Record<string, string> = {};
      
      Object.entries(styles).forEach(([key, value]) => {
        if (typeof value === 'object') {
          // Support pour les styles nested
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            cssVars[`--${key}-${nestedKey}`] = String(nestedValue);
          });
        } else {
          cssVars[`--${key}`] = String(value);
        }
      });
      
      return cssVars;
    },
  }), [theme, queries]);
  
  return { theme, responsive, queries };
};

// Hook pour créer des composants avec variants (comme Material-UI)
export const useVariants = <T extends Record<string, Record<string, string>>>(variants: T) => {
  return useMemo(() => ({
    get: (variant: keyof T, size?: string) => {
      const variantStyles = variants[variant];
      if (!variantStyles) return '';
      
      if (size && variantStyles[size]) {
        return variantStyles[size];
      }
      
      return variantStyles.default || Object.values(variantStyles)[0] || '';
    },
    
    combine: (...variantKeys: (keyof T)[]) => {
      return cn(...variantKeys.map(key => variants[key]?.default || ''));
    },
  }), [variants]);
};
