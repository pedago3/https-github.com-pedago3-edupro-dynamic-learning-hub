import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsiveStyles, useStyledComponent, useConditionalStyles } from '@/hooks/useResponsiveStyles';
import { useTheme, useVariants } from '@/hooks/useTheme';
import { useResponsiveQueries, useMediaQuery } from '@/hooks/useMediaQuery';

interface AdaptiveComponentProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

// Définition des variants comme Material-UI
const componentVariants = {
  primary: {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  },
  secondary: {
    default: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  },
  accent: {
    default: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  },
};

export const AdaptiveComponent = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className
}: AdaptiveComponentProps) => {
  const queries = useResponsiveQueries();
  const { responsive } = useTheme();
  const variants = useVariants(componentVariants);
  
  // Hook useMediaQuery pour des conditions spécifiques
  const isLargeScreen = useMediaQuery('(min-width: 1200px)');
  const isHighDensity = useMediaQuery('(-webkit-min-device-pixel-ratio: 2)');
  
  // Styles responsives avec configuration
  const responsiveClasses = useResponsiveStyles({
    base: 'rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2',
    mobile: 'w-full min-h-[48px] text-base', // Optimisé tactile
    tablet: 'min-h-[44px]',
    desktop: 'min-h-[40px] hover:shadow-lg',
    xl: 'min-h-[42px]',
    touch: 'active:scale-95', // Animation tactile
    reducedMotion: 'transition-none', // Respect des préférences d'accessibilité
  });
  
  // Styled component approach
  const styled = useStyledComponent('inline-flex items-center justify-center');
  
  // Styles conditionnels
  const conditionalClasses = useConditionalStyles([
    {
      condition: fullWidth,
      className: 'w-full',
    },
    {
      condition: queries.isMobile && variant === 'primary',
      className: 'shadow-lg',
    },
    {
      condition: isHighDensity,
      className: 'border border-opacity-20',
    },
    {
      condition: isLargeScreen,
      className: 'transform hover:scale-105',
    },
  ]);
  
  // Récupération du variant et de la taille
  const variantClasses = variants.get(variant);
  const sizeClasses = variants.get(variant, size);
  
  // Styles CSS-in-JS pour des propriétés dynamiques
  const dynamicStyles = responsive.css({
    borderRadius: responsive.borderRadius('md'),
    boxShadow: queries.isDesktop ? responsive.shadow('md') : responsive.shadow('sm'),
    transition: responsive.transition('normal'),
  });
  
  const finalClasses = cn(
    responsiveClasses,
    variantClasses,
    sizeClasses,
    conditionalClasses,
    className
  );
  
  return (
    <button
      className={finalClasses}
      style={dynamicStyles}
      // Optimisation tactile
      {...(queries.isTouch && {
        onTouchStart: () => {}, // Active :active sur iOS
      })}
    >
      {children}
    </button>
  );
};

// Composant d'exemple avec layout adaptatif
interface AdaptiveLayoutProps {
  children: React.ReactNode;
  spacing?: 'tight' | 'normal' | 'loose';
}

export const AdaptiveLayout = ({ children, spacing = 'normal' }: AdaptiveLayoutProps) => {
  const queries = useResponsiveQueries();
  const { responsive } = useTheme();
  
  const layoutClasses = useResponsiveStyles({
    base: 'flex flex-col',
    mobile: 'gap-4 p-4',
    tablet: 'gap-6 p-6 sm:flex-row sm:flex-wrap',
    desktop: 'gap-8 p-8 lg:grid lg:grid-cols-2',
    xl: 'gap-10 p-10 xl:grid-cols-3',
  });
  
  const spacingMap = {
    tight: { mobile: 2, tablet: 3, desktop: 4 },
    normal: { mobile: 4, tablet: 6, desktop: 8 },
    loose: { mobile: 6, tablet: 8, desktop: 12 },
  };
  
  const dynamicSpacing = spacingMap[spacing];
  const currentSpacing = queries.isMobile 
    ? dynamicSpacing.mobile 
    : queries.isTablet 
    ? dynamicSpacing.tablet 
    : dynamicSpacing.desktop;
  
  return (
    <div 
      className={layoutClasses}
      style={{
        gap: `${currentSpacing * 0.25}rem`,
        ...responsive.css({
          padding: responsive.spacing('md'),
          transition: responsive.transition('normal'),
        })
      }}
    >
      {children}
    </div>
  );
};
