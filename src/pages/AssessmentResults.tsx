
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, FileText, CheckCircle, XCircle } from 'lucide-react';

const AssessmentResults = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: assessmentData, isLoading } = useQuery({
    queryKey: ['assessment-results', assessmentId, user?.id],
    queryFn: async () => {
      if (!assessmentId || !user) throw new Error('Assessment ID and user are required');

      const { data, error } = await supabase
        .from('assessments')
        .select(`
          *,
          courses (title, teacher_id, profiles!courses_teacher_id_fkey(full_name)),
          assessment_submissions (
            score,
            submitted_at,
            answers
          )
        `)
        .eq('id', assessmentId)
        .eq('assessment_submissions.student_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!assessmentId && !!user
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!assessmentData || !assessmentData.assessment_submissions?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 sm:p-12 text-center">
            <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Résultats non disponibles</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Vous n'avez pas encore passé cette évaluation.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const submission = assessmentData.assessment_submissions[0];
  const scorePercentage = submission.score && assessmentData.max_score 
    ? (submission.score / assessmentData.max_score) * 100 
    : 0;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (percentage: number) => {
    if (percentage >= 70) return 'bg-green-100 text-green-800 border-green-200';
    if (percentage >= 50) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
          
          <Card className="glass border-white/20 backdrop-blur-xl">
            <CardHeader className="pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl mb-2 break-words">{assessmentData.title}</CardTitle>
                  <p className="text-muted-foreground text-sm sm:text-base break-words">
                    Cours: {assessmentData.courses?.title} • Professeur: {assessmentData.courses?.profiles?.full_name}
                  </p>
                </div>
                <Badge className={`${getScoreBadgeColor(scorePercentage)} flex-shrink-0`}>
                  <Trophy className="h-3 w-3 mr-1" />
                  {Math.round(scorePercentage)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 sm:p-6 bg-white/50 rounded-lg">
                  <div className={`text-2xl sm:text-3xl font-bold ${getScoreColor(scorePercentage)}`}>
                    {submission.score}/{assessmentData.max_score || 100}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Score obtenu</div>
                </div>
                <div className="text-center p-4 sm:p-6 bg-white/50 rounded-lg">
                  <div className={`text-2xl sm:text-3xl font-bold ${getScoreColor(scorePercentage)}`}>
                    {Math.round(scorePercentage)}%
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Pourcentage</div>
                </div>
                <div className="text-center p-4 sm:p-6 bg-white/50 rounded-lg sm:col-span-2 lg:col-span-1">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 flex justify-center">
                    {scorePercentage >= 70 ? (
                      <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {scorePercentage >= 70 ? 'Réussi' : 'Échoué'}
                  </div>
                </div>
              </div>

              <Card className={`${scorePercentage >= 70 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <CardContent className="p-4">
                  <h4 className={`font-semibold mb-2 text-sm sm:text-base ${scorePercentage >= 70 ? 'text-green-800' : 'text-red-800'}`}>
                    {scorePercentage >= 70 ? 'Félicitations !' : 'Continuez vos efforts'}
                  </h4>
                  <p className={`text-xs sm:text-sm ${scorePercentage >= 70 ? 'text-green-700' : 'text-red-700'}`}>
                    {scorePercentage >= 70 
                      ? 'Vous avez réussi cette évaluation avec un excellent score !'
                      : 'Vous pouvez revoir le cours et retenter l\'évaluation pour améliorer votre score.'
                    }
                  </p>
                </CardContent>
              </Card>

              <div className="text-center">
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 break-words">
                  Évaluation terminée le {new Date(submission.submitted_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="w-full sm:w-auto text-sm sm:text-base"
                  >
                    Retour au tableau de bord
                  </Button>
                  <Button 
                    onClick={() => navigate(`/assessment/${assessmentId}`)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full sm:w-auto text-sm sm:text-base"
                  >
                    Repasser l'évaluation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
