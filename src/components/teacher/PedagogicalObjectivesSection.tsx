
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Target } from 'lucide-react';

interface ObjectivesData {
  competences: string;
  objectifs: string;
}

interface PedagogicalObjectivesSectionProps {
  formData: ObjectivesData;
  onInputChange: (field: string, value: any) => void;
}

export const PedagogicalObjectivesSection = ({ formData, onInputChange }: PedagogicalObjectivesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-6 w-6 text-green-600" />
          Objectifs Pédagogiques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Compétences à développer :</h3>
            <Textarea
              value={formData.competences}
              onChange={(e) => onInputChange('competences', e.target.value)}
              placeholder="• Compétence 1&#10;• Compétence 2&#10;• Compétence 3&#10;..."
              className="h-32"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Objectifs d'apprentissage :</h3>
            <Textarea
              value={formData.objectifs}
              onChange={(e) => onInputChange('objectifs', e.target.value)}
              placeholder="• Objectif 1&#10;• Objectif 2&#10;• Objectif 3&#10;..."
              className="h-32"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
