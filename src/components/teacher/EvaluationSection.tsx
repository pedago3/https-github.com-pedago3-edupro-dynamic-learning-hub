
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ClipboardCheck } from 'lucide-react';

interface EvaluationData {
  controlsEcrits: number;
  devoirsMaison: number;
  evaluationsOrales: number;
  projets: number;
  participation: number;
  criteresEvaluation: string;
}

interface EvaluationSectionProps {
  formData: EvaluationData;
  onInputChange: (field: string, value: any) => void;
}

export const EvaluationSection = ({ formData, onInputChange }: EvaluationSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-6 w-6 text-red-600" />
          Système d'Évaluation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Répartition des évaluations (%) :</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contrôles écrits :</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.controlsEcrits}
                  onChange={(e) => onInputChange('controlsEcrits', parseInt(e.target.value) || 0)}
                  placeholder="Ex: 50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Devoirs maison :</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.devoirsMaison}
                  onChange={(e) => onInputChange('devoirsMaison', parseInt(e.target.value) || 0)}
                  placeholder="Ex: 20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Évaluations orales :</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.evaluationsOrales}
                  onChange={(e) => onInputChange('evaluationsOrales', parseInt(e.target.value) || 0)}
                  placeholder="Ex: 15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Projets :</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.projets}
                  onChange={(e) => onInputChange('projets', parseInt(e.target.value) || 0)}
                  placeholder="Ex: 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participation :</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.participation}
                  onChange={(e) => onInputChange('participation', parseInt(e.target.value) || 0)}
                  placeholder="Ex: 5"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Critères d'évaluation :</h3>
            <Textarea
              value={formData.criteresEvaluation}
              onChange={(e) => onInputChange('criteresEvaluation', e.target.value)}
              placeholder="• Maîtrise des connaissances&#10;• Qualité de l'expression&#10;• Rigueur du raisonnement&#10;..."
              className="h-64"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
