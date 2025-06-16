
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

export const TeacherStudentsError = () => {
  return (
    <Card className="glass border-red-200 backdrop-blur-xl">
      <CardContent className="p-12 text-center">
        <div className="text-red-600 mb-4">
          <GraduationCap className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
          <p className="text-sm">
            Impossible de charger la liste des élèves.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
