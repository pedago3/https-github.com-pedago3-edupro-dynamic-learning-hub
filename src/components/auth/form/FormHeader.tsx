
import { UserCheck, User } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface FormHeaderProps {
  mode: 'login' | 'signup';
}

export const FormHeader = ({ mode }: FormHeaderProps) => {
  return (
    <CardHeader className="text-center space-y-4 pb-8">
      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center animate-float">
        {mode === 'login' ? (
          <UserCheck className="w-8 h-8 text-white" />
        ) : (
          <User className="w-8 h-8 text-white" />
        )}
      </div>
      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-shimmer">
        {mode === 'login' ? 'Bon retour' : 'Rejoignez EduPro'}
      </CardTitle>
      <CardDescription className="text-gray-600 text-lg">
        {mode === 'login' 
          ? 'Connectez-vous avec votre email ou nom d\'utilisateur' 
          : 'Créez votre compte pour commencer votre parcours éducatif'
        }
      </CardDescription>
    </CardHeader>
  );
};
