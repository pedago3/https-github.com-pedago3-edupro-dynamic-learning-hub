
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface ResponsiveCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  priority?: number;
  stackOrder?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  hideOnBreakpoint?: 'mobile' | 'tablet' | 'desktop';
  variant?: 'default' | 'compact' | 'featured';
}

export const ResponsiveCard = ({ 
  title,
  children,
  className,
  priority = 0,
  stackOrder,
  hideOnBreakpoint,
  variant = 'default'
}: ResponsiveCardProps) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  // Déterminer l'ordre d'empilement
  const getStackOrder = () => {
    if (stackOrder) {
      if (isMobile && stackOrder.mobile !== undefined) return stackOrder.mobile;
      if (isTablet && stackOrder.tablet !== undefined) return stackOrder.tablet;
      if (isDesktop && stackOrder.desktop !== undefined) return stackOrder.desktop;
    }
    return priority;
  };

  // Déterminer si la carte doit être cachée
  const shouldHide = () => {
    if (hideOnBreakpoint === 'mobile' && isMobile) return true;
    if (hideOnBreakpoint === 'tablet' && isTablet) return true;
    if (hideOnBreakpoint === 'desktop' && isDesktop) return true;
    return false;
  };

  if (shouldHide()) {
    return null;
  }

  const variantClasses = {
    default: 'p-4 lg:p-6',
    compact: 'p-2 lg:p-4',
    featured: 'p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-50'
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-300 hover-lift glass border-white/20 backdrop-blur-xl',
        'w-full', // Toujours prendre toute la largeur disponible
        variantClasses[variant],
        className
      )}
      style={{ 
        order: getStackOrder(),
        animationDelay: `${priority * 100}ms`
      }}
    >
      {title && (
        <CardHeader className={cn(
          'pb-4',
          variant === 'compact' && 'pb-2'
        )}>
          <CardTitle className={cn(
            'gradient-text',
            variant === 'compact' ? 'text-lg' : 'text-xl lg:text-2xl'
          )}>
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(
        variant === 'compact' ? 'p-2' : 'p-4',
        title && 'pt-0'
      )}>
        {children}
      </CardContent>
    </Card>
  );
};

interface ResponsiveCardGridProps {
  children: React.ReactNode;
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
  className?: string;
}

export const ResponsiveCardGrid = ({ 
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3, xl: 4 },
  gap = { mobile: '1rem', tablet: '1.5rem', desktop: '2rem', xl: '2.5rem' },
  className 
}: ResponsiveCardGridProps) => {
  const { isMobile, isTablet, isDesktop, isXl } = useBreakpoint();

  const getCurrentColumns = () => {
    if (isMobile) return columns.mobile || 1;
    if (isTablet) return columns.tablet || 2;
    if (isDesktop) return columns.desktop || 3;
    if (isXl) return columns.xl || 4;
    return 3;
  };

  const getCurrentGap = () => {
    if (isMobile) return gap.mobile || '1rem';
    if (isTablet) return gap.tablet || '1.5rem';
    if (isDesktop) return gap.desktop || '2rem';
    if (isXl) return gap.xl || '2.5rem';
    return '2rem';
  };

  return (
    <div 
      className={cn(
        'grid w-full transition-all duration-300',
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${getCurrentColumns()}, 1fr)`,
        gap: getCurrentGap()
      }}
    >
      {children}
    </div>
  );
};
