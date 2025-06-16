import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, UserPlus } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { createClickEvent } from '@/config/clickEvents';

export const MyCourses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: availableCourses, isLoading } = useQuery({
    queryKey: ['available-courses-dashboard', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Récupérer tous les cours avec les informations du professeur
      const { data: allCourses } = await supabase
        .from('courses')
        .select(`
          *,
          course_enrollments (count),
          lessons (count),
          profiles!courses_teacher_id_fkey (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(4);

      // Récupérer les cours auxquels l'étudiant est déjà inscrit
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('course_id')
        .eq('student_id', user.id);

      const enrolledCourseIds = enrollments?.map(e => e.course_id) || [];

      // Marquer les cours comme inscrits ou disponibles
      return allCourses?.map(course => ({
        ...course,
        isEnrolled: enrolledCourseIds.includes(course.id)
      })) || [];
    },
    enabled: !!user
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          student_id: user.id,
          course_id: courseId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Inscription réussie",
        description: "Vous êtes maintenant inscrit au cours !",
      });
      queryClient.invalidateQueries({ queryKey: ['available-courses-dashboard'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de s'inscrire au cours.",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes Cours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Mes Cours</CardTitle>
        <BookOpen className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {availableCourses?.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Aucun cours disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableCourses?.map((course: any) => (
              <div key={course.id} className="space-y-3 p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <h4 className="text-sm font-medium line-clamp-1">{course.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Par {course.profiles?.full_name || 'Professeur'}
                    </p>
                  </div>
                  <Badge variant={course.isEnrolled ? "default" : "secondary"} className="text-xs ml-2">
                    {course.isEnrolled ? "Inscrit" : "Disponible"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {course.lessons?.[0]?.count || 0} leçons
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {course.course_enrollments?.[0]?.count || 0} étudiants
                  </span>
                </div>

                {!course.isEnrolled && (
                  <EnhancedButton 
                    size="sm" 
                    className="w-full h-8"
                    clickEvent={createClickEvent(`enroll-${course.id}`, {
                      type: 'button',
                      action: 'show-toast',
                      feedback: {
                        loading: 'Inscription en cours...',
                        success: 'Inscription réussie !',
                        error: 'Erreur lors de l\'inscription'
                      },
                      accessibility: {
                        ariaLabel: `S'inscrire au cours ${course.title}`,
                        description: `Lance l'inscription au cours ${course.title}`
                      }
                    })}
                    onClick={() => enrollMutation.mutate(course.id)}
                    loading={enrollMutation.isPending}
                  >
                    <UserPlus className="h-3 w-3 mr-2" />
                    S'inscrire
                  </EnhancedButton>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
