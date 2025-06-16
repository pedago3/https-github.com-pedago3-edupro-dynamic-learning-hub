
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useAccessibleResponsiveStyles } from '@/hooks/useAccessibilityPreferences';

interface ResponsiveButtonProps extends ButtonProps {
  responsiveSize?: {
    mobile?: 'sm' | 'default' | 'lg';
    tablet?: 'sm' | 'default' | 'lg';
    desktop?: 'sm' | 'default' | 'lg';
  };
  touchOptimized?: boolean;
  hideOnBreakpoint?: 'mobile' | 'tablet' | 'desktop';
  showOnBreakpoint?: 'mobile' | 'tablet' | 'desktop';
  ariaLabel?: string;
  ariaDescribedBy?: string;
  loadingText?: string;
  isLoading?: boolean;
}

export const ResponsiveButton = React.forwardRef<HTMLButtonElement, ResponsiveButtonProps>(
  ({ 
    responsiveSize = { mobile: 'lg', tablet: 'default', desktop: 'default' },
    touchOptimized = true,
    hideOnBreakpoint,
    showOnBreakpoint,
    className,
    children,
    ariaLabel,
    ariaDescribedBy,
    loadingText,
    isLoading = false,
    disabled,
    ...props 
  }, ref) => {
    const { isMobile, isTablet, isDesktop } = useBreakpoint();

    // Déterminer la taille selon le breakpoint
    const getCurrentSize = () => {
      if (isMobile) return responsiveSize.mobile || 'lg';
      if (isTablet) return responsiveSize.tablet || 'default';
      return responsiveSize.desktop || 'default';
    };

    // Déterminer la visibilité
    const shouldHide = () => {
      if (hideOnBreakpoint === 'mobile' && isMobile) return true;
      if (hideOnBreakpoint === 'tablet' && isTablet) return true;
      if (hideOnBreakpoint === 'desktop' && isDesktop) return true;
      return false;
    };

    const shouldShow = () => {
      if (!showOnBreakpoint) return true;
      if (showOnBreakpoint === 'mobile' && isMobile) return true;
      if (showOnBreakpoint === 'tablet' && isTablet) return true;
      if (showOnBreakpoint === 'desktop' && isDesktop) return true;
      return false;
    };

    // Classes accessibles et responsives
    const accessibleClasses = useAccessibleResponsiveStyles(
      cn(
        'a11y-button transition-all duration-300',
        touchOptimized && isMobile && 'a11y-touch-target touch-manipulation',
        isLoading && 'cursor-wait',
        className
      )
    );

    if (shouldHide() || !shouldShow()) {
      return null;
    }

    const buttonContent = isLoading ? (
      <span className="flex items-center gap-2">
        <span 
          className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
          aria-hidden="true"
        />
        {loadingText || 'Chargement...'}
      </span>
    ) : children;

    return (
      <Button
        ref={ref}
        size={getCurrentSize()}
        className={accessibleClasses}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={isLoading}
        {...props}
      >
        {buttonContent}
        {/* Texte pour lecteurs d'écran */}
        {isLoading && (
          <span className="sr-only">
            {loadingText || 'Opération en cours, veuillez patienter'}
          </span>
        )}
      </Button>
    );
  }
);

ResponsiveButton.displayName = 'ResponsiveButton';
