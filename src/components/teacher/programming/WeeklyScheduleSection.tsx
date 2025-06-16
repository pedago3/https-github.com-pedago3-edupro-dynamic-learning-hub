
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';

interface WeekData {
  numero: string;
  dates: string;
  contenu: string;
  activites: string;
  evaluations: string;
}

interface WeeklyScheduleSectionProps {
  semaines: WeekData[];
  onArrayChange: (arrayName: string, index: number, field: string, value: string) => void;
}

export const WeeklyScheduleSection = ({ semaines, onArrayChange }: WeeklyScheduleSectionProps) => {
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          CALENDRIER DÉTAILLÉ (Échantillon)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left font-semibold">Semaine</th>
                <th className="border border-gray-300 p-2 text-left font-semibold">Dates</th>
                <th className="border border-gray-300 p-2 text-left font-semibold">Contenu</th>
                <th className="border border-gray-300 p-2 text-left font-semibold">Activités</th>
                <th className="border border-gray-300 p-2 text-left font-semibold">Évaluations</th>
              </tr>
            </thead>
            <tbody>
              {semaines.map((semaine, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">
                    <Input
                      value={semaine.numero}
                      onChange={(e) => onArrayChange('semaines', index, 'numero', e.target.value)}
                      placeholder={`S${index + 1}`}
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      value={semaine.dates}
                      onChange={(e) => onArrayChange('semaines', index, 'dates', e.target.value)}
                      placeholder="jj-jj mois"
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      value={semaine.contenu}
                      onChange={(e) => onArrayChange('semaines', index, 'contenu', e.target.value)}
                      placeholder="Chapitre ou thème"
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      value={semaine.activites}
                      onChange={(e) => onArrayChange('semaines', index, 'activites', e.target.value)}
                      placeholder="TP, exercices..."
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      value={semaine.evaluations}
                      onChange={(e) => onArrayChange('semaines', index, 'evaluations', e.target.value)}
                      placeholder="Quiz, DS..."
                      className="w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
