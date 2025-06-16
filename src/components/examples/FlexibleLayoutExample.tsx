
import React from 'react';
import { FlexibleGrid, FlexibleGridItem } from '@/components/layout/FlexibleGrid';
import { FlexibleContainer, FlexibleSection } from '@/components/layout/FlexibleContainer';
import { useFlexibleLayout } from '@/hooks/useFlexibleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const FlexibleLayoutExample = () => {
  const layout = useFlexibleLayout({
    columns: { mobile: 1, tablet: 2, desktop: 3, xl: 4 },
    gap: { mobile: '1rem', tablet: '1.5rem', desktop: '2rem' },
    padding: { mobile: '1rem', tablet: '1.5rem', desktop: '2rem' },
    minItemSize: { mobile: '280px', tablet: '300px', desktop: '320px' }
  });

  const demoItems = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Élément ${i + 1}`,
    content: `Contenu de démonstration pour l'élément ${i + 1}`,
    featured: i === 0 || i === 5, // Certains éléments sont mis en avant
  }));

  return (
    <FlexibleContainer size="xl" center>
      <FlexibleSection 
        background="gradient" 
        spacing={{ mobile: '2rem', tablet: '3rem', desktop: '4rem' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Système de Layout Flexible
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Démonstration d'un système adaptatif qui s'ajuste automatiquement à toutes les tailles d'écran
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Breakpoint actuel: <span className="font-mono font-semibold">{layout.currentBreakpoint}</span>
          </div>
        </div>

        {/* Exemple avec CSS Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">CSS Grid Adaptatif</h2>
          <FlexibleGrid
            layout="grid"
            columns={{ mobile: 1, tablet: 2, desktop: 3, xl: 4 }}
            gap={{ mobile: '1rem', tablet: '1.5rem', desktop: '2rem' }}
            align="stretch"
          >
            {demoItems.map((item) => (
              <FlexibleGridItem
                key={item.id}
                colSpan={item.featured ? { mobile: 1, tablet: 2, desktop: 2 } : undefined}
                className="animate-fade-in"
              >
                <Card className="h-full hover-lift transition-all duration-300">
                  <CardHeader>
                    <CardTitle className={item.featured ? 'text-blue-600' : ''}>
                      {item.title}
                      {item.featured && ' ⭐'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.content}</p>
                    <div className="mt-4 text-xs text-gray-400">
                      Colonnes: {item.featured ? '2x' : '1x'}
                    </div>
                  </CardContent>
                </Card>
              </FlexibleGridItem>
            ))}
          </FlexibleGrid>
        </div>

        {/* Exemple avec Flexbox */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Flexbox Adaptatif</h2>
          <FlexibleGrid
            layout="flexbox"
            gap={{ mobile: '1rem', tablet: '1.5rem', desktop: '2rem' }}
            justify="space-between"
            align="stretch"
            minItemSize={{ mobile: '250px', tablet: '280px', desktop: '300px' }}
          >
            {demoItems.slice(0, 6).map((item) => (
              <Card key={item.id} className="flex-1 hover-lift transition-all duration-300">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </FlexibleGrid>
        </div>

        {/* Exemple avec auto-fit */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Auto-fit Responsive</h2>
          <FlexibleGrid
            layout="grid"
            columns={{ 
              mobile: 'auto-fit', 
              tablet: 'auto-fit', 
              desktop: 'auto-fit', 
              xl: 'auto-fit' 
            }}
            minItemSize={{ mobile: '200px', tablet: '250px', desktop: '280px', xl: '300px' }}
            gap={{ mobile: '1rem', tablet: '1.5rem', desktop: '2rem' }}
          >
            {demoItems.slice(0, 8).map((item) => (
              <Card key={item.id} className="hover-lift transition-all duration-300">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </FlexibleGrid>
        </div>

        {/* Informations de debug */}
        <div className="mt-12 p-6 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Informations de Debug</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Breakpoint:</strong> {layout.currentBreakpoint}
            </div>
            <div>
              <strong>Colonnes:</strong> {layout.currentConfig.columns}
            </div>
            <div>
              <strong>Gap:</strong> {layout.currentConfig.gap}
            </div>
            <div>
              <strong>Padding:</strong> {layout.currentConfig.padding}
            </div>
          </div>
        </div>
      </FlexibleSection>
    </FlexibleContainer>
  );
};
