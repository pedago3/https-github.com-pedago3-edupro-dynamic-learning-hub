
import { useMemo } from 'react';
import { Breakpoint } from './useBreakpointDetection';

interface LayoutConfig {
  columns?: Partial<Record<Breakpoint, number | 'auto-fit' | 'auto-fill'>>;
  gap?: Partial<Record<Breakpoint, string>>;
  padding?: Partial<Record<Breakpoint, string>>;
  minItemSize?: Partial<Record<Breakpoint, string>>;
}

export const useLayoutConfig = (config: LayoutConfig, currentBreakpoint: Breakpoint) => {
  // Obtenir la valeur actuelle pour un breakpoint donné
  const getCurrentValue = <T>(values: Partial<Record<Breakpoint, T>>, fallback: T): T => {
    return values[currentBreakpoint] || 
           values.desktop || 
           values.tablet || 
           values.mobile || 
           fallback;
  };

  // Configuration actuelle
  const currentConfig = useMemo(() => ({
    columns: getCurrentValue(config.columns || {}, 'auto-fit'),
    gap: getCurrentValue(config.gap || {}, '1rem'),
    padding: getCurrentValue(config.padding || {}, '1rem'),
    minItemSize: getCurrentValue(config.minItemSize || {}, '280px'),
  }), [config, currentBreakpoint]);

  return {
    currentConfig,
    getCurrentValue,
  };
};
