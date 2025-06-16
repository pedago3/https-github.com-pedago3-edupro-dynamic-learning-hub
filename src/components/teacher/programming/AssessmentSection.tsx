
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ChartLine } from 'lucide-react';

interface AssessmentSectionProps {
  evaluationTrimestre1: string;
  evaluationTrimestre2: string;
  evaluationTrimestre3: string;
  ameliorationsAnneesuivante: string;
  onInputChange: (field: string, value: any) => void;
}

export const AssessmentSection = ({ 
  evaluationTrimestre1, 
  evaluationTrimestre2, 
  evaluationTrimestre3, 
  ameliorationsAnneesuivante,
  onInputChange 
}: AssessmentSectionProps) => {
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <ChartLine className="h-6 w-6" />
          BILAN ET ÉVALUATION
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Bilan du 1er trimestre :</h4>
            <Textarea
              value={evaluationTrimestre1}
              onChange={(e) => onInputChange('evaluationTrimestre1', e.target.value)}
              placeholder="Objectifs atteints, difficultés rencontrées, ajustements..."
              className="h-24"
            />
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Bilan du 2ème trimestre :</h4>
            <Textarea
              value={evaluationTrimestre2}
              onChange={(e) => onInputChange('evaluationTrimestre2', e.target.value)}
              placeholder="Progression des élèves, adaptations pédagogiques..."
              className="h-24"
            />
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Bilan du 3ème trimestre :</h4>
            <Textarea
              value={evaluationTrimestre3}
              onChange={(e) => onInputChange('evaluationTrimestre3', e.target.value)}
              placeholder="Résultats de fin d'année, réussite des objectifs..."
              className="h-24"
            />
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Améliorations pour l'année suivante :</h4>
            <Textarea
              value={ameliorationsAnneesuivante}
              onChange={(e) => onInputChange('ameliorationsAnneesuivante', e.target.value)}
              placeholder="Modifications à apporter, nouvelles méthodes à tester..."
              className="h-32"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
