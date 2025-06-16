
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  mode: 'login' | 'signup';
  loading: boolean;
  onModeChange: (mode: 'login' | 'signup') => void;
}

export const FormActions = ({ mode, loading, onModeChange }: FormActionsProps) => {
  return (
    <>
      <Button 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 animate-fade-in animation-delay-1000" 
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        <span className="flex items-center gap-2">
          {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
        </span>
      </Button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent px-2 font-medium">
            ou
          </span>
        </div>
      </div>
      
      <div className="text-center animate-fade-in animation-delay-2000">
        <Button 
          variant="ghost" 
          onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
          className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300 text-sm font-medium"
        >
          {mode === 'login' 
            ? "Pas encore de compte ? Créez-en un" 
            : "Déjà un compte ? Connectez-vous"
          }
        </Button>
      </div>
    </>
  );
};
