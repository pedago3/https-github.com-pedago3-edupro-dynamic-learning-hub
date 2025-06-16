
import React from 'react';
import { cn } from '@/lib/utils';

interface FlexibleGridProps {
  children: React.ReactNode;
  className?: string;
  // Configuration des colonnes par breakpoint
  columns?: {
    mobile?: number | 'auto-fit' | 'auto-fill';
    tablet?: number | 'auto-fit' | 'auto-fill';
    desktop?: number | 'auto-fit' | 'auto-fill';
    xl?: number | 'auto-fit' | 'auto-fill';
  };
  // Taille minimale des éléments pour auto-fit/auto-fill
  minItemSize?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    xl?: string;
  };
  // Espacement entre les éléments
  gap?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    xl?: string;
  };
  // Alignement des éléments
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  // Mode de layout
  layout?: 'grid' | 'flexbox';
}

export const FlexibleGrid = ({
  children,
  className,
  columns = { mobile: 1, tablet: 2, desktop: 3, xl: 4 },
  minItemSize = { mobile: '280px', tablet: '300px', desktop: '320px', xl: '350px' },
  gap = { mobile: '1rem', tablet: '1.5rem', desktop: '2rem', xl: '2rem' },
  align = 'stretch',
  justify = 'start',
  layout = 'grid'
}: FlexibleGridProps) => {
  const baseClasses = cn(
    'flexible-grid w-full',
    layout === 'grid' ? 'grid' : 'flex flex-wrap',
    {
      // Alignement Grid
      'items-start': layout === 'grid' && align === 'start',
      'items-center': layout === 'grid' && align === 'center',
      'items-end': layout === 'grid' && align === 'end',
      'items-stretch': layout === 'grid' && align === 'stretch',
      // Justification Grid
      'justify-items-start': layout === 'grid' && justify === 'start',
      'justify-items-center': layout === 'grid' && justify === 'center',
      'justify-items-end': layout === 'grid' && justify === 'end',
      'justify-items-stretch': layout === 'grid' && justify === 'stretch',
    },
    {
      // Alignement Flexbox (separate object to avoid duplicate keys)
      'items-start': layout === 'flexbox' && align === 'start',
      'items-center': layout === 'flexbox' && align === 'center',
      'items-end': layout === 'flexbox' && align === 'end',
      'items-stretch': layout === 'flexbox' && align === 'stretch',
      // Justification Flexbox
      'justify-start': layout === 'flexbox' && justify === 'start',
      'justify-center': layout === 'flexbox' && justify === 'center',
      'justify-end': layout === 'flexbox' && justify === 'end',
      'justify-between': layout === 'flexbox' && justify === 'space-between',
      'justify-around': layout === 'flexbox' && justify === 'space-around',
      'justify-evenly': layout === 'flexbox' && justify === 'space-evenly',
    },
    className
  );

  // Génération des styles CSS personnalisés
  const generateGridStyles = () => {
    if (layout === 'flexbox') return {};

    const styles: React.CSSProperties = {};
    
    // Mobile (par défaut)
    if (typeof columns.mobile === 'number') {
      styles.gridTemplateColumns = `repeat(${columns.mobile}, 1fr)`;
    } else if (columns.mobile === 'auto-fit' || columns.mobile === 'auto-fill') {
      styles.gridTemplateColumns = `repeat(${columns.mobile}, minmax(${minItemSize.mobile}, 1fr))`;
    }
    
    return styles;
  };

  const generateFlexStyles = () => {
    if (layout === 'grid') return {};

    return {
      gap: gap.mobile,
    };
  };

  // Create style object with proper typing for CSS custom properties
  const customStyles = {
    ...generateGridStyles(),
    ...generateFlexStyles(),
  } as React.CSSProperties & Record<string, string>;

  // Add CSS custom properties
  customStyles['--grid-gap-mobile'] = gap.mobile;
  customStyles['--grid-gap-tablet'] = gap.tablet;
  customStyles['--grid-gap-desktop'] = gap.desktop;
  customStyles['--grid-gap-xl'] = gap.xl;
  customStyles['--min-item-mobile'] = minItemSize.mobile;
  customStyles['--min-item-tablet'] = minItemSize.tablet;
  customStyles['--min-item-desktop'] = minItemSize.desktop;
  customStyles['--min-item-xl'] = minItemSize.xl;

  return (
    <div 
      className={baseClasses}
      style={customStyles}
      data-layout={layout}
      data-columns-mobile={columns.mobile}
      data-columns-tablet={columns.tablet}
      data-columns-desktop={columns.desktop}
      data-columns-xl={columns.xl}
    >
      {children}
    </div>
  );
};

// Composant enfant pour les éléments de la grille
interface FlexibleGridItemProps {
  children: React.ReactNode;
  className?: string;
  // Span sur plusieurs colonnes
  colSpan?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    xl?: number;
  };
  // Span sur plusieurs lignes
  rowSpan?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    xl?: number;
  };
  // Ordre d'affichage
  order?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    xl?: number;
  };
}

export const FlexibleGridItem = ({
  children,
  className,
  colSpan,
  rowSpan,
  order
}: FlexibleGridItemProps) => {
  // Create style object with proper typing for CSS custom properties
  const customStyles = {} as React.CSSProperties & Record<string, string | number | undefined>;

  if (colSpan) {
    customStyles['--col-span-mobile'] = colSpan.mobile;
    customStyles['--col-span-tablet'] = colSpan.tablet;
    customStyles['--col-span-desktop'] = colSpan.desktop;
    customStyles['--col-span-xl'] = colSpan.xl;
  }

  if (rowSpan) {
    customStyles['--row-span-mobile'] = rowSpan.mobile;
    customStyles['--row-span-tablet'] = rowSpan.tablet;
    customStyles['--row-span-desktop'] = rowSpan.desktop;
    customStyles['--row-span-xl'] = rowSpan.xl;
  }

  if (order) {
    customStyles['--order-mobile'] = order.mobile;
    customStyles['--order-tablet'] = order.tablet;
    customStyles['--order-desktop'] = order.desktop;
    customStyles['--order-xl'] = order.xl;
  }

  return (
    <div 
      className={cn('flexible-grid-item', className)}
      style={customStyles}
    >
      {children}
    </div>
  );
};
