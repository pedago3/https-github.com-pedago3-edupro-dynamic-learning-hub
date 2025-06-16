
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveDebugger } from './ResponsiveDebugger';
import { ViewportValidator } from './ViewportValidator';
import { ResponsivePerformanceMonitor } from './ResponsivePerformanceMonitor';
import { ResponsiveHooksDemo } from './ResponsiveHooksDemo';
import { TestTube, Monitor, Zap, Settings, Code2 } from 'lucide-react';

export const ResponsiveTestSuite = () => {
  const [activeTab, setActiveTab] = useState('debugger');

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-6 w-6 text-blue-600" />
            Suite de Tests Responsive
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="debugger" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Débogage
              </TabsTrigger>
              <TabsTrigger value="viewport" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Viewport
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="hooks" className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Hooks Avancés
              </TabsTrigger>
              <TabsTrigger value="devices" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Tests Appareils
              </TabsTrigger>
            </TabsList>

            <TabsContent value="debugger" className="mt-6">
              <ResponsiveDebugger position="relative" />
            </TabsContent>

            <TabsContent value="viewport" className="mt-6">
              <ViewportValidator />
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <ResponsivePerformanceMonitor />
            </TabsContent>

            <TabsContent value="hooks" className="mt-6">
              <ResponsiveHooksDemo />
            </TabsContent>

            <TabsContent value="devices" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tests Automatisés par Appareil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">Tests automatisés disponibles</p>
                    <p className="text-sm mt-2">
                      Utilisez l'onglet "Débogage" pour lancer les tests sur tous les appareils
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
