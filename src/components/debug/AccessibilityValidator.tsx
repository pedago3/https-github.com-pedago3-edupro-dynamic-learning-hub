
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AccessibleAdaptiveComponent, AccessibleNavigation, useScreenReaderAnnouncements } from '@/components/ui/accessible-adaptive-component';
import { ResponsiveButton } from '@/components/ui/responsive-button';
import { useAccessibilityPreferences } from '@/hooks/useAccessibilityPreferences';
import { AlertTriangle, CheckCircle, Info, Zap } from 'lucide-react';

export const AccessibilityValidator = () => {
  const a11yPrefs = useAccessibilityPreferences();
  const { announce } = useScreenReaderAnnouncements();
  const [testResults, setTestResults] = useState<Array<{
    test: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
  }>>([]);

  const runAccessibilityTests = () => {
    const results = [];
    
    // Test des préférences utilisateur
    results.push({
      test: 'Détection mouvement réduit',
      status: a11yPrefs.prefersReducedMotion ? 'pass' : 'warning' as const,
      message: a11yPrefs.prefersReducedMotion 
        ? 'Animations réduites détectées et respectées' 
        : 'Aucune préférence de mouvement réduit détectée'
    });

    results.push({
      test: 'Détection contraste élevé',
      status: a11yPrefs.prefersHighContrast ? 'pass' : 'warning' as const,
      message: a11yPrefs.prefersHighContrast 
        ? 'Préférence de contraste élevé détectée' 
        : 'Mode contraste normal'
    });

    // Test des cibles tactiles
    const touchTargets = document.querySelectorAll('.a11y-touch-target');
    results.push({
      test: 'Cibles tactiles (44px minimum)',
      status: touchTargets.length > 0 ? 'pass' : 'warning' as const,
      message: `${touchTargets.length} cibles tactiles optimisées détectées`
    });

    // Test du focus visible
    const focusableElements = document.querySelectorAll('.a11y-focus');
    results.push({
      test: 'Focus visible',
      status: focusableElements.length > 0 ? 'pass' : 'fail' as const,
      message: `${focusableElements.length} éléments avec focus visible`
    });

    // Test des textes accessibles
    const accessibleTexts = document.querySelectorAll('.a11y-responsive-text');
    results.push({
      test: 'Tailles de texte accessibles',
      status: accessibleTexts.length > 0 ? 'pass' : 'warning' as const,
      message: `${accessibleTexts.length} éléments avec taille de texte accessible`
    });

    setTestResults(results);
    announce('Tests d\'accessibilité terminés', 'polite');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <Info className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'fail': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const navigationItems = [
    { id: 'home', label: 'Accueil', href: '/', isActive: true },
    { id: 'courses', label: 'Cours', href: '/courses' },
    { id: 'profile', label: 'Profil', href: '/profile' }
  ];

  return (
    <div className="space-y-6">
      {/* Informations sur les préférences d'accessibilité */}
      <Card className="a11y-card">
        <CardHeader>
          <CardTitle className="a11y-responsive-heading flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Préférences d'Accessibilité Détectées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Badge className={a11yPrefs.prefersReducedMotion ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                Mouvement réduit : {a11yPrefs.prefersReducedMotion ? 'Oui' : 'Non'}
              </Badge>
              <Badge className={a11yPrefs.prefersHighContrast ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                Contraste élevé : {a11yPrefs.prefersHighContrast ? 'Oui' : 'Non'}
              </Badge>
              <Badge className={a11yPrefs.prefersDarkMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                Mode sombre : {a11yPrefs.prefersDarkMode ? 'Oui' : 'Non'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exemples de composants accessibles */}
      <Card className="a11y-card">
        <CardHeader>
          <CardTitle className="a11y-responsive-heading">
            Composants Adaptatifs Accessibles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Navigation accessible */}
          <div>
            <h3 className="a11y-responsive-text font-semibold mb-3">Navigation Accessible</h3>
            <AccessibleNavigation 
              items={navigationItems}
              onNavigate={(href) => announce(`Navigation vers ${href}`)}
            />
          </div>

          {/* Boutons responsifs accessibles */}
          <div>
            <h3 className="a11y-responsive-text font-semibold mb-3">Boutons Responsifs</h3>
            <div className="flex flex-wrap gap-3">
              <ResponsiveButton 
                ariaLabel="Bouton principal accessible"
                onClick={() => announce('Bouton principal cliqué')}
              >
                Bouton Principal
              </ResponsiveButton>
              
              <ResponsiveButton 
                variant="outline"
                ariaLabel="Bouton secondaire avec chargement"
                isLoading={false}
                loadingText="Traitement en cours..."
                onClick={() => announce('Bouton secondaire cliqué')}
              >
                Bouton Secondaire
              </ResponsiveButton>
            </div>
          </div>

          {/* Composants adaptatifs */}
          <div>
            <h3 className="a11y-responsive-text font-semibold mb-3">Composants Adaptatifs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AccessibleAdaptiveComponent 
                variant="card"
                className="p-4"
                ariaLabel="Carte d'exemple accessible"
              >
                <h4 className="a11y-responsive-text font-medium mb-2">Carte Accessible</h4>
                <p className="a11y-responsive-text text-gray-600">
                  Cette carte respecte les standards d'accessibilité avec contraste approprié et navigation clavier.
                </p>
              </AccessibleAdaptiveComponent>

              <AccessibleAdaptiveComponent 
                variant="button"
                onClick={() => announce('Composant bouton cliqué')}
                ariaLabel="Composant bouton interactif"
                className="p-4 bg-blue-50 hover:bg-blue-100"
              >
                <span className="a11y-responsive-text">Composant Cliquable</span>
              </AccessibleAdaptiveComponent>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tests d'accessibilité */}
      <Card className="a11y-card">
        <CardHeader>
          <CardTitle className="a11y-responsive-heading">Tests d'Accessibilité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ResponsiveButton 
              onClick={runAccessibilityTests}
              ariaLabel="Lancer les tests d'accessibilité"
              className="w-full md:w-auto"
            >
              Lancer les Tests
            </ResponsiveButton>

            {testResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="a11y-responsive-text font-semibold">Résultats des Tests</h3>
                {testResults.map((result, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border a11y-high-contrast"
                  >
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="font-medium a11y-responsive-text">{result.test}</div>
                      <div className="text-sm text-gray-600">{result.message}</div>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Zone de contenu principal pour les skip links */}
      <div id="main-content" className="sr-only">
        Contenu principal de la page
      </div>
    </div>
  );
};
