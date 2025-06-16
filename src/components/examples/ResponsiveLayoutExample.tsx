
import React from 'react';
import { LayoutBuilder } from '@/components/layout/LayoutBuilder';
import { MediaQuery } from '@/components/layout/MediaQuery';
import { Wrap } from '@/components/layout/Wrap';
import { Expanded } from '@/components/layout/Expanded';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ResponsiveLayoutExample = () => {
  return (
    <div className="p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Système de Layout Responsive</h1>
      
      {/* Exemple 1: LayoutBuilder adaptatif */}
      <Card>
        <CardHeader>
          <CardTitle>LayoutBuilder Adaptatif</CardTitle>
        </CardHeader>
        <CardContent>
          <LayoutBuilder
            layoutType="adaptive"
            adaptToOrientation={true}
            spacing={{ mobile: '1rem', tablet: '1.5rem', desktop: '2rem' }}
            constraints={{
              mobile: { padding: '1rem' },
              tablet: { padding: '1.5rem' },
              desktop: { padding: '2rem' }
            }}
          >
            <Card className="p-4 bg-blue-50">
              <h3 className="font-semibold">Élément 1</h3>
              <p>Se adapte automatiquement à l'orientation et à la taille d'écran</p>
            </Card>
            <Card className="p-4 bg-green-50">
              <h3 className="font-semibold">Élément 2</h3>
              <p>Layout en colonne sur mobile portrait, en ligne sur paysage</p>
            </Card>
            <Card className="p-4 bg-purple-50">
              <h3 className="font-semibold">Élément 3</h3>
              <p>Grille sur desktop, flexible sur mobile</p>
            </Card>
          </LayoutBuilder>
        </CardContent>
      </Card>

      {/* Exemple 2: MediaQuery conditionnel */}
      <Card>
        <CardHeader>
          <CardTitle>MediaQuery Conditionnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MediaQuery mobile>
              <div className="p-4 bg-blue-100 rounded">
                <h3 className="font-semibold">Vue Mobile</h3>
                <p>Affiché uniquement sur mobile</p>
              </div>
            </MediaQuery>

            <MediaQuery tablet desktop>
              <div className="p-4 bg-green-100 rounded">
                <h3 className="font-semibold">Vue Tablette/Desktop</h3>
                <p>Affiché sur tablette et desktop</p>
              </div>
            </MediaQuery>

            <MediaQuery portrait>
              <div className="p-4 bg-purple-100 rounded">
                <h3 className="font-semibold">Mode Portrait</h3>
                <p>Affiché uniquement en orientation portrait</p>
              </div>
            </MediaQuery>

            <MediaQuery landscape>
              <div className="p-4 bg-orange-100 rounded">
                <h3 className="font-semibold">Mode Paysage</h3>
                <p>Affiché uniquement en orientation paysage</p>
              </div>
            </MediaQuery>
          </div>
        </CardContent>
      </Card>

      {/* Exemple 3: Wrap responsive */}
      <Card>
        <CardHeader>
          <CardTitle>Widget Wrap Responsive</CardTitle>
        </CardHeader>
        <CardContent>
          <Wrap
            spacing={{ mobile: '0.5rem', tablet: '1rem', desktop: '1.5rem' }}
            alignment="space-between"
            adaptToOrientation={true}
            direction={{
              mobile: 'vertical',
              tablet: 'horizontal',
              desktop: 'horizontal'
            }}
          >
            <Button variant="outline">Bouton 1</Button>
            <Button variant="outline">Bouton 2</Button>
            <Button variant="outline">Bouton 3</Button>
            <Button variant="outline">Bouton 4</Button>
            <Button variant="outline">Bouton 5</Button>
          </Wrap>
        </CardContent>
      </Card>

      {/* Exemple 4: Expanded flexible */}
      <Card>
        <CardHeader>
          <CardTitle>Widget Expanded Flexible</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 h-32">
            <Expanded 
              flex={{ mobile: 1, tablet: 2, desktop: 3 }}
              className="bg-blue-50 p-4 rounded"
            >
              <div>
                <h4 className="font-semibold">Zone Expandée 1</h4>
                <p>Flex: 1 sur mobile, 2 sur tablette, 3 sur desktop</p>
              </div>
            </Expanded>
            
            <Expanded 
              flex={{ mobile: 2, tablet: 1, desktop: 1 }}
              className="bg-green-50 p-4 rounded"
            >
              <div>
                <h4 className="font-semibold">Zone Expandée 2</h4>
                <p>Flex: 2 sur mobile, 1 sur tablette/desktop</p>
              </div>
            </Expanded>
            
            <Expanded 
              flex={{ mobile: 1, tablet: 1, desktop: 2 }}
              className="bg-purple-50 p-4 rounded"
            >
              <div>
                <h4 className="font-semibold">Zone Expandée 3</h4>
                <p>Flex: 1 sur mobile/tablette, 2 sur desktop</p>
              </div>
            </Expanded>
          </div>
        </CardContent>
      </Card>

      {/* Exemple 5: Layout complexe */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Complexe Adaptatif</CardTitle>
        </CardHeader>
        <CardContent>
          <LayoutBuilder
            layoutType="adaptive"
            adaptToOrientation={true}
            gridColumns={{ mobile: 1, tablet: 2, desktop: 3, xl: 4 }}
            spacing={{ mobile: '1rem', tablet: '1.5rem', desktop: '2rem' }}
          >
            <MediaQuery not mobile>
              <Card className="p-4">
                <h4 className="font-semibold">Masqué sur mobile</h4>
                <p>Ce contenu n'apparaît pas sur mobile</p>
              </Card>
            </MediaQuery>
            
            <Expanded className="min-h-[100px]">
              <Card className="p-4 w-full h-full">
                <h4 className="font-semibold">Zone flexible</h4>
                <p>S'adapte à l'espace disponible</p>
              </Card>
            </Expanded>
            
            <MediaQuery portrait>
              <Card className="p-4 bg-yellow-50">
                <h4 className="font-semibold">Mode portrait uniquement</h4>
                <p>Visible seulement en orientation portrait</p>
              </Card>
            </MediaQuery>
            
            <Wrap 
              alignment="center" 
              spacing={{ mobile: '0.5rem', desktop: '1rem' }}
            >
              <Button size="sm">Action 1</Button>
              <Button size="sm" variant="outline">Action 2</Button>
              <Button size="sm" variant="secondary">Action 3</Button>
            </Wrap>
          </LayoutBuilder>
        </CardContent>
      </Card>
    </div>
  );
};
