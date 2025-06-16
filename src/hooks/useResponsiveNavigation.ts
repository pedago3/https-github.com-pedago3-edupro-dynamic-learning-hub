
import { useState, useEffect } from 'react';
import { useBreakpoint } from './useBreakpoint';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const useResponsiveNavigation = (items: NavigationItem[]) => {
  const { isMobile } = useBreakpoint();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fermer le menu mobile lors du changement de breakpoint
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return {
    isMobile,
    isMenuOpen,
    toggleMenu,
    closeMenu,
    items
  };
};
