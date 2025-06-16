
import { useState, useEffect } from 'react';

// Hook pour optimisation des performances
export const useLayoutOptimization = () => {
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const useIntersectionObserver = (threshold = 0.1) => {
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting);
          // Différer le rendu pour les éléments hors écran
          setShouldRender(entry.isIntersecting || entry.intersectionRatio > threshold);
        },
        { threshold }
      );

      return () => {
        observer.disconnect();
      };
    }, [threshold]);
  };

  return {
    isIntersecting,
    shouldRender,
    useIntersectionObserver,
  };
};
