
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Lightbulb } from 'lucide-react';

interface FormActionsSectionProps {
  onSave: () => void;
  onPrint: () => void;
}

export const FormActionsSection = ({ onSave, onPrint }: FormActionsSectionProps) => {
  return (
    <div className="flex gap-4 justify-end">
      <Button onClick={onSave} className="flex items-center gap-2">
        <Save className="h-4 w-4" />
        Sauvegarder
      </Button>
      <Button onClick={onPrint} variant="outline" className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4" />
        Imprimer
      </Button>
    </div>
  );
};
