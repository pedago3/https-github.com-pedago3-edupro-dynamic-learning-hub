
import React from 'react';
import { cn } from '@/lib/utils';
import { useBreakpointDetection } from '@/hooks/useBreakpointDetection';
import { useOrientationQuery } from '@/hooks/useOrientationQuery';

interface WrapProps {
  children: React.ReactNode;
  className?: string;
  // Configuration responsive
  spacing?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    xl?: string;
  };
  runSpacing?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    xl?: string;
  };
  // Alignement
  alignment?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  crossAxisAlignment?: 'start' | 'center' | 'end' | 'stretch';
  // Direction
  direction?: {
    mobile?: 'horizontal' | 'vertical';
    tablet?: 'horizontal' | 'vertical';
    desktop?: 'horizontal' | 'vertical';
    xl?: 'horizontal' | 'vertical';
  };
  // Taille des enfants
  runAlignment?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  // Comportement adaptatif
  adaptToOrientation?: boolean;
  maxWidth?: string;
}

export const Wrap = ({
  children,
  className,
  spacing = { mobile: '0.5rem', tablet: '1rem', desktop: '1.5rem', xl: '2rem' },
  runSpacing = { mobile: '0.5rem', tablet: '1rem', desktop: '1.5rem', xl: '2rem' },
  alignment = 'start',
  crossAxisAlignment = 'start',
  direction = { mobile: 'horizontal', tablet: 'horizontal', desktop: 'horizontal', xl: 'horizontal' },
  runAlignment = 'start',
  adaptToOrientation = true,
  maxWidth
}: WrapProps) => {
  const { currentBreakpoint } = useBreakpointDetection();
  const orientation = useOrientationQuery();

  // Obtenir la valeur actuelle selon le breakpoint
  const getCurrentValue = (values: Record<string, string>, fallback: string) => {
    return values[currentBreakpoint] || values.desktop || values.tablet || values.mobile || fallback;
  };

  const getCurrentDirection = () => {
    let currentDir = direction[currentBreakpoint] || direction.desktop || direction.tablet || direction.mobile || 'horizontal';
    
    // Adaptation automatique à l'orientation
    if (adaptToOrientation && orientation.isPortrait && currentBreakpoint === 'mobile') {
      currentDir = 'vertical';
    }
    
    return currentDir;
  };

  const currentSpacing = getCurrentValue(spacing, '1rem');
  const currentRunSpacing = getCurrentValue(runSpacing, '1rem');
  const currentDirection = getCurrentDirection();

  const isVertical = currentDirection === 'vertical';

  const alignmentClasses = {
    start: isVertical ? 'items-start' : 'justify-start',
    center: isVertical ? 'items-center' : 'justify-center',
    end: isVertical ? 'items-end' : 'justify-end',
    'space-between': isVertical ? 'items-stretch justify-between' : 'justify-between',
    'space-around': isVertical ? 'items-stretch justify-around' : 'justify-around',
    'space-evenly': isVertical ? 'items-stretch justify-evenly' : 'justify-evenly'
  };

  const crossAxisClasses = {
    start: isVertical ? 'justify-start' : 'items-start',
    center: isVertical ? 'justify-center' : 'items-center',
    end: isVertical ? 'justify-end' : 'items-end',
    stretch: isVertical ? 'justify-stretch' : 'items-stretch'
  };

  const runAlignmentClasses = {
    start: 'content-start',
    center: 'content-center',
    end: 'content-end',
    'space-between': 'content-between',
    'space-around': 'content-around',
    'space-evenly': 'content-evenly'
  };

  const wrapClasses = cn(
    'flex flex-wrap w-full',
    isVertical ? 'flex-col' : 'flex-row',
    alignmentClasses[alignment],
    crossAxisClasses[crossAxisAlignment],
    runAlignmentClasses[runAlignment],
    className
  );

  return (
    <div 
      className={wrapClasses}
      style={{
        gap: currentSpacing,
        rowGap: currentRunSpacing,
        maxWidth: maxWidth || 'none',
        '--wrap-spacing': currentSpacing,
        '--wrap-run-spacing': currentRunSpacing,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
