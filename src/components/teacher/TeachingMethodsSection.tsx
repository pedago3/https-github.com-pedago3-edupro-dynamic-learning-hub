
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Users } from 'lucide-react';

interface TeachingMethodsData {
  approches: string[];
  outils: string[];
  ressources: string;
}

interface TeachingMethodsSectionProps {
  formData: TeachingMethodsData;
  onCheckboxChange: (field: 'approches' | 'outils', value: string, checked: boolean) => void;
  onInputChange: (field: string, value: any) => void;
}

export const TeachingMethodsSection = ({ formData, onCheckboxChange, onInputChange }: TeachingMethodsSectionProps) => {
  const approches = [
    'Cours magistral',
    'Travail en groupe',
    'Pédagogie inversée',
    'Apprentissage par projet',
    'Études de cas',
    'Expérimentation'
  ];

  const outils = [
    'Tableau numérique',
    'Ordinateurs/tablettes',
    'Laboratoire',
    'Manuels scolaires',
    'Ressources en ligne',
    'Logiciels spécialisés'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6 text-purple-600" />
          Méthodes d'Enseignement et Ressources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Approches pédagogiques :</h3>
            <div className="space-y-2">
              {approches.map(approche => (
                <div key={approche} className="flex items-center space-x-2">
                  <Checkbox
                    id={`approche-${approche}`}
                    checked={formData.approches.includes(approche)}
                    onCheckedChange={(checked) => onCheckboxChange('approches', approche, !!checked)}
                  />
                  <label htmlFor={`approche-${approche}`} className="text-sm font-medium">
                    {approche}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Outils et supports :</h3>
            <div className="space-y-2">
              {outils.map(outil => (
                <div key={outil} className="flex items-center space-x-2">
                  <Checkbox
                    id={`outil-${outil}`}
                    checked={formData.outils.includes(outil)}
                    onCheckedChange={(checked) => onCheckboxChange('outils', outil, !!checked)}
                  />
                  <label htmlFor={`outil-${outil}`} className="text-sm font-medium">
                    {outil}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Ressources complémentaires :</h3>
          <Textarea
            value={formData.ressources}
            onChange={(e) => onInputChange('ressources', e.target.value)}
            placeholder="Livres, sites web, vidéos, documentaires..."
            className="h-24"
          />
        </div>
      </CardContent>
    </Card>
  );
};
