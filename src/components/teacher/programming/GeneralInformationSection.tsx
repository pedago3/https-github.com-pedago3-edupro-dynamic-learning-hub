
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';

interface GeneralInformationData {
  matiere: string;
  niveau: string;
  enseignant: string;
  horaire: string;
  effectif: string;
  manuel: string;
}

interface GeneralInformationSectionProps {
  formData: GeneralInformationData;
  onInputChange: (field: string, value: any) => void;
}

export const GeneralInformationSection = ({ formData, onInputChange }: GeneralInformationSectionProps) => {
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Info className="h-6 w-6" />
          INFORMATIONS GÉNÉRALES
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold text-gray-700">Matière :</label>
              <Input
                value={formData.matiere}
                onChange={(e) => onInputChange('matiere', e.target.value)}
                placeholder="Ex: Mathématiques"
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold text-gray-700">Niveau :</label>
              <Input
                value={formData.niveau}
                onChange={(e) => onInputChange('niveau', e.target.value)}
                placeholder="Ex: Première Générale"
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold text-gray-700">Enseignant :</label>
              <Input
                value={formData.enseignant}
                onChange={(e) => onInputChange('enseignant', e.target.value)}
                placeholder="Nom et Prénom"
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold text-gray-700">Horaire :</label>
              <Input
                value={formData.horaire}
                onChange={(e) => onInputChange('horaire', e.target.value)}
                placeholder="Ex: 4h/semaine"
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold text-gray-700">Effectif :</label>
              <Input
                value={formData.effectif}
                onChange={(e) => onInputChange('effectif', e.target.value)}
                placeholder="Ex: 28 élèves"
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold text-gray-700">Manuel :</label>
              <Input
                value={formData.manuel}
                onChange={(e) => onInputChange('manuel', e.target.value)}
                placeholder="Référence du manuel"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
