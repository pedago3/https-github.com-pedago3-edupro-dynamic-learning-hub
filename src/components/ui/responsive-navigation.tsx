
import React from 'react';
import { Menu, X } from 'lucide-react';
import { ResponsiveButton } from './responsive-button';
import { cn } from '@/lib/utils';
import { useResponsiveNavigation } from '@/hooks/useResponsiveNavigation';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

interface ResponsiveNavigationProps {
  items: NavigationItem[];
  className?: string;
  onItemClick?: (item: NavigationItem) => void;
  logo?: React.ReactNode;
}

export const ResponsiveNavigation = ({ 
  items, 
  className,
  onItemClick,
  logo 
}: ResponsiveNavigationProps) => {
  const { isMobile, isMenuOpen, toggleMenu, closeMenu } = useResponsiveNavigation(items);

  const handleItemClick = (item: NavigationItem) => {
    onItemClick?.(item);
    closeMenu();
  };

  return (
    <nav className={cn('relative bg-white shadow-lg', className)}>
      {/* Barre de navigation */}
      <div className="adaptive-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {logo && (
            <div className="flex-shrink-0">
              {logo}
            </div>
          )}

          {/* Navigation desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleItemClick(item);
                    }}
                    className={cn(
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                      'hover:bg-gray-100 hover:text-gray-900',
                      'flex items-center gap-2',
                      item.isActive 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-700'
                    )}
                  >
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Bouton hamburger mobile */}
          <div className="md:hidden">
            <ResponsiveButton
              variant="ghost"
              size="lg"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="min-h-[48px] min-w-[48px]"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </ResponsiveButton>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div className={cn(
        'md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50',
        'transition-all duration-300 ease-in-out',
        isMenuOpen 
          ? 'opacity-100 translate-y-0 visible' 
          : 'opacity-0 -translate-y-2 invisible'
      )}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {items.map((item) => {
            const IconComponent = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item);
                }}
                className={cn(
                  'block px-3 py-3 rounded-md text-base font-medium',
                  'transition-colors duration-200',
                  'hover:bg-gray-100 hover:text-gray-900',
                  'flex items-center gap-3 min-h-[48px]', // Optimisé pour le tactile
                  item.isActive 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700'
                )}
              >
                {IconComponent && <IconComponent className="h-5 w-5" />}
                {item.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={closeMenu}
        />
      )}
    </nav>
  );
};
