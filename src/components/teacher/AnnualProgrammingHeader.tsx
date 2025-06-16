
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';

interface FormData {
  etablissement: string;
  enseignant: string;
  anneeScolaire: string;
}

interface AnnualProgrammingHeaderProps {
  formData: FormData;
  onInputChange: (field: string, value: any) => void;
}

export const AnnualProgrammingHeader = ({ formData, onInputChange }: AnnualProgrammingHeaderProps) => {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
          <Calendar className="h-8 w-8" />
          PROGRAMMATION ANNUELLE DE COURS
        </CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Établissement :</label>
            <Input
              value={formData.etablissement}
              onChange={(e) => onInputChange('etablissement', e.target.value)}
              placeholder="Nom de l'établissement"
              className="bg-white text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Enseignant(e) :</label>
            <Input
              value={formData.enseignant}
              onChange={(e) => onInputChange('enseignant', e.target.value)}
              placeholder="Nom et prénom"
              className="bg-white text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Année scolaire :</label>
            <Input
              value={formData.anneeScolaire}
              onChange={(e) => onInputChange('anneeScolaire', e.target.value)}
              placeholder="2024-2025"
              className="bg-white text-gray-800"
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
