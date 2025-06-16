
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ClipboardCheck } from 'lucide-react';

interface EvaluationItem {
  type: string;
  date: string;
}

interface EvaluationsSectionProps {
  evaluationsFormatives: EvaluationItem[];
  evaluationsSommatives: EvaluationItem[];
  coefficientsBareme: string;
  onArrayChange: (arrayName: string, index: number, field: string, value: string) => void;
  onInputChange: (field: string, value: any) => void;
}

export const EvaluationsSection = ({ 
  evaluationsFormatives, 
  evaluationsSommatives, 
  coefficientsBareme,
  onArrayChange, 
  onInputChange 
}: EvaluationsSectionProps) => {
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-6 w-6" />
          ÉVALUATIONS
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Évaluations formatives :</h4>
            {evaluationsFormatives.map((evaluation, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={evaluation.type}
                  onChange={(e) => onArrayChange('evaluationsFormatives', index, 'type', e.target.value)}
                  placeholder="Type d'évaluation"
                  className="flex-1"
                />
                <Input
                  value={evaluation.date}
                  onChange={(e) => onArrayChange('evaluationsFormatives', index, 'date', e.target.value)}
                  placeholder="Date/Semaine"
                  className="w-24"
                />
              </div>
            ))}
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Évaluations sommatives :</h4>
            {evaluationsSommatives.map((evaluation, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={evaluation.type}
                  onChange={(e) => onArrayChange('evaluationsSommatives', index, 'type', e.target.value)}
                  placeholder="Type d'évaluation"
                  className="flex-1"
                />
                <Input
                  value={evaluation.date}
                  onChange={(e) => onArrayChange('evaluationsSommatives', index, 'date', e.target.value)}
                  placeholder="Date/Semaine"
                  className="w-24"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-3">Coefficients et barème :</h4>
          <Textarea
            value={coefficientsBareme}
            onChange={(e) => onInputChange('coefficientsBareme', e.target.value)}
            placeholder="DS: 40%, DM: 20%, TP: 20%, Participation: 20%..."
            className="h-20"
          />
        </div>
      </CardContent>
    </Card>
  );
};
