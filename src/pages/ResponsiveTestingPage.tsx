
import React from 'react';
import { ResponsiveDebugger } from '@/components/debug/ResponsiveDebugger';
import { ResponsiveTestSuite } from '@/components/debug/ResponsiveTestSuite';
import { ViewportValidator } from '@/components/debug/ViewportValidator';
import { ResponsivePerformanceMonitor } from '@/components/debug/ResponsivePerformanceMonitor';
import { AccessibilityValidator } from '@/components/debug/AccessibilityValidator';
import { ClickEventDebugger } from '@/components/debug/ClickEventDebugger';
import { FlexibleLayoutExample } from '@/components/examples/FlexibleLayoutExample';
import { ResponsiveComponentsExample } from '@/components/examples/ResponsiveComponentsExample';
import { ResponsiveMediaExample } from '@/components/examples/ResponsiveMediaExample';
import { ResponsiveLayoutExample } from '@/components/examples/ResponsiveLayoutExample';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ResponsiveTestingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Centre de Test Responsive
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Système complet de test et validation pour les composants responsives avec LayoutBuilder et widgets adaptatifs
          </p>
        </div>

        <Tabs defaultValue="layout-builder" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="layout-builder">LayoutBuilder</TabsTrigger>
            <TabsTrigger value="flexible">Flexible</TabsTrigger>
            <TabsTrigger value="components">Composants</TabsTrigger>
            <TabsTrigger value="media">Média</TabsTrigger>
            <TabsTrigger value="debug">Debug</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="layout-builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>LayoutBuilder & Widgets Responsives</CardTitle>
                <CardDescription>
                  Système avancé avec MediaQuery, Wrap, Expanded et adaptation automatique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveLayoutExample />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flexible" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Système Flexible Original</CardTitle>
                <CardDescription>
                  Tests des composants FlexibleGrid, FlexibleContainer et hooks associés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FlexibleLayoutExample />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Composants Responsives</CardTitle>
                <CardDescription>
                  Tests des boutons, cartes et grilles responsives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveComponentsExample />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Média Responsif</CardTitle>
                <CardDescription>
                  Tests des images et vidéos responsives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveMediaExample />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="debug" className="space-y-6">
            <ResponsiveDebugger />
            <ResponsiveTestSuite />
            <ViewportValidator />
            <ClickEventDebugger />
            <AccessibilityValidator />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <ResponsivePerformanceMonitor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResponsiveTestingPage;
