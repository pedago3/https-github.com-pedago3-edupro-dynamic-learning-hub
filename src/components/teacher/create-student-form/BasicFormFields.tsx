
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface CreateStudentFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

interface BasicFormFieldsProps {
  control: Control<CreateStudentFormData>;
  fullNameRules: any;
  usernameRules: any;
}

export const BasicFormFields = ({ control, fullNameRules, usernameRules }: BasicFormFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="fullName"
        rules={fullNameRules}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom complet</FormLabel>
            <FormControl>
              <Input
                placeholder="Nom et prénom de l'élève"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="username"
        rules={usernameRules}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pseudo</FormLabel>
            <FormControl>
              <Input
                placeholder="Nom d'utilisateur unique"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
