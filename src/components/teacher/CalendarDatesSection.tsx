
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import { VacationPeriod } from '@/types/annualProgramming';

interface CalendarDatesData {
  rentree: string;
  vacancesToussaint: VacationPeriod;
  vacancesNoel: VacationPeriod;
  vacancesHiver: VacationPeriod;
  vacancesPrintemps: VacationPeriod;
  bacBlanc: string;
  epreuvesFinales: string;
  grandOral: string;
  finAnnee: string;
}

interface CalendarDatesSectionProps {
  formData: CalendarDatesData;
  onInputChange: (field: string, value: any) => void;
  onNestedInputChange: (parent: string, field: string, value: string) => void;
}

export const CalendarDatesSection = ({ formData, onInputChange, onNestedInputChange }: CalendarDatesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          Calendrier Scolaire et Dates Importantes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Périodes de l'année :</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rentrée :</label>
                <Input
                  type="date"
                  value={formData.rentree}
                  onChange={(e) => onInputChange('rentree', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fin d'année :</label>
                <Input
                  type="date"
                  value={formData.finAnnee}
                  onChange={(e) => onInputChange('finAnnee', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Vacances scolaires :</h3>
            <div className="space-y-3">
              {[
                { key: 'vacancesToussaint', label: 'Vacances de Toussaint' },
                { key: 'vacancesNoel', label: 'Vacances de Noël' },
                { key: 'vacancesHiver', label: 'Vacances d\'hiver' },
                { key: 'vacancesPrintemps', label: 'Vacances de printemps' }
              ].map(vacation => (
                <div key={vacation.key} className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{vacation.label} (début) :</label>
                    <Input
                      type="date"
                      value={(formData as any)[vacation.key].debut}
                      onChange={(e) => onNestedInputChange(vacation.key, 'debut', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{vacation.label} (fin) :</label>
                    <Input
                      type="date"
                      value={(formData as any)[vacation.key].fin}
                      onChange={(e) => onNestedInputChange(vacation.key, 'fin', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Examens et évaluations importantes :</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bac blanc :</label>
              <Input
                type="date"
                value={formData.bacBlanc}
                onChange={(e) => onInputChange('bacBlanc', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Épreuves finales :</label>
              <Input
                type="date"
                value={formData.epreuvesFinales}
                onChange={(e) => onInputChange('epreuvesFinales', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grand oral :</label>
              <Input
                type="date"
                value={formData.grandOral}
                onChange={(e) => onInputChange('grandOral', e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
