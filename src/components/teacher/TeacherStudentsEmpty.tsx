
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

export const TeacherStudentsEmpty = () => {
  return (
    <Card className="glass border-white/20 backdrop-blur-xl">
      <CardContent className="p-12 text-center">
        <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucun élève inscrit</h3>
        <p className="text-muted-foreground mb-4">
          Il n'y a actuellement aucun élève inscrit à vos cours.
        </p>
        <p className="text-sm text-muted-foreground">
          Vous pouvez créer un nouvel élève ou attendre qu'ils s'inscrivent à vos cours.
        </p>
      </CardContent>
    </Card>
  );
};
