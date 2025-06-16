
import React from 'react';
import { cn } from '@/lib/utils';

interface FlexibleContainerProps {
  children: React.ReactNode;
  className?: string;
  // Taille du conteneur
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'auto';
  // Padding responsive
  padding?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    xl?: string;
  };
  // Centrage
  center?: boolean;
  // Largeur personnalisée
  maxWidth?: string;
  // Mode fluide
  fluid?: boolean;
}

export const FlexibleContainer = ({
  children,
  className,
  size = 'lg',
  padding = { mobile: '1rem', tablet: '1.5rem', desktop: '2rem', xl: '2rem' },
  center = true,
  maxWidth,
  fluid = false
}: FlexibleContainerProps) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
    auto: 'max-w-none'
  };

  const baseClasses = cn(
    'flexible-container w-full',
    !fluid && sizeClasses[size],
    center && 'mx-auto',
    className
  );

  return (
    <div 
      className={baseClasses}
      style={{
        maxWidth: maxWidth || undefined,
        '--padding-mobile': padding.mobile,
        '--padding-tablet': padding.tablet,
        '--padding-desktop': padding.desktop,
        '--padding-xl': padding.xl,
        paddingLeft: padding.mobile,
        paddingRight: padding.mobile,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

// Composant pour les sections flexibles
interface FlexibleSectionProps {
  children: React.ReactNode;
  className?: string;
  // Couleur de fond
  background?: 'transparent' | 'white' | 'gray' | 'gradient';
  // Espacement vertical
  spacing?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    xl?: string;
  };
  // Bordures
  border?: boolean;
  // Ombre
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const FlexibleSection = ({
  children,
  className,
  background = 'transparent',
  spacing = { mobile: '2rem', tablet: '3rem', desktop: '4rem', xl: '5rem' },
  border = false,
  shadow = 'none'
}: FlexibleSectionProps) => {
  const backgroundClasses = {
    transparent: 'bg-transparent',
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-gray-50 to-white'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  return (
    <section 
      className={cn(
        'flexible-section w-full',
        backgroundClasses[background],
        shadowClasses[shadow],
        border && 'border border-gray-200 rounded-lg',
        className
      )}
      style={{
        '--spacing-mobile': spacing.mobile,
        '--spacing-tablet': spacing.tablet,
        '--spacing-desktop': spacing.desktop,
        '--spacing-xl': spacing.xl,
        paddingTop: spacing.mobile,
        paddingBottom: spacing.mobile,
      } as React.CSSProperties}
    >
      {children}
    </section>
  );
};
