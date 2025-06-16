
import React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useOrientationQuery } from '@/hooks/useOrientationQuery';
import { useBreakpointDetection } from '@/hooks/useBreakpointDetection';

interface MediaQueryProps {
  children: React.ReactNode;
  // Conditions de taille d'écran
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  // Conditions de breakpoint
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
  xl?: boolean;
  // Conditions d'orientation
  portrait?: boolean;
  landscape?: boolean;
  // Conditions d'aspect ratio
  minAspectRatio?: number;
  maxAspectRatio?: number;
  // Conditions avancées
  touchDevice?: boolean;
  highDensity?: boolean;
  reducedMotion?: boolean;
  darkMode?: boolean;
  // Logique
  not?: boolean;
  fallback?: React.ReactNode;
}

export const MediaQuery = ({
  children,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  mobile,
  tablet,
  desktop,
  xl,
  portrait,
  landscape,
  minAspectRatio,
  maxAspectRatio,
  touchDevice,
  highDensity,
  reducedMotion,
  darkMode,
  not = false,
  fallback = null
}: MediaQueryProps) => {
  const { currentBreakpoint } = useBreakpointDetection();
  const orientation = useOrientationQuery();
  
  // Media queries CSS
  const widthQuery = minWidth || maxWidth 
    ? `(${minWidth ? `min-width: ${minWidth}px` : ''}${minWidth && maxWidth ? ' and ' : ''}${maxWidth ? `max-width: ${maxWidth}px` : ''})`
    : null;
  
  const heightQuery = minHeight || maxHeight
    ? `(${minHeight ? `min-height: ${minHeight}px` : ''}${minHeight && maxHeight ? ' and ' : ''}${maxHeight ? `max-height: ${maxHeight}px` : ''})`
    : null;
  
  const aspectQuery = minAspectRatio || maxAspectRatio
    ? `(${minAspectRatio ? `min-aspect-ratio: ${minAspectRatio}` : ''}${minAspectRatio && maxAspectRatio ? ' and ' : ''}${maxAspectRatio ? `max-aspect-ratio: ${maxAspectRatio}` : ''})`
    : null;

  const orientationQuery = portrait || landscape
    ? `(orientation: ${portrait ? 'portrait' : 'landscape'})`
    : null;

  const touchQuery = touchDevice ? '(pointer: coarse)' : null;
  const highDensityQuery = highDensity ? '(-webkit-min-device-pixel-ratio: 2)' : null;
  const reducedMotionQuery = reducedMotion ? '(prefers-reduced-motion: reduce)' : null;
  const darkModeQuery = darkMode ? '(prefers-color-scheme: dark)' : null;

  // Construire la query complète
  const queries = [
    widthQuery,
    heightQuery,
    aspectQuery,
    orientationQuery,
    touchQuery,
    highDensityQuery,
    reducedMotionQuery,
    darkModeQuery
  ].filter(Boolean);

  const mediaQueryString = queries.length > 0 ? queries.join(' and ') : '(min-width: 0px)';
  const matchesMediaQuery = useMediaQuery(mediaQueryString);

  // Vérifications de breakpoint
  let matchesBreakpoint = true;
  if (mobile !== undefined) matchesBreakpoint = matchesBreakpoint && (mobile === (currentBreakpoint === 'mobile'));
  if (tablet !== undefined) matchesBreakpoint = matchesBreakpoint && (tablet === (currentBreakpoint === 'tablet'));
  if (desktop !== undefined) matchesBreakpoint = matchesBreakpoint && (desktop === (currentBreakpoint === 'desktop'));
  if (xl !== undefined) matchesBreakpoint = matchesBreakpoint && (xl === (currentBreakpoint === 'xl'));

  // Vérifications d'orientation
  let matchesOrientation = true;
  if (portrait !== undefined) matchesOrientation = matchesOrientation && (portrait === orientation.isPortrait);
  if (landscape !== undefined) matchesOrientation = matchesOrientation && (landscape === orientation.isLandscape);

  // Vérifications d'aspect ratio
  let matchesAspectRatio = true;
  if (minAspectRatio !== undefined) matchesAspectRatio = matchesAspectRatio && (orientation.aspectRatio >= minAspectRatio);
  if (maxAspectRatio !== undefined) matchesAspectRatio = matchesAspectRatio && (orientation.aspectRatio <= maxAspectRatio);

  const matches = matchesMediaQuery && matchesBreakpoint && matchesOrientation && matchesAspectRatio;
  const shouldRender = not ? !matches : matches;

  return shouldRender ? <>{children}</> : <>{fallback}</>;
};
