
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Lock, AtSign, UserCheck } from 'lucide-react';

interface SignupFormFieldsProps {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: 'teacher' | 'student' | 'admin';
  onFullNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRoleChange: (value: string) => void;
}

export const SignupFormFields = ({
  fullName,
  username,
  email,
  password,
  role,
  onFullNameChange,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onRoleChange
}: SignupFormFieldsProps) => {
  return (
    <div className="space-y-6 animate-fade-in animation-delay-200">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <Input
          id="fullName"
          type="text"
          placeholder="Nom complet"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          className="pl-10 h-12 bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300"
          required
        />
        <Label htmlFor="fullName" className="absolute -top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 px-2 text-xs font-medium text-white rounded">
          Nom complet
        </Label>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <AtSign className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <Input
          id="username"
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value.toLowerCase())}
          className="pl-10 h-12 bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300"
          required
        />
        <Label htmlFor="username" className="absolute -top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 px-2 text-xs font-medium text-white rounded">
          Nom d'utilisateur
        </Label>
      </div>
      
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <UserCheck className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <Select value={role} onValueChange={onRoleChange}>
          <SelectTrigger className="pl-10 h-12 bg-white/80 border-gray-300 text-gray-800 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300">
            <SelectValue placeholder="Sélectionnez votre rôle" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="student" className="text-gray-800 hover:bg-blue-50">Étudiant</SelectItem>
            <SelectItem value="teacher" className="text-gray-800 hover:bg-blue-50">Enseignant</SelectItem>
          </SelectContent>
        </Select>
        <Label className="absolute -top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 px-2 text-xs font-medium text-white rounded">
          Rôle
        </Label>
      </div>

      <div className="relative group animate-fade-in animation-delay-300">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <Input
          id="email"
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="pl-10 h-12 bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300"
          required
        />
        <Label htmlFor="email" className="absolute -top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 px-2 text-xs font-medium text-white rounded">
          Email
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
    </div>
  );
};
