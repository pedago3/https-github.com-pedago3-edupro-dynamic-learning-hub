
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Book, Clock, CheckCircle, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LessonView = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId, user?.id],
    queryFn: async () => {
      if (!user || !lessonId) return null;

      const { data, error } = await supabase
        .from('lessons')
        .select(`
          *,
          courses (title, teacher_id, profiles!courses_teacher_id_fkey(full_name)),
          lesson_enrollments (student_id),
          lesson_progress (completed, completed_at)
        `)
        .eq('id', lessonId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!lessonId
  });

  const markAsCompleted = async () => {
    if (!user || !lessonId) return;

    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          student_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Leçon terminée",
        description: "Félicitations ! Vous avez terminé cette leçon.",
      });

      // Refresh lesson data
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de marquer la leçon comme terminée.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Leçon non trouvée</h1>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  const isEnrolled = lesson.lesson_enrollments?.some((enrollment: any) => 
    enrollment.student_id === user?.id
  );
  const isCompleted = lesson.lesson_progress?.[0]?.completed;

  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-6">Vous devez être inscrit à cette leçon pour la consulter.</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          
          {isCompleted && (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Terminé
            </Badge>
          )}
        </div>

        {/* Lesson Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Book className="h-4 w-4" />
                    {lesson.courses?.title}
                  </span>
                  <span>Professeur: {lesson.courses?.profiles?.full_name}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Leçon {lesson.order_index + 1}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Video Section */}
        {lesson.video_url && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Vidéo de la leçon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={lesson.video_url}
                  className="w-full h-full"
                  allowFullScreen
                  title={lesson.title}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Section */}
        {lesson.content && (
          <Card>
            <CardHeader>
              <CardTitle>Contenu de la leçon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty state if no content */}
        {!lesson.content && !lesson.video_url && (
          <Card>
            <CardContent className="p-12 text-center">
              <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Contenu en préparation</h3>
              <p className="text-muted-foreground">
                Le contenu de cette leçon sera bientôt disponible.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {isCompleted ? (
                  <span>Terminé le {new Date(lesson.lesson_progress?.[0]?.completed_at).toLocaleDateString()}</span>
                ) : (
                  <span>Marquez cette leçon comme terminée une fois que vous l'avez étudiée</span>
                )}
              </div>
              
              {!isCompleted && (
                <Button onClick={markAsCompleted} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marquer comme terminée
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonView;
