
import { UserPlus } from 'lucide-react';

export const FormHeader = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
        <UserPlus className="h-6 w-6 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold gradient-text">Créer un nouvel élève</h2>
        <p className="text-slate-600">Ajoutez un nouvel élève à votre plateforme</p>
      </div>
    </div>
  );
};
