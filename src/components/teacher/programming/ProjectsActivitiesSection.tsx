
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Rocket } from 'lucide-react';

interface ProjectActivity {
  lieu?: string;
  date: string;
  intervenant?: string;
}

interface ProjectsActivitiesSectionProps {
  sortiesPedagogiques: ProjectActivity[];
  interventionsExterieures: ProjectActivity[];
  projetsTransversaux: string;
  onArrayChange: (arrayName: string, index: number, field: string, value: string) => void;
  onInputChange: (field: string, value: any) => void;
}

export const ProjectsActivitiesSection = ({ 
  sortiesPedagogiques, 
  interventionsExterieures, 
  projetsTransversaux,
  onArrayChange, 
  onInputChange 
}: ProjectsActivitiesSectionProps) => {
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-6 w-6" />
          PROJETS ET ACTIVITÉS PÉDAGOGIQUES
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Sorties pédagogiques :</h4>
            {sortiesPedagogiques.map((sortie, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={sortie.lieu || ''}
                  onChange={(e) => onArrayChange('sortiesPedagogiques', index, 'lieu', e.target.value)}
                  placeholder="Lieu de visite"
                  className="flex-1"
                />
                <Input
                  value={sortie.date}
                  onChange={(e) => onArrayChange('sortiesPedagogiques', index, 'date', e.target.value)}
                  placeholder="Date/Semaine"
                  className="w-24"
                />
              </div>
            ))}
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Interventions extérieures :</h4>
            {interventionsExterieures.map((intervention, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={intervention.intervenant || ''}
                  onChange={(e) => onArrayChange('interventionsExterieures', index, 'intervenant', e.target.value)}
                  placeholder="Nom de l'intervenant"
                  className="flex-1"
                />
                <Input
                  value={intervention.date}
                  onChange={(e) => onArrayChange('interventionsExterieures', index, 'date', e.target.value)}
                  placeholder="Date/Semaine"
                  className="w-24"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-3">Projets transversaux :</h4>
          <Textarea
            value={projetsTransversaux}
            onChange={(e) => onInputChange('projetsTransversaux', e.target.value)}
            placeholder="Projets interdisciplinaires, collaborations..."
            className="h-24"
          />
        </div>
      </CardContent>
    </Card>
  );
};
