
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

interface NotesData {
  indicateursReussite: string;
  ajustements: string;
  notesPersonnelles: string;
}

interface NotesSectionProps {
  formData: NotesData;
  onInputChange: (field: string, value: any) => void;
}

export const NotesSection = ({ formData, onInputChange }: NotesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-gray-600" />
          Suivi et Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Indicateurs de réussite :</h3>
            <Textarea
              value={formData.indicateursReussite}
              onChange={(e) => onInputChange('indicateursReussite', e.target.value)}
              placeholder="Critères de réussite, objectifs chiffrés, modalités de suivi..."
              className="h-24"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Ajustements en cours d'année :</h3>
            <Textarea
              value={formData.ajustements}
              onChange={(e) => onInputChange('ajustements', e.target.value)}
              placeholder="Adaptations prévues, révisions du programme, remédiations..."
              className="h-24"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Notes personnelles :</h3>
            <Textarea
              value={formData.notesPersonnelles}
              onChange={(e) => onInputChange('notesPersonnelles', e.target.value)}
              placeholder="Réflexions, observations, idées d'amélioration..."
              className="h-32"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
