
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface ResponsiveCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  sizes?: {
    mobile?: 'full' | 'auto';
    tablet?: 'full' | 'half' | 'auto';
    desktop?: 'full' | 'half' | 'third' | 'quarter' | 'auto';
  };
  minHeight?: string;
  priority?: number;
}

export const ResponsiveCard = ({ 
  children, 
  title,
  className,
  sizes = { mobile: 'full', tablet: 'half', desktop: 'third' },
  minHeight = '200px',
  priority = 0
}: ResponsiveCardProps) => {
  const { isMobile, isTablet } = useBreakpoint();

  const cardClasses = cn(
    'transition-all duration-300 hover-lift glass border-white/20 backdrop-blur-xl',
    {
      // Mobile sizes
      'w-full': sizes.mobile === 'full',
      'w-auto': sizes.mobile === 'auto',
      // Tablet sizes
      'sm:w-full': sizes.tablet === 'full',
      'sm:w-1/2': sizes.tablet === 'half',
      'sm:w-auto': sizes.tablet === 'auto',
      // Desktop sizes
      'lg:w-full': sizes.desktop === 'full',
      'lg:w-1/2': sizes.desktop === 'half',
      'lg:w-1/3': sizes.desktop === 'third',
      'lg:w-1/4': sizes.desktop === 'quarter',
      'lg:w-auto': sizes.desktop === 'auto',
    },
    className
  );

  return (
    <Card 
      className={cardClasses}
      style={{ 
        minHeight,
        order: isMobile ? priority : 'unset',
        animationDelay: `${priority * 100}ms`
      }}
    >
      {title && (
        <CardHeader className="pb-4">
          <CardTitle className="gradient-text text-lg lg:text-xl">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn('p-4', { 'pt-0': title })}>
        {children}
      </CardContent>
    </Card>
  );
};
