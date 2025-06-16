
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, Layers, Smartphone } from 'lucide-react';

interface PerformanceData {
  renderTime: number;
  layoutShifts: number;
  repaintTime: number;
  memoryUsage: number;
  domElements: number;
  timestamp: number;
}

export const ResponsivePerformanceMonitor = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceData | null>(null);

  // Mesurer les métriques de performance
  const measurePerformance = (): PerformanceData => {
    const startTime = performance.now();
    
    // Forcer un reflow pour mesurer le temps de rendu
    document.body.offsetHeight;
    const renderTime = performance.now() - startTime;

    // Compter les éléments DOM
    const domElements = document.querySelectorAll('*').length;

    // Mesurer l'utilisation mémoire (si disponible)
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;

    return {
      renderTime,
      layoutShifts: 0, // Sera mis à jour par l'observer
      repaintTime: 0,
      memoryUsage: memoryUsage / (1024 * 1024), // Convertir en MB
      domElements,
      timestamp: Date.now()
    };
  };

  // Observer pour les Layout Shifts
  useEffect(() => {
    if (!isMonitoring) return;

    let layoutShiftScore = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          layoutShiftScore += (entry as any).value;
        }
      }
    });

    observer.observe({ entryTypes: ['layout-shift'] });

    const interval = setInterval(() => {
      const metrics = measurePerformance();
      metrics.layoutShifts = layoutShiftScore;
      
      setCurrentMetrics(metrics);
      setPerformanceData(prev => [...prev.slice(-9), metrics]); // Garder les 10 dernières mesures
    }, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [isMonitoring]);

  const getPerformanceScore = (data: PerformanceData) => {
    let score = 100;
    
    // Pénalités basées sur les métriques
    if (data.renderTime > 16) score -= 20; // 60fps = 16ms par frame
    if (data.layoutShifts > 0.1) score -= 30;
    if (data.domElements > 1500) score -= 15;
    if (data.memoryUsage > 50) score -= 10;
    
    return Math.max(0, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    setPerformanceData([]);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setCurrentMetrics(null);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            Monitoring Performance Responsive
          </CardTitle>
          
          <div className="flex gap-2">
            {!isMonitoring ? (
              <Button onClick={startMonitoring} size="sm">
                Démarrer monitoring
              </Button>
            ) : (
              <Button onClick={stopMonitoring} size="sm" variant="outline">
                Arrêter monitoring
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Score global */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Score Global</p>
                  <p className={`text-2xl font-bold ${getScoreColor(getPerformanceScore(currentMetrics))}`}>
                    {getPerformanceScore(currentMetrics)}
                  </p>
                </div>
                <Badge variant={getScoreBadge(getPerformanceScore(currentMetrics))}>
                  {getPerformanceScore(currentMetrics) >= 80 ? 'Excellent' : 
                   getPerformanceScore(currentMetrics) >= 60 ? 'Bon' : 'À améliorer'}
                </Badge>
              </div>
            </Card>

            {/* Temps de rendu */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-muted-foreground">Temps rendu</p>
              </div>
              <p className="text-lg font-semibold">
                {currentMetrics.renderTime.toFixed(2)}ms
              </p>
              <Progress 
                value={Math.min(100, (currentMetrics.renderTime / 16) * 100)} 
                className="mt-2"
              />
            </Card>

            {/* Layout Shifts */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="h-4 w-4 text-purple-500" />
                <p className="text-sm text-muted-foreground">Layout Shifts</p>
              </div>
              <p className="text-lg font-semibold">
                {currentMetrics.layoutShifts.toFixed(3)}
              </p>
              <Progress 
                value={Math.min(100, (currentMetrics.layoutShifts / 0.25) * 100)} 
                className="mt-2"
              />
            </Card>

            {/* Mémoire */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-4 w-4 text-green-500" />
                <p className="text-sm text-muted-foreground">Mémoire</p>
              </div>
              <p className="text-lg font-semibold">
                {currentMetrics.memoryUsage.toFixed(1)}MB
              </p>
              <Progress 
                value={Math.min(100, (currentMetrics.memoryUsage / 100) * 100)} 
                className="mt-2"
              />
            </Card>
          </div>
        )}

        {/* Graphique historique */}
        {performanceData.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Historique des performances</h4>
            <div className="h-32 flex items-end gap-1 bg-gray-50 p-4 rounded-lg">
              {performanceData.map((data, index) => {
                const score = getPerformanceScore(data);
                return (
                  <div
                    key={index}
                    className="flex-1 bg-blue-500 rounded-t"
                    style={{ height: `${score}%` }}
                    title={`Score: ${score} - ${new Date(data.timestamp).toLocaleTimeString()}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Recommandations */}
        {currentMetrics && getPerformanceScore(currentMetrics) < 80 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Recommandations d'optimisation</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {currentMetrics.renderTime > 16 && (
                <li>• Optimiser le temps de rendu (cible: &lt;16ms pour 60fps)</li>
              )}
              {currentMetrics.layoutShifts > 0.1 && (
                <li>• Réduire les Layout Shifts (réserver l'espace pour les images/contenus)</li>
              )}
              {currentMetrics.domElements > 1500 && (
                <li>• Réduire le nombre d'éléments DOM ({currentMetrics.domElements} éléments)</li>
              )}
              {currentMetrics.memoryUsage > 50 && (
                <li>• Optimiser l'utilisation mémoire ({currentMetrics.memoryUsage.toFixed(1)}MB)</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
