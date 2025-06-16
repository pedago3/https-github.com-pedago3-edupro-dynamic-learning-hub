
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckSquare, Clock, Award, Play, FileText } from 'lucide-react';

interface PendingAssessmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PendingAssessmentsDialog = ({ open, onOpenChange }: PendingAssessmentsDialogProps) => {
  const { user } = useAuth();

  const { data: pendingAssessments, isLoading } = useQuery({
    queryKey: ['pending-assessments-dialog', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // First get the enrolled course IDs
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('course_id')
        .eq('student_id', user.id);

      if (!enrollments || enrollments.length === 0) return [];

      const courseIds = enrollments.map(e => e.course_id);

      // Then get assessments for those courses that haven't been submitted yet
      const { data } = await supabase
        .from('assessments')
        .select(`
          *,
          courses (title),
          assessment_submissions!left (id)
        `)
        .in('course_id', courseIds)
        .order('created_at', { ascending: false });

      // Filter out assessments that have already been submitted
      const pending = data?.filter(assessment => 
        !assessment.assessment_submissions || assessment.assessment_submissions.length === 0
      ) || [];

      return pending;
    },
    enabled: !!user && open
  });

  const handleStartAssessment = (assessmentId: string) => {
    console.log('Starting assessment:', assessmentId);
    // Here you could navigate to the assessment page
    // navigate(`/assessment/${assessmentId}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Quiz et évaluations à faire
          </DialogTitle>
          <DialogDescription>
            Voici la liste de tous vos quiz et évaluations en attente
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pendingAssessments?.length === 0 ? (
          <div className="text-center py-8">
            <CheckSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun quiz en attente</h3>
            <p className="text-gray-500">
              Vous n'avez actuellement aucun quiz ou évaluation à compléter.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingAssessments?.map((assessment: any) => (
              <Card key={assessment.id} className="hover:shadow-md transition-shadow border-orange-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        {assessment.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Cours: {assessment.courses?.title || 'Non spécifié'}
                      </p>
                      {assessment.description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {assessment.description}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-600 ml-4">
                      En attente
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Score max: {assessment.max_score || 100} points
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {Array.isArray(assessment.questions) ? assessment.questions.length : 0} questions
                      </span>
                    </div>
                    
                    <span className="text-xs text-gray-400">
                      Créé le {new Date(assessment.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => handleStartAssessment(assessment.id)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Commencer l'évaluation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
