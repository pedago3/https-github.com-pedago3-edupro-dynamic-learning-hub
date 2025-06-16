
import { useState, useEffect, useCallback } from 'react';

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  pixelRatio: number;
  userAgent: string;
  category: 'mobile' | 'tablet' | 'desktop';
}

interface PerformanceMetrics {
  renderTime: number;
  layoutShifts: number;
  overflowElements: number;
  breakpointChanges: number;
}

const DEVICE_PRESETS: DevicePreset[] = [
  {
    name: 'iPhone 15 Pro',
    width: 393,
    height: 852,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    category: 'mobile'
  },
  {
    name: 'iPhone SE',
    width: 375,
    height: 667,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    category: 'mobile'
  },
  {
    name: 'Samsung Galaxy S23',
    width: 360,
    height: 780,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36',
    category: 'mobile'
  },
  {
    name: 'iPad Air',
    width: 820,
    height: 1180,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    category: 'tablet'
  },
  {
    name: 'iPad Mini',
    width: 744,
    height: 1133,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    category: 'tablet'
  },
  {
    name: 'Desktop 1920x1080',
    width: 1920,
    height: 1080,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    category: 'desktop'
  },
  {
    name: 'Desktop 1366x768',
    width: 1366,
    height: 768,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    category: 'desktop'
  }
];

export const useResponsiveDevTools = () => {
  const [currentDevice, setCurrentDevice] = useState<DevicePreset | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    layoutShifts: 0,
    overflowElements: 0,
    breakpointChanges: 0
  });
  const [testResults, setTestResults] = useState<Array<{
    device: string;
    passed: boolean;
    issues: string[];
    timestamp: number;
  }>>([]);

  // Détection des éléments en overflow
  const detectOverflow = useCallback(() => {
    const elements = document.querySelectorAll('*');
    let overflowCount = 0;
    const overflowElements: Element[] = [];

    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);
      
      // Vérifier le débordement horizontal
      if (rect.right > window.innerWidth && computedStyle.overflow !== 'hidden') {
        overflowCount++;
        overflowElements.push(element);
        element.setAttribute('data-overflow-issue', 'horizontal');
      }
      
      // Vérifier le débordement vertical
      if (rect.bottom > window.innerHeight && computedStyle.overflow !== 'hidden') {
        overflowCount++;
        overflowElements.push(element);
        element.setAttribute('data-overflow-issue', 'vertical');
      }
    });

    return { count: overflowCount, elements: overflowElements };
  }, []);

  // Test automatisé pour un appareil spécifique
  const testDevice = useCallback(async (device: DevicePreset): Promise<{
    passed: boolean;
    issues: string[];
  }> => {
    const issues: string[] = [];
    const startTime = performance.now();

    // Simuler la résolution de l'appareil
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;

    // Note: Dans un vrai environnement de test, nous utiliserions des outils comme Puppeteer
    // Ici nous simulons les tests que nous pourrions faire
    
    try {
      // Test 1: Vérification du viewport meta tag
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta || !viewportMeta.getAttribute('content')?.includes('width=device-width')) {
        issues.push('Meta viewport manquant ou incorrect');
      }

      // Test 2: Détection des éléments en overflow
      const overflowResult = detectOverflow();
      if (overflowResult.count > 0) {
        issues.push(`${overflowResult.count} éléments en débordement détectés`);
      }

      // Test 3: Vérification des tailles de police minimales
      const elements = document.querySelectorAll('*');
      elements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const fontSize = parseFloat(computedStyle.fontSize);
        
        if (device.category === 'mobile' && fontSize < 14) {
          issues.push('Texte trop petit pour mobile (< 14px)');
        }
      });

      // Test 4: Vérification des zones tactiles minimales (44px pour mobile)
      if (device.category === 'mobile') {
        const clickableElements = document.querySelectorAll('button, a, input, [onclick]');
        clickableElements.forEach(element => {
          const rect = element.getBoundingClientRect();
          if (rect.width < 44 || rect.height < 44) {
            issues.push('Zone tactile trop petite (< 44px)');
          }
        });
      }

      // Test 5: Performance de rendu
      const renderTime = performance.now() - startTime;
      if (renderTime > 100) {
        issues.push(`Temps de rendu lent: ${renderTime.toFixed(2)}ms`);
      }

      return {
        passed: issues.length === 0,
        issues
      };

    } catch (error) {
      issues.push(`Erreur lors du test: ${error}`);
      return { passed: false, issues };
    }
  }, [detectOverflow]);

  // Lancer une série de tests sur tous les appareils
  const runAllTests = useCallback(async () => {
    setIsTestMode(true);
    const results = [];

    for (const device of DEVICE_PRESETS) {
      console.log(`🧪 Test en cours pour ${device.name}...`);
      setCurrentDevice(device);
      
      const result = await testDevice(device);
      results.push({
        device: device.name,
        passed: result.passed,
        issues: result.issues,
        timestamp: Date.now()
      });

      // Attendre un peu entre les tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setTestResults(results);
    setCurrentDevice(null);
    setIsTestMode(false);
    
    // Afficher un résumé dans la console
    const passedTests = results.filter(r => r.passed).length;
    console.log(`✅ Tests terminés: ${passedTests}/${results.length} réussis`);
    
    return results;
  }, [testDevice]);

  // Observer les Layout Shifts
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const layoutShifts = entries.filter(entry => entry.entryType === 'layout-shift').length;
        
        setPerformanceMetrics(prev => ({
          ...prev,
          layoutShifts: prev.layoutShifts + layoutShifts
        }));
      });

      observer.observe({ entryTypes: ['layout-shift'] });

      return () => observer.disconnect();
    }
  }, []);

  return {
    // État
    currentDevice,
    isTestMode,
    performanceMetrics,
    testResults,
    
    // Actions
    setCurrentDevice,
    runAllTests,
    testDevice,
    detectOverflow,
    
    // Données
    devicePresets: DEVICE_PRESETS,
    
    // Utilitaires
    clearResults: () => setTestResults([]),
    resetMetrics: () => setPerformanceMetrics({
      renderTime: 0,
      layoutShifts: 0,
      overflowElements: 0,
      breakpointChanges: 0
    })
  };
};
