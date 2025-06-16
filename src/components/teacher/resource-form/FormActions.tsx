
import { Button } from '@/components/ui/button';
import { Upload, Youtube } from 'lucide-react';

interface FormActionsProps {
  resourceType: string;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const FormActions = ({ resourceType, isSubmitting, onCancel }: FormActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="flex items-center gap-2"
      >
        {resourceType === 'youtube' ? (
          <Youtube className="h-4 w-4" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {isSubmitting ? 'Ajout...' : 'Ajouter la ressource'}
      </Button>
      <Button 
        type="button" 
        variant="outline"
        onClick={onCancel}
      >
        Annuler
      </Button>
    </div>
  );
};
