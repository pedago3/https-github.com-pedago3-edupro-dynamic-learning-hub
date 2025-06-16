
import React from 'react';
import { cn } from '@/lib/utils';

interface FlexContainerProps {
  children: React.ReactNode;
  className?: string;
  direction?: {
    mobile?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    tablet?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    desktop?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  };
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: boolean;
  gap?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
}

export const FlexContainer = ({ 
  children, 
  className,
  direction = { mobile: 'column', tablet: 'row', desktop: 'row' },
  justify = 'start',
  align = 'start',
  wrap = true,
  gap = { mobile: '1rem', tablet: '1.5rem', desktop: '2rem' }
}: FlexContainerProps) => {
  const flexClasses = cn(
    'flex w-full',
    {
      // Direction
      [`flex-${direction.mobile}`]: direction.mobile,
      [`sm:flex-${direction.tablet}`]: direction.tablet,
      [`lg:flex-${direction.desktop}`]: direction.desktop,
      // Justify content
      [`justify-${justify}`]: justify,
      // Align items
      [`items-${align}`]: align,
      // Wrap
      'flex-wrap': wrap,
      'flex-nowrap': !wrap,
    },
    className
  );

  return (
    <div 
      className={flexClasses}
      style={{
        gap: `var(--flex-gap, ${gap.mobile})`,
        '--flex-gap-mobile': gap.mobile,
        '--flex-gap-tablet': gap.tablet,
        '--flex-gap-desktop': gap.desktop,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
