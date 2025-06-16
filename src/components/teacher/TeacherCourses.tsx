
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BookOpen, Users, Eye, Edit, Trash2, Plus, PlayCircle } from 'lucide-react';
import { useState } from 'react';
import { TeacherCourseCard } from './TeacherCourseCard';
import { TeacherCoursePreview } from './TeacherCoursePreview';
import { TeacherCoursesLoadingSkeleton } from './TeacherCoursesLoadingSkeleton';

interface TeacherCoursesProps {
  onCreateCourse: () => void;
  onCreateLesson: (courseId: string) => void;
  onEditCourse: (courseId: string, courseData: any) => void;
}

export const TeacherCourses = ({ onCreateCourse, onCreateLesson, onEditCourse }: TeacherCoursesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['teacher-courses', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data } = await supabase
        .from('courses')
        .select(`
          *,
          course_enrollments (count),
          lessons (count)
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      return data || [];
    },
    enabled: !!user
  });

  const deleteMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Cours supprimé",
        description: "Le cours a été supprimé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le cours.",
        variant: "destructive",
      });
      console.error('Error deleting course:', error);
    }
  });

  const handleViewCourse = (course: any) => {
    setSelectedCourse(course);
    toast({
      title: "Aperçu du cours",
      description: `Affichage des détails du cours "${course.title}"`,
    });
  };

  const handleEditCourse = (course: any) => {
    onEditCourse(course.id, course);
  };

  const handleDeleteCourse = (courseId: string) => {
    deleteMutation.mutate(courseId);
  };

  if (isLoading) {
    return <TeacherCoursesLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* SUPPRESSION DU TITRE PRINCIPAL (il est géré par le parent) */}
      {/* <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mes Cours</h2>
        <Button onClick={onCreateCourse} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau cours
        </Button>
      </div> */}

      {courses?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun cours créé</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par créer votre premier cours.
            </p>
            <Button onClick={onCreateCourse}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un cours
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course: any) => (
            <TeacherCourseCard
              key={course.id}
              course={course}
              onView={handleViewCourse}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              onCreateLesson={onCreateLesson}
            />
          ))}
        </div>
      )}

      {selectedCourse && (
        <TeacherCoursePreview
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onCreateLesson={onCreateLesson}
          onEdit={handleEditCourse}
        />
      )}
    </div>
  );
};
