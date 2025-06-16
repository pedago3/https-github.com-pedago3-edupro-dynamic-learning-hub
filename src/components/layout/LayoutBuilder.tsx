
import React from 'react';
import { cn } from '@/lib/utils';
import { useBreakpointDetection } from '@/hooks/useBreakpointDetection';
import { useOrientationQuery } from '@/hooks/useOrientationQuery';

interface LayoutConstraints {
  mobile?: {
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    padding?: string;
    margin?: string;
  };
  tablet?: {
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    padding?: string;
    margin?: string;
  };
  desktop?: {
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    padding?: string;
    margin?: string;
  };
  xl?: {
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    padding?: string;
    margin?: string;
  };
}

interface LayoutBuilderProps {
  children: React.ReactNode;
  className?: string;
  // Type de layout
  layoutType?: 'column' | 'row' | 'stack' | 'grid' | 'adaptive';
  // Contraintes responsive
  constraints?: LayoutConstraints;
  // Adaptation à l'orientation
  portraitLayout?: 'column' | 'row' | 'stack' | 'grid';
  landscapeLayout?: 'column' | 'row' | 'stack' | 'grid';
  // Espacement
  spacing?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    xl?: string;
  };
  // Alignement
  mainAxisAlignment?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  crossAxisAlignment?: 'start' | 'center' | 'end' | 'stretch';
  // Comportement adaptatif
  adaptToOrientation?: boolean;
  adaptToScreen?: boolean;
  // Configuration de grille
  gridColumns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    xl?: number;
  };
  // Débordement
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  // Priorité de rendu
  priority?: number;
}

export const LayoutBuilder = ({
  children,
  className,
  layoutType = 'adaptive',
  constraints,
  portraitLayout = 'column',
  landscapeLayout = 'row',
  spacing = { mobile: '1rem', tablet: '1.5rem', desktop: '2rem', xl: '2rem' },
  mainAxisAlignment = 'start',
  crossAxisAlignment = 'start',
  adaptToOrientation = true,
  adaptToScreen = true,
  gridColumns = { mobile: 1, tablet: 2, desktop: 3, xl: 4 },
  overflow = 'visible',
  priority = 0
}: LayoutBuilderProps) => {
  const { currentBreakpoint, isMobile, isTablet } = useBreakpointDetection();
  const orientation = useOrientationQuery();

  // Déterminer le type de layout selon le contexte
  const getLayoutType = () => {
    if (layoutType === 'adaptive') {
      // Adaptation automatique
      if (adaptToOrientation) {
        return orientation.isPortrait ? portraitLayout : landscapeLayout;
      }
      if (adaptToScreen) {
        if (isMobile) return 'column';
        if (isTablet) return 'row';
        return 'grid';
      }
    }
    return layoutType;
  };

  const currentLayoutType = getLayoutType();

  // Obtenir les contraintes actuelles
  const getCurrentConstraints = () => {
    return constraints?.[currentBreakpoint] || constraints?.desktop || constraints?.mobile || {};
  };

  const currentConstraints = getCurrentConstraints();
  const currentSpacing = spacing[currentBreakpoint] || spacing.desktop || spacing.mobile || '1rem';

  // Classes selon le type de layout
  const getLayoutClasses = () => {
    const baseClasses = 'w-full transition-all duration-300';
    
    switch (currentLayoutType) {
      case 'column':
        return cn(baseClasses, 'flex flex-col');
      case 'row':
        return cn(baseClasses, 'flex flex-row flex-wrap');
      case 'stack':
        return cn(baseClasses, 'relative');
      case 'grid':
        const cols = gridColumns[currentBreakpoint] || gridColumns.desktop || gridColumns.mobile || 3;
        return cn(baseClasses, 'grid', `grid-cols-${cols}`);
      default:
        return baseClasses;
    }
  };

  // Classes d'alignement
  const getAlignmentClasses = () => {
    if (currentLayoutType === 'stack' || currentLayoutType === 'grid') return '';
    
    const mainAxis = {
      start: currentLayoutType === 'column' ? 'justify-start' : 'justify-start',
      center: currentLayoutType === 'column' ? 'justify-center' : 'justify-center',
      end: currentLayoutType === 'column' ? 'justify-end' : 'justify-end',
      'space-between': 'justify-between',
      'space-around': 'justify-around',
      'space-evenly': 'justify-evenly'
    };

    const crossAxis = {
      start: currentLayoutType === 'column' ? 'items-start' : 'items-start',
      center: currentLayoutType === 'column' ? 'items-center' : 'items-center',
      end: currentLayoutType === 'column' ? 'items-end' : 'items-end',
      stretch: currentLayoutType === 'column' ? 'items-stretch' : 'items-stretch'
    };

    return cn(mainAxis[mainAxisAlignment], crossAxis[crossAxisAlignment]);
  };

  const layoutClasses = cn(
    getLayoutClasses(),
    getAlignmentClasses(),
    {
      'overflow-visible': overflow === 'visible',
      'overflow-hidden': overflow === 'hidden',
      'overflow-scroll': overflow === 'scroll',
      'overflow-auto': overflow === 'auto',
    },
    className
  );

  return (
    <div 
      className={layoutClasses}
      style={{
        gap: currentLayoutType !== 'stack' ? currentSpacing : undefined,
        minWidth: currentConstraints.minWidth,
        maxWidth: currentConstraints.maxWidth,
        minHeight: currentConstraints.minHeight,
        maxHeight: currentConstraints.maxHeight,
        padding: currentConstraints.padding,
        margin: currentConstraints.margin,
        zIndex: priority,
        '--layout-spacing': currentSpacing,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
