import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

const TakeAssessment = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRetakeConfirm, setShowRetakeConfirm] = useState(false);

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

  // Vérifier si l'élève a déjà passé cette évaluation
  const { data: existingSubmission } = useQuery({
    queryKey: ['assessment-submission', assessmentId, user?.id],
    queryFn: async () => {
      if (!assessmentId || !user) return null;

      const { data, error } = await supabase
        .from('assessment_submissions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .eq('student_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!assessmentId && !!user
  });

  useEffect(() => {
    if (existingSubmission && !showRetakeConfirm) {
      setShowRetakeConfirm(true);
    }
  }, [existingSubmission, showRetakeConfirm]);

  const handleStartFresh = () => {
    console.log('Starting fresh assessment');
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowRetakeConfirm(false);
  };

  const handleContinueFromPrevious = () => {
    console.log('Loading previous answers:', existingSubmission?.answers);
    if (existingSubmission?.answers) {
      setAnswers(existingSubmission.answers as { [key: number]: number });
    }
    setShowRetakeConfirm(false);
  };

  const submitAssessment = useMutation({
    mutationFn: async ({ answers, score }: { answers: { [key: number]: number }, score: number }) => {
      if (!assessmentId || !user) throw new Error('Missing required data');

      // Si une soumission existe déjà, on la met à jour, sinon on en crée une nouvelle
      if (existingSubmission) {
        const { data, error } = await supabase
          .from('assessment_submissions')
          .update({
            answers: answers,
            score: score,
            submitted_at: new Date().toISOString()
          })
          .eq('id', existingSubmission.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('assessment_submissions')
          .insert({
            assessment_id: assessmentId,
            student_id: user.id,
            answers: answers,
            score: score,
            submitted_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      toast({
        title: "Évaluation soumise avec succès !",
        description: "Vous pouvez maintenant voir vos résultats.",
      });
      navigate(`/assessment/${assessmentId}/results`);
    },
    onError: (error) => {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Erreur lors de la soumission",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  });

  // Convertir les questions JSON en type Question avec validation
  const questions: Question[] = assessment?.questions 
    ? (assessment.questions as unknown as Question[]).filter((q): q is Question => 
        q && 
        typeof q.question === 'string' && 
        Array.isArray(q.options) && 
        typeof q.correctAnswer === 'number'
      )
    : [];

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    console.log(`Question ${questionIndex}, selected answer: ${answerIndex}`);
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    console.log('Calculating score with answers:', answers);
    console.log('Questions:', questions);
    
    questions.forEach((question, index) => {
      const studentAnswer = answers[index];
      const correctAnswer = question.correctAnswer;
      
      console.log(`Question ${index}: Student answered ${studentAnswer}, correct answer is ${correctAnswer}`);
      
      // S'assurer que les deux valeurs sont des nombres et égales
      if (studentAnswer !== undefined && Number(studentAnswer) === Number(correctAnswer)) {
        correctAnswers++;
        console.log(`Question ${index}: CORRECT!`);
      } else {
        console.log(`Question ${index}: INCORRECT (${studentAnswer} !== ${correctAnswer})`);
      }
    });
    
    console.log(`Total correct answers: ${correctAnswers} out of ${questions.length}`);
    
    const finalScore = Math.round((correctAnswers / questions.length) * (assessment?.max_score || 100));
    console.log(`Final calculated score: ${finalScore}`);
    
    return finalScore;
  };

  const handleSubmit = async () => {
    console.log('Submitting assessment with answers:', answers);
    
    // Vérifier que toutes les questions ont une réponse
    const unansweredQuestions = questions.some((_, index) => answers[index] === undefined);
    if (unansweredQuestions) {
      toast({
        title: "Questions non répondues",
        description: "Veuillez répondre à toutes les questions avant de soumettre.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const score = calculateScore();
    console.log('Calculated score:', score);
    
    try {
      await submitAssessment.mutateAsync({ answers, score });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!assessment || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 sm:p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Évaluation non disponible</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Cette évaluation n'existe pas ou ne contient pas de questions.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Afficher la confirmation de reprise si une soumission existe
  if (showRetakeConfirm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Reprendre l'évaluation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-center">
              Vous avez déjà passé cette évaluation. Que souhaitez-vous faire ?
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleContinueFromPrevious}
                className="w-full"
                variant="default"
              >
                Voir mes réponses précédentes
              </Button>
              
              <Button 
                onClick={handleStartFresh}
                className="w-full"
                variant="outline"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Recommencer à zéro
              </Button>
              
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full"
                variant="ghost"
              >
                Retour au tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/assessment/${assessmentId}`)}
            className="mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'évaluation
          </Button>
          
          {/* Header */}
          <Card className="glass border-white/20 backdrop-blur-xl mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl break-words">{assessment.title}</CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-muted-foreground text-sm break-words">
                  Question {currentQuestionIndex + 1} sur {questions.length}
                </p>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {answeredQuestions}/{questions.length} répondues
                  {existingSubmission && (
                    <span className="ml-2 text-orange-600">(Reprise)</span>
                  )}
                </div>
              </div>
              <Progress value={progress} className="h-2 bg-white/30" />
            </CardHeader>
          </Card>

          {/* Question */}
          <Card className="glass border-white/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg break-words">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={answers[currentQuestionIndex]?.toString() || ""}
                onValueChange={(value) => handleAnswerChange(currentQuestionIndex, parseInt(value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg glass border border-white/20 hover:bg-white/20 transition-colors">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer text-sm sm:text-base break-words"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground order-1 sm:order-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    answers[index] !== undefined
                      ? 'bg-green-500'
                      : index === currentQuestionIndex
                      ? 'bg-purple-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(answers).length !== questions.length}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white w-full sm:w-auto order-3"
              >
                {isSubmitting ? (
                  "Soumission..."
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {existingSubmission ? "Mettre à jour l'évaluation" : "Soumettre l'évaluation"}
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="w-full sm:w-auto order-3"
              >
                Suivant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeAssessment;
