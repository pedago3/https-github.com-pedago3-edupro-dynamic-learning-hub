
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    xl?: number;
  };
  gap?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    xl?: string;
  };
  autoFit?: boolean;
  minItemWidth?: string;
}

export const ResponsiveGrid = ({ 
  children, 
  className,
  columns = { mobile: 1, tablet: 2, desktop: 3, xl: 4 },
  gap = { mobile: '1rem', tablet: '1.5rem', desktop: '2rem', xl: '2rem' },
  autoFit = false,
  minItemWidth = '300px'
}: ResponsiveGridProps) => {
  const gridClasses = cn(
    'grid w-full',
    {
      // Auto-fit grid
      [`grid-cols-[repeat(auto-fit,minmax(${minItemWidth},1fr))]`]: autoFit,
      // Manual responsive columns
      [`grid-cols-${columns.mobile}`]: !autoFit && columns.mobile,
      [`sm:grid-cols-${columns.tablet}`]: !autoFit && columns.tablet,
      [`lg:grid-cols-${columns.desktop}`]: !autoFit && columns.desktop,
      [`xl:grid-cols-${columns.xl}`]: !autoFit && columns.xl,
    },
    className
  );

  const gapStyle = {
    gap: gap.mobile,
    '@media (min-width: 640px)': {
      gap: gap.tablet,
    },
    '@media (min-width: 1024px)': {
      gap: gap.desktop,
    },
    '@media (min-width: 1280px)': {
      gap: gap.xl,
    },
  } as React.CSSProperties;

  return (
    <div 
      className={gridClasses}
      style={{
        gap: `var(--grid-gap, ${gap.mobile})`,
        '--grid-gap-mobile': gap.mobile,
        '--grid-gap-tablet': gap.tablet,
        '--grid-gap-desktop': gap.desktop,
        '--grid-gap-xl': gap.xl,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
