
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Mail, HelpCircle } from 'lucide-react';
import { Control } from 'react-hook-form';

interface CreateStudentFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

interface EmailFieldProps {
  control: Control<CreateStudentFormData>;
  rules: any;
}

export const EmailField = ({ control, rules }: EmailFieldProps) => {
  return (
    <FormField
      control={control}
      name="email"
      rules={rules}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-1">
            <FormLabel>Adresse email</FormLabel>
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              (optionnel)
              <HelpCircle className="w-4 h-4" />
            </span>
          </div>
          <FormControl>
            <Input
              type="email"
              placeholder="email@exemple.com (laisser vide pour générer un pseudo-email)"
              {...field}
            />
          </FormControl>
          <div className="text-xs text-slate-400 leading-relaxed flex items-start gap-2 mt-1">
            <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Si la case email est vide,<span className="font-semibold text-indigo-700"> un pseudo-email automatique sera généré</span>,<br />
              du type <span className="font-mono bg-gray-100 p-1 rounded">@temp-...local</span>.<br />
              L'élève devra l'utiliser pour se connecter. Veillez à bien le lui transmettre après la création du compte.
            </span>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
