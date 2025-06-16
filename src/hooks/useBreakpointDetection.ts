
import { useMemo } from 'react';
import { useMediaQuery } from './useMediaQuery';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'xl' | '2xl';

export const useBreakpointDetection = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px) and (max-width: 1279px)');
  const isXl = useMediaQuery('(min-width: 1280px) and (max-width: 1535px)');
  const is2xl = useMediaQuery('(min-width: 1536px)');

  const currentBreakpoint: Breakpoint = useMemo(() => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    if (isDesktop) return 'desktop';
    if (isXl) return 'xl';
    return '2xl';
  }, [isMobile, isTablet, isDesktop, isXl, is2xl]);

  return {
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isXl,
    is2xl,
  };
};
