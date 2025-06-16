
import { useMemo } from 'react';
import { Breakpoint } from './useBreakpointDetection';

interface CurrentConfig {
  columns: number | 'auto-fit' | 'auto-fill';
  gap: string;
  padding: string;
  minItemSize: string;
}

export const useLayoutStyles = (currentConfig: CurrentConfig, currentBreakpoint: Breakpoint) => {
  // Styles CSS générés
  const gridStyles = useMemo(() => {
    const styles: React.CSSProperties = {};
    
    if (typeof currentConfig.columns === 'number') {
      styles.gridTemplateColumns = `repeat(${currentConfig.columns}, 1fr)`;
    } else if (currentConfig.columns === 'auto-fit' || currentConfig.columns === 'auto-fill') {
      styles.gridTemplateColumns = `repeat(${currentConfig.columns}, minmax(${currentConfig.minItemSize}, 1fr))`;
    }
    
    styles.gap = currentConfig.gap;
    styles.padding = currentConfig.padding;
    
    return styles;
  }, [currentConfig]);

  const flexStyles = useMemo(() => ({
    gap: currentConfig.gap,
    padding: currentConfig.padding,
  }), [currentConfig]);

  // Classes CSS générées automatiquement
  const getResponsiveClasses = (baseClasses: string = '') => {
    const classes = [baseClasses];
    
    // Classes de breakpoint
    classes.push(`breakpoint-${currentBreakpoint}`);
    
    // Classes de colonne
    if (typeof currentConfig.columns === 'number') {
      classes.push(`grid-cols-${currentConfig.columns}`);
    } else {
      classes.push(`grid-${currentConfig.columns}`);
    }
    
    return classes.filter(Boolean).join(' ');
  };

  return {
    gridStyles,
    flexStyles,
    getResponsiveClasses,
  };
};
