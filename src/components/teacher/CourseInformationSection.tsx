
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Book } from 'lucide-react';

interface CourseData {
  matiere: string;
  niveau: string;
  specialite: string;
  heuresParSemaine: number;
}

interface CourseInformationSectionProps {
  formData: CourseData;
  onInputChange: (field: string, value: any) => void;
}

export const CourseInformationSection = ({ formData, onInputChange }: CourseInformationSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-6 w-6 text-blue-600" />
          Informations du Cours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Matière :</label>
            <Input
              value={formData.matiere}
              onChange={(e) => onInputChange('matiere', e.target.value)}
              placeholder="Ex: Mathématiques"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Niveau :</label>
            <Select value={formData.niveau} onValueChange={(value) => onInputChange('niveau', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seconde">Seconde</SelectItem>
                <SelectItem value="premiere-generale">Première Générale</SelectItem>
                <SelectItem value="premiere-technologique">Première Technologique</SelectItem>
                <SelectItem value="premiere-professionnelle">Première Professionnelle</SelectItem>
                <SelectItem value="terminale-generale">Terminale Générale</SelectItem>
                <SelectItem value="terminale-technologique">Terminale Technologique</SelectItem>
                <SelectItem value="terminale-professionnelle">Terminale Professionnelle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Spécialité/Filière :</label>
            <Input
              value={formData.specialite}
              onChange={(e) => onInputChange('specialite', e.target.value)}
              placeholder="Ex: Mathématiques"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Heures/semaine :</label>
            <Input
              type="number"
              value={formData.heuresParSemaine}
              onChange={(e) => onInputChange('heuresParSemaine', parseInt(e.target.value) || 0)}
              placeholder="Ex: 4"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
