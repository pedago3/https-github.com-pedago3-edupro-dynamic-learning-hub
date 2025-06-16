
import React from 'react';
import { cn } from '@/lib/utils';
import { useBreakpointDetection } from '@/hooks/useBreakpointDetection';

interface ExpandedProps {
  children: React.ReactNode;
  className?: string;
  // Configuration du flex
  flex?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    xl?: number;
  };
  // Taille minimale
  minWidth?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    xl?: string;
  };
  minHeight?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    xl?: string;
  };
  // Taille maximale
  maxWidth?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    xl?: string;
  };
  maxHeight?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    xl?: string;
  };
  // Alignement interne
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  crossAlignment?: 'start' | 'center' | 'end' | 'stretch';
}

export const Expanded = ({
  children,
  className,
  flex = { mobile: 1, tablet: 1, desktop: 1, xl: 1 },
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  alignment = 'start',
  crossAlignment = 'stretch'
}: ExpandedProps) => {
  const { currentBreakpoint } = useBreakpointDetection();

  // Obtenir la valeur actuelle selon le breakpoint
  const getCurrentValue = (values: Record<string, any> | undefined, fallback: any) => {
    if (!values) return fallback;
    return values[currentBreakpoint] || values.desktop || values.tablet || values.mobile || fallback;
  };

  const currentFlex = getCurrentValue(flex, 1);
  const currentMinWidth = getCurrentValue(minWidth, 'auto');
  const currentMinHeight = getCurrentValue(minHeight, 'auto');
  const currentMaxWidth = getCurrentValue(maxWidth, 'none');
  const currentMaxHeight = getCurrentValue(maxHeight, 'none');

  const alignmentClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    stretch: 'justify-stretch'
  };

  const crossAlignmentClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const expandedClasses = cn(
    'flex',
    alignmentClasses[alignment],
    crossAlignmentClasses[crossAlignment],
    className
  );

  return (
    <div 
      className={expandedClasses}
      style={{
        flex: currentFlex,
        minWidth: currentMinWidth,
        minHeight: currentMinHeight,
        maxWidth: currentMaxWidth,
        maxHeight: currentMaxHeight,
      }}
    >
      {children}
    </div>
  );
};
