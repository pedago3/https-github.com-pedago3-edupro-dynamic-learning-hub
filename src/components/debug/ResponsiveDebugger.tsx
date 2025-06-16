
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useResponsiveDevTools } from '@/hooks/useResponsiveDevTools';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  AlertTriangle, 
  CheckCircle, 
  Play,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';

interface ResponsiveDebuggerProps {
  position?: 'fixed' | 'relative';
  className?: string;
}

export const ResponsiveDebugger = ({ 
  position = 'fixed',
  className 
}: ResponsiveDebuggerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showOverflowHighlight, setShowOverflowHighlight] = useState(false);
  const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint();
  const {
    currentDevice,
    isTestMode,
    testResults,
    performanceMetrics,
    runAllTests,
    detectOverflow,
    devicePresets,
    clearResults
  } = useResponsiveDevTools();

  // Afficher les éléments en overflow
  useEffect(() => {
    if (showOverflowHighlight) {
      const result = detectOverflow();
      result.elements.forEach(element => {
        element.classList.add('debug-overflow');
      });

      // Ajouter les styles CSS pour le highlight
      const style = document.createElement('style');
      style.textContent = `
        .debug-overflow {
          outline: 2px solid red !important;
          outline-offset: 2px !important;
          background-color: rgba(255, 0, 0, 0.1) !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.querySelectorAll('.debug-overflow').forEach(element => {
          element.classList.remove('debug-overflow');
        });
        document.head.removeChild(style);
      };
    }
  }, [showOverflowHighlight, detectOverflow]);

  const getBreakpointIcon = () => {
    if (isMobile) return <Smartphone className="h-4 w-4" />;
    if (isTablet) return <Tablet className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const getBreakpointColor = () => {
    if (isMobile) return 'bg-green-500';
    if (isTablet) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className={cn(
          'z-50',
          position === 'fixed' && 'fixed bottom-4 right-4'
        )}
        size="sm"
        variant="outline"
      >
        <Eye className="h-4 w-4 mr-2" />
        Debug Responsive
      </Button>
    );
  }

  return (
    <Card className={cn(
      'w-80 z-50 shadow-2xl',
      position === 'fixed' && 'fixed bottom-4 right-4',
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-500" />
            Débogage Responsive
          </CardTitle>
          <Button
            onClick={() => setIsVisible(false)}
            size="sm"
            variant="ghost"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Breakpoint actuel */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Breakpoint actuel:</span>
          <Badge variant="outline" className="flex items-center gap-2">
            {getBreakpointIcon()}
            {breakpoint}
          </Badge>
        </div>

        {/* Résolution de l'écran */}
        <div className="text-xs text-muted-foreground">
          {window.innerWidth} × {window.innerHeight}px
          <br />
          Ratio: {window.devicePixelRatio}
        </div>

        {/* Métriques de performance */}
        <div className="border rounded-lg p-3 space-y-2">
          <h4 className="text-sm font-medium">Métriques Performance</h4>
          <div className="text-xs space-y-1">
            <div>Layout Shifts: {performanceMetrics.layoutShifts}</div>
            <div>Breakpoint Changes: {performanceMetrics.breakpointChanges}</div>
          </div>
        </div>

        {/* Actions de test */}
        <div className="space-y-2">
          <Button
            onClick={runAllTests}
            disabled={isTestMode}
            size="sm"
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            {isTestMode ? 'Test en cours...' : 'Tester tous les appareils'}
          </Button>

          <Button
            onClick={() => setShowOverflowHighlight(!showOverflowHighlight)}
            size="sm"
            variant={showOverflowHighlight ? 'destructive' : 'outline'}
            className="w-full"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            {showOverflowHighlight ? 'Masquer overflow' : 'Détecter overflow'}
          </Button>
        </div>

        {/* Résultats des tests */}
        {testResults.length > 0 && (
          <div className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Résultats Tests</h4>
              <Button onClick={clearResults} size="sm" variant="ghost">
                Effacer
              </Button>
            </div>
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="truncate">{result.device}</span>
                  <div className="flex items-center gap-1">
                    {result.passed ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                    <span className="text-muted-foreground">
                      {result.issues.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appareil en cours de test */}
        {currentDevice && (
          <div className="border rounded-lg p-3 bg-blue-50">
            <h4 className="text-sm font-medium text-blue-700">Test en cours</h4>
            <p className="text-xs text-blue-600">{currentDevice.name}</p>
            <p className="text-xs text-muted-foreground">
              {currentDevice.width} × {currentDevice.height}px
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
