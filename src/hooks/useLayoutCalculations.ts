
import { useMemo, useState } from 'react';

interface CurrentConfig {
  columns: number | 'auto-fit' | 'auto-fill';
  gap: string;
  padding: string;
  minItemSize: string;
}

export const useLayoutCalculations = (currentConfig: CurrentConfig, containerWidth: number) => {
  const [itemCount, setItemCount] = useState<number>(0);

  // Calculer le nombre optimal de colonnes pour auto-fit
  const calculateOptimalColumns = useMemo(() => {
    if (!containerWidth || typeof currentConfig.columns === 'number') {
      return currentConfig.columns;
    }

    const minSize = parseInt(currentConfig.minItemSize);
    const gapSize = parseInt(currentConfig.gap);
    const paddingSize = parseInt(currentConfig.padding) * 2;
    
    const availableWidth = containerWidth - paddingSize;
    const itemWithGap = minSize + gapSize;
    
    return Math.floor(availableWidth / itemWithGap) || 1;
  }, [containerWidth, currentConfig]);

  // Utilitaire pour calculer la distribution des éléments
  const calculateItemDistribution = (items: any[]) => {
    const cols = typeof calculateOptimalColumns === 'number' ? calculateOptimalColumns : 3;
    const distribution: any[][] = Array.from({ length: cols }, () => []);
    
    items.forEach((item, index) => {
      distribution[index % cols].push(item);
    });
    
    return distribution;
  };

  return {
    itemCount,
    setItemCount,
    calculateOptimalColumns,
    calculateItemDistribution,
  };
};
