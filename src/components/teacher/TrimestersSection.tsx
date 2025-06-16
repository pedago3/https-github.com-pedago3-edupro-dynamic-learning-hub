
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen } from 'lucide-react';
import { TrimestreData } from '@/types/annualProgramming';

interface TrimestersData {
  trimestre1: TrimestreData;
  trimestre2: TrimestreData;
  trimestre3: TrimestreData;
}

interface TrimestersSectionProps {
  formData: TrimestersData;
  onNestedInputChange: (parent: string, field: string, value: string) => void;
}

export const TrimestersSection = ({ formData, onNestedInputChange }: TrimestersSectionProps) => {
  const trimesters = [
    { key: 'trimestre1', label: 'Premier Trimestre' },
    { key: 'trimestre2', label: 'Deuxième Trimestre' },
    { key: 'trimestre3', label: 'Troisième Trimestre' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-orange-600" />
          Répartition par Trimestres
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {trimesters.map(trimester => (
            <div key={trimester.key} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">{trimester.label}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chapitres :</label>
                  <Textarea
                    value={(formData as any)[trimester.key].chapitres}
                    onChange={(e) => onNestedInputChange(trimester.key, 'chapitres', e.target.value)}
                    placeholder="• Chapitre 1&#10;• Chapitre 2&#10;..."
                    className="h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activités :</label>
                  <Textarea
                    value={(formData as any)[trimester.key].activites}
                    onChange={(e) => onNestedInputChange(trimester.key, 'activites', e.target.value)}
                    placeholder="• Activité 1&#10;• Activité 2&#10;..."
                    className="h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Évaluations :</label>
                  <Textarea
                    value={(formData as any)[trimester.key].evaluations}
                    onChange={(e) => onNestedInputChange(trimester.key, 'evaluations', e.target.value)}
                    placeholder="• Évaluation 1&#10;• Évaluation 2&#10;..."
                    className="h-24"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
