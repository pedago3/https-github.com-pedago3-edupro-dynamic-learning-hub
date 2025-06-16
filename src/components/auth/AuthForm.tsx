
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { FormHeader } from './form/FormHeader';
import { LoginFormFields } from './form/LoginFormFields';
import { SignupFormFields } from './form/SignupFormFields';
import { FormActions } from './form/FormActions';
import { AnimatedBackground } from './form/AnimatedBackground';
import { getErrorMessage } from './form/errorHandling';
import { validateUsername, validateFullName } from './form/formValidation';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

export const AuthForm = ({ mode, onModeChange }: AuthFormProps) => {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    email: '',
    password: '',
    fullName: '',
    username: '',
    role: 'student' as 'teacher' | 'student' | 'admin',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(formData.emailOrUsername, formData.password);
        if (error) {
          toast({
            title: 'Échec de la connexion',
            description: getErrorMessage(error),
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Bon retour !',
            description: 'Vous vous êtes connecté avec succès.',
          });
        }
      } else {
        const fullNameError = validateFullName(formData.fullName);
        if (fullNameError) {
          toast({
            title: 'Erreur',
            description: fullNameError,
            variant: 'destructive',
          });
          return;
        }

        const usernameError = validateUsername(formData.username);
        if (usernameError) {
          toast({
            title: 'Erreur',
            description: usernameError,
            variant: 'destructive',
          });
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.fullName, formData.role, formData.username);
        if (error) {
          toast({
            title: 'Échec de l\'inscription',
            description: getErrorMessage(error),
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Compte créé !',
            description: 'Veuillez vérifier votre email pour confirmer votre compte.',
          });
          // Passer en mode connexion après inscription réussie
          setTimeout(() => {
            onModeChange('login');
            setFormData(prev => ({
              ...prev,
              emailOrUsername: formData.email // Pré-remplir avec l'email
            }));
          }, 2000);
        }
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative">
      <AnimatedBackground />
      
      <Card className="relative glass border-gray-200 backdrop-blur-xl bg-white/90 shadow-2xl hover-lift transition-all duration-500 animate-fade-in">
        <FormHeader mode={mode} />
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' ? (
              <SignupFormFields
                fullName={formData.fullName}
                username={formData.username}
                email={formData.email}
                password={formData.password}
                role={formData.role}
                onFullNameChange={(value) => handleInputChange('fullName', value)}
                onUsernameChange={(value) => handleInputChange('username', value)}
                onEmailChange={(value) => handleInputChange('email', value)}
                onPasswordChange={(value) => handleInputChange('password', value)}
                onRoleChange={(value) => handleInputChange('role', value)}
              />
            ) : (
              <LoginFormFields
                emailOrUsername={formData.emailOrUsername}
                password={formData.password}
                onEmailOrUsernameChange={(value) => handleInputChange('emailOrUsername', value)}
                onPasswordChange={(value) => handleInputChange('password', value)}
              />
            )}
            
            <FormActions
              mode={mode}
              loading={loading}
              onModeChange={onModeChange}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
