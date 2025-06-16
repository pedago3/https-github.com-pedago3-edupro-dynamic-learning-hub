
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, FileText } from 'lucide-react';

const AssessmentView = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: assessment, isLoading } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: async () => {
      if (!assessmentId) throw new Error('Assessment ID is required');

      const { data, error } = await supabase
        .from('assessments')
        .select(`
          *,
          courses (title, teacher_id, profiles!courses_teacher_id_fkey(full_name))
        `)
        .eq('id', assessmentId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!assessmentId
  });

  // Récupérer toutes les soumissions pour ce user+assessment (et pas seulement une)
  const { data: submissions, isLoading: loadingSubmissions } = useQuery({
    queryKey: ['assessment-submissions', assessmentId, user?.id],
    queryFn: async () => {
      if (!assessmentId || !user) return [];
      const { data, error } = await supabase
        .from('assessment_submissions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .eq('student_id', user.id)
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!assessmentId && !!user
  });

  const lastSubmission = Array.isArray(submissions) && submissions.length > 0 ? submissions[0] : null;

  const handleStartAssessment = () => {
    navigate(`/assessment/${assessmentId}/take`);
  };

  const handleViewResults = () => {
    navigate(`/assessment/${assessmentId}/results`);
  };

  if (isLoading || loadingSubmissions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 sm:p-12 text-center">
            <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Évaluation non trouvée</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Cette évaluation n'existe pas ou n'est plus disponible.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl mb-2 break-words">{assessment.title}</CardTitle>
                  <p className="text-muted-foreground text-sm sm:text-base break-words">
                    Cours: {assessment.courses?.title} • Professeur: {assessment.courses?.profiles?.full_name}
                  </p>
                </div>
                <Badge variant="secondary" className="flex-shrink-0">
                  <Clock className="h-3 w-3 mr-1" />
                  {lastSubmission ? 'Terminé' : 'En cours'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Description</h3>
                <p className="text-muted-foreground text-sm sm:text-base break-words">
                  {assessment.description || 'Aucune description disponible pour cette évaluation.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">
                    {Array.isArray(assessment.questions) ? assessment.questions.length : 0}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {assessment.max_score || 100}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Points max</div>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg sm:col-span-2 lg:col-span-1">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    ∞
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Temps limité</div>
                </div>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Instructions</h4>
                  <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                    <li>• Lisez attentivement chaque question avant de répondre</li>
                    <li>• Vous pouvez revenir sur vos réponses avant de soumettre</li>
                    <li>• Assurez-vous d'avoir répondu à toutes les questions</li>
                    <li>• Une fois soumise, l'évaluation ne peut plus être modifiée</li>
                    <li>• Vous pouvez repasser cette évaluation autant de fois que souhaité</li>
                  </ul>
                </CardContent>
              </Card>
              <div className="flex justify-center gap-4 flex-col sm:flex-row">
                <Button 
                  size="lg" 
                  onClick={handleStartAssessment}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 w-full sm:w-auto text-sm sm:text-base"
                >
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  {lastSubmission ? "Reprendre l'évaluation" : "Commencer l'évaluation"}
                </Button>
                {lastSubmission && (
                  <Button 
                    onClick={handleViewResults}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 sm:px-8 py-3 w-full sm:w-auto text-sm sm:text-base"
                  >
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Voir les derniers résultats
                  </Button>
                )}
              </div>
              {Array.isArray(submissions) && submissions.length > 1 && (
                <div className="text-xs text-muted-foreground text-center pt-2">
                  <div>Vous avez repassé ce quiz {submissions.length} fois.</div>
                  <div>Votre dernier score s'affichera ici après chaque nouvel essai.</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssessmentView;
