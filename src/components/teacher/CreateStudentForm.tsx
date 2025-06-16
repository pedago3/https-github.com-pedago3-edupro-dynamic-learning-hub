
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { FormHeader } from './create-student-form/FormHeader';
import { BasicFormFields } from './create-student-form/BasicFormFields';
import { EmailField } from './create-student-form/EmailField';
import { PasswordField } from './create-student-form/PasswordField';
import { FormActions } from './create-student-form/FormActions';
import { createStudentFormValidation, validatePasswordMatch } from './create-student-form/formValidation';

interface CreateStudentFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export const CreateStudentForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateStudentFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
  });

  const createStudent = useMutation({
    mutationFn: async (data: CreateStudentFormData) => {
      if (data.password !== data.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      if (data.password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      // Si aucun email n'est fourni, générer un email temporaire
      const emailToUse = data.email.trim() || `${data.username}@temp-${Date.now()}.local`;

      // Créer l'utilisateur via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailToUse,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            username: data.username,
            role: 'student'
          }
        }
      });

      if (authError) throw authError;

      // On retourne le pseudo-email pour affichage
      return { authData, emailToUse, pseudoEmailGenerated: !data.email.trim() };
    },
    onSuccess: (result) => {
      toast({
        title: "Élève créé",
        description: "Le nouvel élève a été créé avec succès.",
      });
      if (result?.pseudoEmailGenerated && result.emailToUse) {
        toast({
          title: "Pseudo-email généré pour l'élève",
          description: (
            <span>
              Aucun email n'ayant été saisi, l'élève devra utiliser ce pseudo-email pour se connecter :<br />
              <span className="font-mono bg-gray-100 px-2 py-1 rounded select-all">{result.emailToUse}</span>
              <br />
              <em>Pensez à transmettre ce pseudo-email à l'élève !</em>
            </span>
          ),
          duration: 16000,
        });
      }
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['teacher-students'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'élève.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: CreateStudentFormData) => {
    createStudent.mutate(data);
  };

  return (
    <div className="space-y-6">
      <FormHeader />

      <Card className="glass border-white/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Informations de l'élève</CardTitle>
          <CardDescription>
            Remplissez les informations nécessaires pour créer un compte élève
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <BasicFormFields
                control={form.control}
                fullNameRules={createStudentFormValidation.fullName}
                usernameRules={createStudentFormValidation.username}
              />

              <EmailField
                control={form.control}
                rules={createStudentFormValidation.email}
              />

              <PasswordField
                control={form.control}
                name="password"
                label="Mot de passe"
                placeholder="Mot de passe sécurisé"
                rules={createStudentFormValidation.password}
              />

              <PasswordField
                control={form.control}
                name="confirmPassword"
                label="Confirmer le mot de passe"
                placeholder="Confirmez le mot de passe"
                rules={{
                  ...createStudentFormValidation.confirmPassword,
                  validate: (value: string) => validatePasswordMatch(value, form.watch('password'))
                }}
              />

              <FormActions
                isLoading={createStudent.isPending}
                onReset={() => form.reset()}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
