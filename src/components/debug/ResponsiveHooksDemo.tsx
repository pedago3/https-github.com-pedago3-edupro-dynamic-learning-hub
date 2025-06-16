
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdaptiveComponent, AdaptiveLayout } from '@/components/ui/adaptive-component';
import { useMediaQuery, useResponsiveQueries } from '@/hooks/useMediaQuery';
import { useResponsiveStyles, useStyledComponent } from '@/hooks/useResponsiveStyles';
import { useTheme } from '@/hooks/useTheme';
import { Monitor, Smartphone, Tablet, Code, Palette } from 'lucide-react';

export const ResponsiveHooksDemo = () => {
  const [demoMode, setDemoMode] = useState<'hooks' | 'styled' | 'theme'>('hooks');
  
  // Démonstration des hooks
  const queries = useResponsiveQueries();
  const { responsive } = useTheme();
  const isNarrowScreen = useMediaQuery('(max-width: 500px)');
  const isWideScreen = useMediaQuery('(min-width: 1400px)');
  
  // Styled component demo
  const styledCard = useStyledComponent('p-4 rounded-lg border');
  
  // Responsive styles demo
  const demoClasses = useResponsiveStyles({
    base: 'transition-all duration-300',
    mobile: 'bg-blue-100 text-blue-800',
    tablet: 'bg-green-100 text-green-800',
    desktop: 'bg-purple-100 text-purple-800',
    xl: 'bg-orange-100 text-orange-800',
  });

  const renderHooksDemo = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            useMediaQuery & useResponsiveQueries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-medium mb-2">Breakpoints Standards</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Mobile:</span>
                  <Badge variant={queries.isMobile ? 'default' : 'outline'}>
                    {queries.isMobile ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Tablet:</span>
                  <Badge variant={queries.isTablet ? 'default' : 'outline'}>
                    {queries.isTablet ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Desktop:</span>
                  <Badge variant={queries.isDesktop ? 'default' : 'outline'}>
                    {queries.isDesktop ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>XL:</span>
                  <Badge variant={queries.isXl ? 'default' : 'outline'}>
                    {queries.isXl ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Conditions Avancées</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Écran étroit (&lt;500px):</span>
                  <Badge variant={isNarrowScreen ? 'destructive' : 'outline'}>
                    {isNarrowScreen ? 'Oui' : 'Non'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Écran large (&gt;1400px):</span>
                  <Badge variant={isWideScreen ? 'default' : 'outline'}>
                    {isWideScreen ? 'Oui' : 'Non'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Portrait:</span>
                  <Badge variant={queries.isPortrait ? 'secondary' : 'outline'}>
                    {queries.isPortrait ? 'Oui' : 'Non'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Mouvement réduit:</span>
                  <Badge variant={queries.prefersReducedMotion ? 'secondary' : 'outline'}>
                    {queries.prefersReducedMotion ? 'Oui' : 'Non'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${demoClasses}`}>
            <p className="font-medium">Styles Responsifs Automatiques</p>
            <p className="text-sm opacity-80">
              Cette zone change de couleur selon le breakpoint actuel
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStyledDemo = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Styled Components Approach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={styledCard.mobile('bg-blue-50 border-blue-200')}>
              <h4 className="font-medium">Style Mobile</h4>
              <p className="text-sm text-gray-600">Actif uniquement sur mobile</p>
            </div>
            
            <div className={styledCard.tablet('bg-green-50 border-green-200')}>
              <h4 className="font-medium">Style Tablet</h4>
              <p className="text-sm text-gray-600">Actif uniquement sur tablet</p>
            </div>
            
            <div className={styledCard.desktop('bg-purple-50 border-purple-200')}>
              <h4 className="font-medium">Style Desktop</h4>
              <p className="text-sm text-gray-600">Actif uniquement sur desktop</p>
            </div>
            
            <div className={styledCard.when(queries.isTouch, 'bg-yellow-50 border-yellow-200')}>
              <h4 className="font-medium">Style Conditionnel</h4>
              <p className="text-sm text-gray-600">
                Actif sur les appareils tactiles : {queries.isTouch ? 'OUI' : 'NON'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderThemeDemo = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Système de Thème
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdaptiveLayout spacing="normal">
            <AdaptiveComponent variant="primary" size="sm">
              Bouton Primary Small
            </AdaptiveComponent>
            
            <AdaptiveComponent variant="secondary" size="md">
              Bouton Secondary Medium
            </AdaptiveComponent>
            
            <AdaptiveComponent variant="accent" size="lg" fullWidth>
              Bouton Accent Large Full Width
            </AdaptiveComponent>
          </AdaptiveLayout>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Espacement Dynamique</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Petit:</span>
                <div style={{ padding: responsive.spacing('sm') }} className="bg-blue-200 rounded mt-1">
                  {responsive.spacing('sm')}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Moyen:</span>
                <div style={{ padding: responsive.spacing('md') }} className="bg-green-200 rounded mt-1">
                  {responsive.spacing('md')}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Grand:</span>
                <div style={{ padding: responsive.spacing('lg') }} className="bg-purple-200 rounded mt-1">
                  {responsive.spacing('lg')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={demoMode === 'hooks' ? 'default' : 'outline'}
          onClick={() => setDemoMode('hooks')}
          size="sm"
        >
          Hooks
        </Button>
        <Button
          variant={demoMode === 'styled' ? 'default' : 'outline'}
          onClick={() => setDemoMode('styled')}
          size="sm"
        >
          Styled Components
        </Button>
        <Button
          variant={demoMode === 'theme' ? 'default' : 'outline'}
          onClick={() => setDemoMode('theme')}
          size="sm"
        >
          Système de Thème
        </Button>
      </div>

      {demoMode === 'hooks' && renderHooksDemo()}
      {demoMode === 'styled' && renderStyledDemo()}
      {demoMode === 'theme' && renderThemeDemo()}
    </div>
  );
};
