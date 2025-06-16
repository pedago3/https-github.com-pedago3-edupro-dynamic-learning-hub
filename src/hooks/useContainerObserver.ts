
import { useState, useEffect } from 'react';

export const useContainerObserver = () => {
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Hook pour observer la largeur du conteneur
  const useContainerObserver = () => {
    useEffect(() => {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });

      return () => {
        observer.disconnect();
      };
    }, []);
  };

  return {
    containerWidth,
    useContainerObserver,
  };
};
