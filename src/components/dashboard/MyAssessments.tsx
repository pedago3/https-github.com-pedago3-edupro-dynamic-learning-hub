import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Clock, FileText, Award } from 'lucide-react';

export const MyAssessments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: assessments, isLoading } = useQuery({
    queryKey: ['my-assessments', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // First get the enrolled course IDs
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('course_id')
        .eq('student_id', user.id);

      if (!enrollments || enrollments.length === 0) return [];

      const courseIds = enrollments.map(e => e.course_id);

      // Then get assessments for those courses
      const { data } = await supabase
        .from('assessments')
        .select(`
          *,
          courses (title),
          assessment_submissions (score, submitted_at)
        `)
        .in('course_id', courseIds)
        .order('created_at', { ascending: false });

      return data || [];
    },
    enabled: !!user
  });

  const handleStartAssessment = (assessmentId: string) => {
    console.log('Starting assessment:', assessmentId);
    // Navigate to the assessment page
    navigate(`/assessment/${assessmentId}`);
  };

  const handleViewResults = (assessmentId: string) => {
    console.log('Viewing results for assessment:', assessmentId);
    // Navigate to the assessment results page
    navigate(`/assessment/${assessmentId}/results`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
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

  const completedAssessments = assessments?.filter(a => a.assessment_submissions?.length > 0) || [];
  const pendingAssessments = assessments?.filter(a => a.assessment_submissions?.length === 0) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mes Évaluations</h2>
        <div className="text-sm text-muted-foreground">
          {completedAssessments.length} / {assessments?.length || 0} complétées
        </div>
      </div>

      {pendingAssessments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            À faire
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingAssessments.map((assessment: any) => (
              <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{assessment.title}</span>
                    <Badge variant="secondary">En attente</Badge>
                  </CardTitle>
                  <CardDescription>
                    {assessment.courses?.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {assessment.description || 'Aucune description disponible.'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Score max: {assessment.max_score || 100} points
                    </span>
                    <span>
                      {Array.isArray(assessment.questions) ? assessment.questions.length : 0} questions
                    </span>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => handleStartAssessment(assessment.id)}
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Commencer l'évaluation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {completedAssessments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-green-500" />
            Complétées
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedAssessments.map((assessment: any) => {
              const submission = assessment.assessment_submissions?.[0];
              const scorePercentage = submission?.score && assessment.max_score 
                ? (submission.score / assessment.max_score) * 100 
                : 0;
              
              return (
                <Card key={assessment.id} className="border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{assessment.title}</span>
                      <Badge 
                        variant="outline" 
                        className={`${
                          scorePercentage >= 70 
                            ? 'text-green-600 border-green-600' 
                            : scorePercentage >= 50 
                            ? 'text-orange-600 border-orange-600'
                            : 'text-red-600 border-red-600'
                        }`}
                      >
                        {submission?.score || 0}/{assessment.max_score || 100}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {assessment.courses?.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Score obtenu:</span>
                      <span className="font-medium">
                        {Math.round(scorePercentage)}%
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Terminé le {new Date(submission?.submitted_at).toLocaleDateString()}
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleViewResults(assessment.id)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Voir les résultats
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {!assessments?.length && (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune évaluation disponible</h3>
            <p className="text-muted-foreground">
              Les évaluations apparaîtront ici une fois que vous serez inscrit à des cours.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
