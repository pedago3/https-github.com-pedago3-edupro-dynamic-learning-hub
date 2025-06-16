
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, BookOpen, Play, FileText, CheckCircle, Clock, Calendar } from 'lucide-react';

interface MissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MissionsDialog = ({ open, onOpenChange }: MissionsDialogProps) => {
  const { user } = useAuth();

  const { data: missionsData, isLoading } = useQuery({
    queryKey: ['missions-dialog', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Récupérer les cours inscrits
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            lessons (
              id,
              title,
              lesson_progress (completed)
            ),
            assessments (
              id,
              title,
              assessment_submissions (id)
            )
          )
        `)
        .eq('student_id', user.id);

      // Récupérer les missions quotidiennes
      const { data: dailyMissions } = await supabase
        .from('daily_missions')
        .select('*')
        .eq('student_id', user.id)
        .order('due_date', { ascending: false })
        .limit(10);

      return {
        enrollments: enrollments || [],
        dailyMissions: dailyMissions || []
      };
    },
    enabled: !!user && open
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Mes Missions et Activités
          </DialogTitle>
          <DialogDescription>
            Aperçu de vos cours, leçons et évaluations reçues
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Missions quotidiennes */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Calendar className="h-5 w-5" />
                  Missions quotidiennes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {missionsData?.dailyMissions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Aucune mission quotidienne disponible.
                  </p>
                ) : (
                  <div className="grid gap-3">
                    {missionsData?.dailyMissions.slice(0, 5).map((mission: any) => (
                      <div 
                        key={mission.id} 
                        className="flex items-center justify-between p-3 bg-white rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          {mission.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-orange-500" />
                          )}
                          <div>
                            <h4 className="font-medium">{mission.title}</h4>
                            {mission.description && (
                              <p className="text-sm text-gray-500">{mission.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={mission.completed ? "default" : "secondary"}>
                            {mission.completed ? "Terminée" : "En cours"}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(mission.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cours et progression */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {missionsData?.enrollments.map((enrollment: any) => {
                const course = enrollment.courses;
                const totalLessons = course?.lessons?.length || 0;
                const completedLessons = course?.lessons?.filter((lesson: any) => 
                  lesson.lesson_progress?.some((progress: any) => progress.completed)
                ).length || 0;
                
                const totalAssessments = course?.assessments?.length || 0;
                const completedAssessments = course?.assessments?.filter((assessment: any) => 
                  assessment.assessment_submissions?.length > 0
                ).length || 0;

                return (
                  <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                        {course?.title}
                      </CardTitle>
                      {course?.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {course.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progression générale */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Progression générale</span>
                          <span className="text-sm text-gray-600">
                            {Math.round(enrollment.progress || 0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${enrollment.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Statistiques des leçons */}
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Play className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Leçons</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-700">
                            {completedLessons}/{totalLessons}
                          </div>
                          <div className="text-xs text-green-600">complétées</div>
                        </div>
                      </div>

                      {/* Statistiques des évaluations */}
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">Évaluations</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-orange-700">
                            {completedAssessments}/{totalAssessments}
                          </div>
                          <div className="text-xs text-orange-600">terminées</div>
                        </div>
                      </div>

                      {/* Actions rapides */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Play className="h-3 w-3 mr-1" />
                          Continuer
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          Quiz
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {missionsData?.enrollments.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun cours inscrit</h3>
                  <p className="text-gray-500">
                    Inscrivez-vous à des cours pour voir vos missions et activités.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
