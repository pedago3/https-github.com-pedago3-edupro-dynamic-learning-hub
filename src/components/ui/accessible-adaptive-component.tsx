
import React from 'react';
import { cn } from '@/lib/utils';
import { useAccessibilityPreferences, useAccessibleResponsiveStyles } from '@/hooks/useAccessibilityPreferences';
import { useResponsiveQueries } from '@/hooks/useMediaQuery';

interface AccessibleAdaptiveComponentProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  variant?: 'button' | 'card' | 'input' | 'link';
  ariaLabel?: string;
  ariaDescribedBy?: string;
  href?: string;
}

export const AccessibleAdaptiveComponent = React.forwardRef<
  HTMLElement,
  AccessibleAdaptiveComponentProps
>(({
  children,
  as: Component = 'div',
  variant = 'card',
  className,
  ariaLabel,
  ariaDescribedBy,
  href,
  onClick,
  onKeyDown,
  ...props
}, ref) => {
  const a11yPrefs = useAccessibilityPreferences();
  const queries = useResponsiveQueries();

  // Classes de base selon le variant
  const variantClasses = {
    button: 'a11y-button inline-flex items-center justify-center font-medium rounded-lg',
    card: 'a11y-card rounded-lg border bg-white shadow-sm',
    input: 'a11y-input rounded-md border border-gray-300 px-3 py-2',
    link: 'a11y-link text-blue-600 hover:text-blue-800'
  };

  // Classes responsives et accessibles
  const responsiveClasses = useAccessibleResponsiveStyles(
    cn(
      variantClasses[variant],
      'a11y-responsive-text a11y-crisp-text a11y-readable-spacing',
      queries.isMobile && 'a11y-touch-target',
      className
    )
  );

  // Gestion des événements clavier
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    // Support des touches Enter et Espace pour les éléments cliquables
    if ((e.key === 'Enter' || e.key === ' ') && onClick && variant === 'button') {
      e.preventDefault();
      onClick(e as any);
    }
    onKeyDown?.(e);
  };

  // Props d'accessibilité dynamiques
  const a11yProps = {
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'role': props.role || (onClick ? 'button' : undefined),
    'tabIndex': props.tabIndex ?? (onClick ? 0 : undefined),
    'onClick': onClick,
    'onKeyDown': handleKeyDown,
    'href': href,
  };

  return React.createElement(
    Component,
    {
      ref,
      className: responsiveClasses,
      ...a11yProps,
      ...props,
    },
    children
  );
});

AccessibleAdaptiveComponent.displayName = 'AccessibleAdaptiveComponent';

// Composant de navigation accessible et responsive
interface AccessibleNavigationProps {
  items: Array<{
    id: string;
    label: string;
    href: string;
    isActive?: boolean;
  }>;
  onNavigate?: (href: string) => void;
}

export const AccessibleNavigation = ({ items, onNavigate }: AccessibleNavigationProps) => {
  const queries = useResponsiveQueries();

  return (
    <nav 
      role="navigation" 
      aria-label="Navigation principale"
      className="a11y-keyboard-nav"
    >
      {/* Skip link pour l'accessibilité */}
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      
      <ul className={cn(
        'flex',
        queries.isMobile ? 'flex-col space-y-2' : 'flex-row space-x-4'
      )}>
        {items.map((item, index) => (
          <li key={item.id}>
            <AccessibleAdaptiveComponent
              as="a"
              variant="link"
              href={item.href}
              onClick={() => onNavigate?.(item.href)}
              ariaLabel={`${item.label}${item.isActive ? ' (page actuelle)' : ''}`}
              aria-current={item.isActive ? 'page' : undefined}
              className={cn(
                'block px-4 py-3 rounded-md transition-colors',
                'a11y-responsive-text font-medium',
                item.isActive 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                queries.isMobile && 'a11y-touch-target'
              )}
              tabIndex={0}
            >
              {item.label}
            </AccessibleAdaptiveComponent>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Hook pour la gestion des annonces d'écran
export const useScreenReaderAnnouncements = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
};
