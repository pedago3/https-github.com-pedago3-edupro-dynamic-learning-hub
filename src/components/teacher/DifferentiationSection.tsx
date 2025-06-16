
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heart } from 'lucide-react';

interface DifferentiationData {
  elevesDifficulte: string;
  elevesHautPotentiel: string;
  besoinsPep: string;
}

interface DifferentiationSectionProps {
  formData: DifferentiationData;
  onInputChange: (field: string, value: any) => void;
}

export const DifferentiationSection = ({ formData, onInputChange }: DifferentiationSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-pink-600" />
          Différenciation Pédagogique
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Élèves en difficulté :</h3>
            <Textarea
              value={formData.elevesDifficulte}
              onChange={(e) => onInputChange('elevesDifficulte', e.target.value)}
              placeholder="Stratégies d'accompagnement, exercices adaptés, soutien personnalisé..."
              className="h-24"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Élèves à haut potentiel :</h3>
            <Textarea
              value={formData.elevesHautPotentiel}
              onChange={(e) => onInputChange('elevesHautPotentiel', e.target.value)}
              placeholder="Activités d'approfondissement, défis supplémentaires, projets avancés..."
              className="h-24"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Besoins éducatifs particuliers (PEP, PAI, etc.) :</h3>
            <Textarea
              value={formData.besoinsPep}
              onChange={(e) => onInputChange('besoinsPep', e.target.value)}
              placeholder="Adaptations spécifiques, aménagements, collaborations avec les équipes spécialisées..."
              className="h-24"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
