
import { useBreakpointDetection } from './useBreakpointDetection';
import { useLayoutConfig } from './useLayoutConfig';
import { useContainerObserver } from './useContainerObserver';
import { useLayoutCalculations } from './useLayoutCalculations';
import { useLayoutStyles } from './useLayoutStyles';
import { Breakpoint } from './useBreakpointDetection';

interface LayoutConfig {
  columns?: Partial<Record<Breakpoint, number | 'auto-fit' | 'auto-fill'>>;
  gap?: Partial<Record<Breakpoint, string>>;
  padding?: Partial<Record<Breakpoint, string>>;
  minItemSize?: Partial<Record<Breakpoint, string>>;
}

export const useFlexibleLayout = (config: LayoutConfig = {}) => {
  const breakpointData = useBreakpointDetection();
  const { currentConfig, getCurrentValue } = useLayoutConfig(config, breakpointData.currentBreakpoint);
  const { containerWidth, useContainerObserver: observeContainer } = useContainerObserver();
  const calculationData = useLayoutCalculations(currentConfig, containerWidth);
  const styleData = useLayoutStyles(currentConfig, breakpointData.currentBreakpoint);

  return {
    // État actuel
    currentBreakpoint: breakpointData.currentBreakpoint,
    currentConfig,
    containerWidth,
    itemCount: calculationData.itemCount,
    
    // Breakpoints
    isMobile: breakpointData.isMobile,
    isTablet: breakpointData.isTablet,
    isDesktop: breakpointData.isDesktop,
    isXl: breakpointData.isXl,
    is2xl: breakpointData.is2xl,
    
    // Calculs
    calculateOptimalColumns: calculationData.calculateOptimalColumns,
    calculateItemDistribution: calculationData.calculateItemDistribution,
    
    // Styles
    gridStyles: styleData.gridStyles,
    flexStyles: styleData.flexStyles,
    getResponsiveClasses: styleData.getResponsiveClasses,
    
    // Utilitaires
    useContainerObserver: observeContainer,
    setItemCount: calculationData.setItemCount,
    getCurrentValue,
    
    // Méthodes pour les composants
    getGridProps: () => ({
      style: styleData.gridStyles,
      className: styleData.getResponsiveClasses('flexible-grid'),
      'data-breakpoint': breakpointData.currentBreakpoint,
      'data-columns': currentConfig.columns,
    }),
    
    getFlexProps: () => ({
      style: styleData.flexStyles,
      className: styleData.getResponsiveClasses('flexible-flex'),
      'data-breakpoint': breakpointData.currentBreakpoint,
    }),
    
    getContainerProps: (size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'lg') => ({
      className: styleData.getResponsiveClasses(`flexible-container max-w-${size === 'full' ? 'none' : size} mx-auto`),
      style: { padding: currentConfig.padding },
    }),
  };
};

// Export the type for external use
export type { Breakpoint };
