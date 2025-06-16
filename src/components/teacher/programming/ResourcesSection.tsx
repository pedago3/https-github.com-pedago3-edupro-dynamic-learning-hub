
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen } from 'lucide-react';

interface ResourcesSectionProps {
  manuelsDocuments: string;
  outilsNumeriques: string;
  materielSpecialise: string;
  onInputChange: (field: string, value: any) => void;
}

export const ResourcesSection = ({ 
  manuelsDocuments, 
  outilsNumeriques, 
  materielSpecialise, 
  onInputChange 
}: ResourcesSectionProps) => {
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          RESSOURCES ET MATÉRIEL
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Manuels et documents :</h4>
            <Textarea
              value={manuelsDocuments}
              onChange={(e) => onInputChange('manuelsDocuments', e.target.value)}
              placeholder="Manuels scolaires, livres de référence, documents..."
              className="h-24"
            />
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Outils numériques :</h4>
            <Textarea
              value={outilsNumeriques}
              onChange={(e) => onInputChange('outilsNumeriques', e.target.value)}
              placeholder="Logiciels, applications, plateformes en ligne..."
              className="h-24"
            />
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Matériel spécialisé :</h4>
            <Textarea
              value={materielSpecialise}
              onChange={(e) => onInputChange('materielSpecialise', e.target.value)}
              placeholder="Laboratoire, instruments, équipements..."
              className="h-24"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
