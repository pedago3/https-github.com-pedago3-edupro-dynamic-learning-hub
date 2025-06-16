
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface FormActionsProps {
  isLoading: boolean;
  onReset: () => void;
}

export const FormActions = ({ isLoading, onReset }: FormActionsProps) => {
  return (
    <div className="flex gap-2 pt-4">
      <Button
        type="submit"
        disabled={isLoading}
        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        {isLoading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            Création...
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            Créer l'élève
          </>
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        disabled={isLoading}
      >
        Réinitialiser
      </Button>
    </div>
  );
};
