
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Clock, GraduationCap } from 'lucide-react';

export const AvailableCourses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['available-courses', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Récupérer tous les cours avec le nombre d'inscrits et de leçons
      const { data: allCourses } = await supabase
        .from('courses')
        .select(`
          *,
          course_enrollments (count),
          lessons (count),
          profiles!courses_teacher_id_fkey (full_name)
        `)
        .order('created_at', { ascending: false });

      // Récupérer les cours auxquels l'étudiant est déjà inscrit
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('course_id')
        .eq('student_id', user.id);

      const enrolledCourseIds = enrollments?.map(e => e.course_id) || [];

      // Filtrer pour ne montrer que les cours non inscrits
      return allCourses?.filter(course => !enrolledCourseIds.includes(course.id)) || [];
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
      queryClient.invalidateQueries({ queryKey: ['available-courses'] });
      queryClient.invalidateQueries({ queryKey: ['student-courses'] });
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
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold gradient-text">Cours disponibles</h2>
          <p className="text-slate-600">Découvrez les cours auxquels vous pouvez vous inscrire</p>
        </div>
      </div>

      {courses?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun cours disponible</h3>
            <p className="text-muted-foreground">
              Il n'y a actuellement aucun nouveau cours disponible pour l'inscription.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course: any) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="line-clamp-2">{course.title}</span>
                  <Badge variant="secondary">
                    {course.course_enrollments?.[0]?.count || 0} étudiants
                  </Badge>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {course.description || 'Aucune description disponible'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.lessons?.[0]?.count || 0} leçons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(course.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Professeur : </span>
                    {course.profiles?.full_name || 'Non spécifié'}
                  </div>

                  <Button 
                    onClick={() => enrollMutation.mutate(course.id)}
                    disabled={enrollMutation.isPending}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {enrollMutation.isPending ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Inscription...
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        S'inscrire
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
