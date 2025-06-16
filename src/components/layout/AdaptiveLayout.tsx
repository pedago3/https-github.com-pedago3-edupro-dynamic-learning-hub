
import React from 'react';
import { ResponsiveGrid } from './ResponsiveGrid';
import { FlexContainer } from './FlexContainer';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface AdaptiveLayoutProps {
  children: React.ReactNode;
  type?: 'grid' | 'flex';
  className?: string;
}

export const AdaptiveLayout = ({ 
  children, 
  type = 'grid',
  className 
}: AdaptiveLayoutProps) => {
  const { isMobile, isTablet } = useBreakpoint();

  if (type === 'flex') {
    return (
      <FlexContainer
        className={className}
        direction={{
          mobile: 'column',
          tablet: 'row',
          desktop: 'row'
        }}
        gap={{
          mobile: '1rem',
          tablet: '1.5rem',
          desktop: '2rem'
        }}
        justify="start"
        align="start"
      >
        {children}
      </FlexContainer>
    );
  }

  return (
    <ResponsiveGrid
      className={className}
      columns={{
        mobile: 1,
        tablet: 2,
        desktop: isMobile ? 1 : isTablet ? 2 : 3,
        xl: 4
      }}
      gap={{
        mobile: '1rem',
        tablet: '1.5rem',
        desktop: '2rem',
        xl: '2.5rem'
      }}
    >
      {children}
    </ResponsiveGrid>
  );
};
