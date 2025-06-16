
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';

interface LoginFormFieldsProps {
  emailOrUsername: string;
  password: string;
  onEmailOrUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export const LoginFormFields = ({
  emailOrUsername,
  password,
  onEmailOrUsernameChange,
  onPasswordChange
}: LoginFormFieldsProps) => {
  return (
    <>
      <div className="relative group animate-fade-in animation-delay-300">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <Input
          id="emailOrUsername"
          type="text"
          placeholder="Email ou nom d'utilisateur"
          value={emailOrUsername}
          onChange={(e) => onEmailOrUsernameChange(e.target.value)}
          className="pl-10 h-12 bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300"
          required
        />
        <Label htmlFor="emailOrUsername" className="absolute -top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 px-2 text-xs font-medium text-white rounded">
          Email ou nom d'utilisateur
        </Label>
      </div>
      
      <div className="relative group animate-fade-in animation-delay-500">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="pl-10 h-12 bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300"
          required
          minLength={6}
        />
        <Label htmlFor="password" className="absolute -top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 px-2 text-xs font-medium text-white rounded">
          Mot de passe
        </Label>
      </div>
    </>
  );
};
