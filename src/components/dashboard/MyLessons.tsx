import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Play, Book, UserPlus, UserMinus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyLessons = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['all-lessons', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get all lessons from courses that exist
      const { data } = await supabase
        .from('lessons')
        .select(`
          *,
          courses (title, teacher_id, profiles!courses_teacher_id_fkey(full_name)),
          lesson_enrollments (student_id),
          lesson_progress (completed, completed_at)
        `)
        .order('created_at', { ascending: false });

      return data || [];
    },
    enabled: !!user
  });

  const { data: assessments } = useQuery({
    queryKey: ['lesson-assessments', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data } = await supabase
        .from('assessments')
        .select(`
          *,
          courses (title),
          assessment_submissions (score, submitted_at)
        `)
        .order('created_at', { ascending: false });

      return data || [];
    },
    enabled: !!user
  });

  const enrollMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('lesson_enrollments')
        .insert({
          student_id: user.id,
          lesson_id: lessonId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Inscription réussie",
        description: "Vous êtes maintenant inscrit à cette leçon !",
      });
      queryClient.invalidateQueries({ queryKey: ['all-lessons'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de s'inscrire à la leçon.",
        variant: "destructive",
      });
    }
  });

  const unenrollMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('lesson_enrollments')
        .delete()
        .eq('student_id', user.id)
        .eq('lesson_id', lessonId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Désinscription réussie",
        description: "Vous n'êtes plus inscrit à cette leçon.",
      });
      queryClient.invalidateQueries({ queryKey: ['all-lessons'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de se désinscrire de la leçon.",
        variant: "destructive",
      });
    }
  });

  const toggleLessonCompletion = async (lessonId: string, isCompleted: boolean) => {
    if (!user) return;

    if (isCompleted) {
      await supabase
        .from('lesson_progress')
        .delete()
        .eq('student_id', user.id)
        .eq('lesson_id', lessonId);
    } else {
      await supabase
        .from('lesson_progress')
        .upsert({
          student_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString()
        });
    }

    queryClient.invalidateQueries({ queryKey: ['all-lessons'] });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
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

  const enrolledLessons = lessons?.filter(l => 
    l.lesson_enrollments?.some((enrollment: any) => enrollment.student_id === user?.id)
  ) || [];
  
  const availableLessons = lessons?.filter(l => 
    !l.lesson_enrollments?.some((enrollment: any) => enrollment.student_id === user?.id)
  ) || [];

  const completedLessons = enrolledLessons.filter(l => l.lesson_progress?.[0]?.completed) || [];
  const pendingLessons = enrolledLessons.filter(l => !l.lesson_progress?.[0]?.completed) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mes Leçons</h2>
        <div className="text-sm text-muted-foreground">
          {completedLessons.length} / {enrolledLessons.length} terminées
        </div>
      </div>

      {/* Leçons disponibles pour inscription */}
      {availableLessons.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Leçons disponibles</h3>
          <div className="space-y-3">
            {availableLessons.map((lesson: any) => (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{lesson.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Cours: {lesson.courses?.title} • Professeur: {lesson.courses?.profiles?.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Leçon {lesson.order_index + 1} • Créée le {new Date(lesson.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="outline">Disponible</Badge>
                      <Button 
                        size="sm"
                        onClick={() => enrollMutation.mutate(lesson.id)}
                        disabled={enrollMutation.isPending}
                      >
                        {enrollMutation.isPending ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                            Inscription...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            S'inscrire
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Leçons en cours */}
      {pendingLessons.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">À continuer</h3>
          <div className="space-y-3">
            {pendingLessons.map((lesson: any) => (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLessonCompletion(lesson.id, false)}
                        className="p-1"
                      >
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      </Button>
                      <div>
                        <h4 className="font-medium">{lesson.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {lesson.courses?.title} • {lesson.courses?.profiles?.full_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">En cours</Badge>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => unenrollMutation.mutate(lesson.id)}
                        disabled={unenrollMutation.isPending}
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Se désinscrire
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/lesson/${lesson.id}`)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Commencer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Leçons terminées */}
      {completedLessons.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Terminées</h3>
          <div className="space-y-3">
            {completedLessons.map((lesson: any) => (
              <Card key={lesson.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLessonCompletion(lesson.id, true)}
                        className="p-1"
                      >
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </Button>
                      <div>
                        <h4 className="font-medium">{lesson.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {lesson.courses?.title} • Terminé le{' '}
                          {lesson.lesson_progress?.[0]?.completed_at 
                            ? new Date(lesson.lesson_progress[0].completed_at).toLocaleDateString()
                            : 'N/A'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Terminé
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/lesson/${lesson.id}`)}
                      >
                        <Book className="h-4 w-4 mr-1" />
                        Réviser
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Évaluations disponibles */}
      {assessments && assessments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Évaluations disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessments.map((assessment: any) => {
              const isCompleted = assessment.assessment_submissions?.length > 0;
              const submission = assessment.assessment_submissions?.[0];
              
              return (
                <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-base">{assessment.title}</span>
                      <Badge variant={isCompleted ? "default" : "secondary"}>
                        {isCompleted ? "Terminé" : "À faire"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Cours: {assessment.courses?.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {assessment.description || 'Aucune description disponible.'}
                    </p>
                    
                    {isCompleted && submission && (
                      <div className="text-sm">
                        <span className="font-medium">Score: </span>
                        <span className="text-green-600">
                          {submission.score}/{assessment.max_score || 100}
                        </span>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full" 
                      variant={isCompleted ? "outline" : "default"}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {isCompleted ? 'Voir les résultats' : 'Commencer l\'évaluation'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {!lessons?.length && (
        <Card>
          <CardContent className="p-12 text-center">
            <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune leçon disponible</h3>
            <p className="text-muted-foreground">
              Les leçons créées par les professeurs apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
