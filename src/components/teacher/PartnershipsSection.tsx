
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Network } from 'lucide-react';

interface PartnershipsData {
  interdisciplinarite: string;
  partenariats: string;
  sorties: string;
}

interface PartnershipsSectionProps {
  formData: PartnershipsData;
  onInputChange: (field: string, value: any) => void;
}

export const PartnershipsSection = ({ formData, onInputChange }: PartnershipsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-6 w-6 text-indigo-600" />
          Projets et Partenariats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Projets interdisciplinaires :</h3>
            <Textarea
              value={formData.interdisciplinarite}
              onChange={(e) => onInputChange('interdisciplinarite', e.target.value)}
              placeholder="Collaborations avec d'autres matières, projets transversaux..."
              className="h-24"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Partenariats extérieurs :</h3>
            <Textarea
              value={formData.partenariats}
              onChange={(e) => onInputChange('partenariats', e.target.value)}
              placeholder="Entreprises, associations, institutions culturelles..."
              className="h-24"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Sorties et visites :</h3>
            <Textarea
              value={formData.sorties}
              onChange={(e) => onInputChange('sorties', e.target.value)}
              placeholder="Musées, expositions, entreprises, lieux historiques..."
              className="h-24"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
