import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Play, UserPlus, UserMinus, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LessonEnrollmentsProps {
  courseId: string;
  courseTitle: string;
}

export const LessonEnrollments = ({ courseId, courseTitle }: LessonEnrollmentsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['course-lessons', courseId, user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data } = await supabase
        .from('lessons')
        .select(`
          *,
          lesson_enrollments (student_id),
          lesson_progress (completed, completed_at)
        `)
        .eq('course_id', courseId)
        .order('order_index');

      return data || [];
    },
    enabled: !!user && !!courseId
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
      queryClient.invalidateQueries({ queryKey: ['course-lessons'] });
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
      queryClient.invalidateQueries({ queryKey: ['course-lessons'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de se désinscrire de la leçon.",
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
        <div className="p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl shadow-lg">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold gradient-text">Leçons - {courseTitle}</h3>
          <p className="text-slate-600">Gérez vos inscriptions aux leçons individuelles</p>
        </div>
      </div>

      {lessons?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune leçon disponible</h3>
            <p className="text-muted-foreground">
              Ce cours ne contient pas encore de leçons.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {lessons?.map((lesson: any) => {
            const isEnrolled = lesson.lesson_enrollments?.some((enrollment: any) => 
              enrollment.student_id === user?.id
            );
            const isCompleted = lesson.lesson_progress?.[0]?.completed;
            
            return (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="line-clamp-2">{lesson.title}</span>
                    <div className="flex gap-2">
                      {isCompleted && (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Terminé
                        </Badge>
                      )}
                      <Badge variant={isEnrolled ? "default" : "secondary"}>
                        {isEnrolled ? "Inscrit" : "Non inscrit"}
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Leçon {lesson.order_index + 1} • Créée le {new Date(lesson.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {lesson.content ? (
                        <span>Contenu disponible</span>
                      ) : (
                        <span>Pas de contenu</span>
                      )}
                      {lesson.video_url && (
                        <span className="ml-2">• Vidéo disponible</span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {isEnrolled ? (
                        <>
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
                            <Play className="h-4 w-4 mr-2" />
                            Commencer
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={() => enrollMutation.mutate(lesson.id)}
                          disabled={enrollMutation.isPending}
                          size="sm"
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
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
