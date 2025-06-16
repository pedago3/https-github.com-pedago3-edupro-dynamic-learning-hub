
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ViewportIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  recommendation?: string;
}

export const ViewportValidator = () => {
  const [issues, setIssues] = useState<ViewportIssue[]>([]);

  useEffect(() => {
    const validateViewport = () => {
      const foundIssues: ViewportIssue[] = [];
      
      // Vérifier la présence du meta viewport
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      
      if (!viewportMeta) {
        foundIssues.push({
          type: 'error',
          message: 'Meta viewport manquant',
          recommendation: 'Ajouter <meta name="viewport" content="width=device-width, initial-scale=1">'
        });
      } else {
        const content = viewportMeta.getAttribute('content') || '';
        
        // Vérifier width=device-width
        if (!content.includes('width=device-width')) {
          foundIssues.push({
            type: 'error',
            message: 'width=device-width manquant dans le meta viewport',
            recommendation: 'Ajouter width=device-width dans le contenu du meta viewport'
          });
        }
        
        // Vérifier initial-scale=1
        if (!content.includes('initial-scale=1')) {
          foundIssues.push({
            type: 'warning',
            message: 'initial-scale=1 manquant',
            recommendation: 'Ajouter initial-scale=1 pour un zoom initial correct'
          });
        }
        
        // Vérifier user-scalable=no (non recommandé)
        if (content.includes('user-scalable=no')) {
          foundIssues.push({
            type: 'warning',
            message: 'user-scalable=no détecté',
            recommendation: 'Éviter user-scalable=no pour l\'accessibilité'
          });
        }
        
        // Vérifier maximum-scale trop restrictif
        const maxScaleMatch = content.match(/maximum-scale=([0-9.]+)/);
        if (maxScaleMatch && parseFloat(maxScaleMatch[1]) < 2) {
          foundIssues.push({
            type: 'warning',
            message: 'maximum-scale trop restrictif',
            recommendation: 'Permettre un zoom jusqu\'à 200% minimum pour l\'accessibilité'
          });
        }
      }
      
      // Vérifier les CSS viewport units
      const computedStyle = window.getComputedStyle(document.documentElement);
      const hasVwVh = ['width', 'height', 'min-width', 'min-height', 'max-width', 'max-height']
        .some(prop => {
          const value = computedStyle.getPropertyValue(prop);
          return value.includes('vw') || value.includes('vh');
        });
      
      if (hasVwVh) {
        foundIssues.push({
          type: 'info',
          message: 'Unités viewport (vw/vh) détectées',
          recommendation: 'Vérifier que les unités viewport se comportent correctement sur mobile'
        });
      }
      
      // Vérifier la largeur minimale du contenu
      const bodyWidth = document.body.scrollWidth;
      const viewportWidth = window.innerWidth;
      
      if (bodyWidth > viewportWidth + 5) { // +5px de tolérance
        foundIssues.push({
          type: 'error',
          message: `Contenu plus large que le viewport (${bodyWidth}px > ${viewportWidth}px)`,
          recommendation: 'Vérifier les éléments qui dépassent et ajuster le CSS'
        });
      }
      
      setIssues(foundIssues);
    };

    validateViewport();
    
    // Re-valider lors du redimensionnement
    window.addEventListener('resize', validateViewport);
    return () => window.removeEventListener('resize', validateViewport);
  }, []);

  const getIssueIcon = (type: ViewportIssue['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getIssueColor = (type: ViewportIssue['type']) => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'outline';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {issues.length === 0 ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          )}
          Validation du Viewport
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {issues.length === 0 ? (
          <div className="text-center py-8 text-green-600">
            <CheckCircle className="h-12 w-12 mx-auto mb-4" />
            <p className="font-medium">Configuration viewport correcte !</p>
            <p className="text-sm text-muted-foreground mt-2">
              Aucun problème détecté dans la configuration du viewport.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {getIssueIcon(issue.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{issue.message}</span>
                      <Badge variant={getIssueColor(issue.type)} className="text-xs">
                        {issue.type}
                      </Badge>
                    </div>
                    {issue.recommendation && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Recommandation:</strong> {issue.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Informations sur le viewport actuel */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Informations Viewport</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Largeur:</span>
              <span className="ml-2 font-mono">{window.innerWidth}px</span>
            </div>
            <div>
              <span className="text-muted-foreground">Hauteur:</span>
              <span className="ml-2 font-mono">{window.innerHeight}px</span>
            </div>
            <div>
              <span className="text-muted-foreground">Ratio pixel:</span>
              <span className="ml-2 font-mono">{window.devicePixelRatio}</span>
            </div>
            <div>
              <span className="text-muted-foreground">User Agent:</span>
              <span className="ml-2 font-mono text-xs truncate">
                {navigator.userAgent.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
