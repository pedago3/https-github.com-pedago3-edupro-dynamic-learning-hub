
import React, { useState } from 'react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, TrendingUp, Play, Zap, Target } from 'lucide-react';
import { ClickEventConfig } from '@/types/clickEvents';
import { EnrolledCoursesDialog } from './EnrolledCoursesDialog';
import { PendingAssessmentsDialog } from './PendingAssessmentsDialog';
import { ProgressStatsDialog } from './ProgressStatsDialog';
import { MissionsDialog } from './MissionsDialog';

export const StudentActionButtons = () => {
  const [isCoursesDialogOpen, setIsCoursesDialogOpen] = useState(false);
  const [isAssessmentsDialogOpen, setIsAssessmentsDialogOpen] = useState(false);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const [isMissionsDialogOpen, setIsMissionsDialogOpen] = useState(false);

  const actionButtons = [
    {
      id: 'my-courses',
      title: 'Mes cours',
      description: 'Accédez à tous vos cours inscrits',
      icon: BookOpen,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      onClick: () => setIsCoursesDialogOpen(true),
      clickEvent: {
        id: 'my-courses',
        type: 'button' as const,
        action: 'show-toast' as const,
        feedback: {
          loading: 'Ouverture de vos cours...',
          success: 'Fenêtre des cours ouverte',
          error: 'Erreur lors de l\'ouverture'
        },
        payload: {
          title: 'Mes cours',
          description: 'Fenêtre des cours inscrits ouverte avec succès.',
          variant: 'default'
        }
      } as ClickEventConfig
    },
    {
      id: 'quizzes-todo',
      title: 'Quiz à faire',
      description: 'Découvrez vos évaluations en attente',
      icon: FileText,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      onClick: () => setIsAssessmentsDialogOpen(true),
      clickEvent: {
        id: 'quizzes-todo',
        type: 'button' as const,
        action: 'show-toast' as const,
        feedback: {
          loading: 'Recherche des quiz en attente...',
          success: 'Fenêtre des quiz ouverte',
          error: 'Erreur lors du chargement'
        },
        payload: {
          title: 'Quiz à faire',
          description: 'Fenêtre des quiz et évaluations ouverte avec succès.',
          variant: 'default'
        }
      } as ClickEventConfig
    },
    {
      id: 'my-progress',
      title: 'Ma progression',
      description: 'Suivez vos statistiques et objectifs',
      icon: TrendingUp,
      gradient: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50',
      onClick: () => setIsProgressDialogOpen(true),
      clickEvent: {
        id: 'my-progress',
        type: 'button' as const,
        action: 'show-toast' as const,
        feedback: {
          loading: 'Chargement de vos statistiques...',
          success: 'Statistiques chargées',
          error: 'Erreur lors du chargement'
        },
        payload: {
          title: 'Ma progression',
          description: 'Fenêtre des statistiques et objectifs ouverte avec succès.',
          variant: 'default'
        }
      } as ClickEventConfig
    },
    {
      id: 'my-missions',
      title: 'Missions',
      description: 'Consultez vos missions et activités',
      icon: Target,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      onClick: () => setIsMissionsDialogOpen(true),
      clickEvent: {
        id: 'my-missions',
        type: 'button' as const,
        action: 'show-toast' as const,
        feedback: {
          loading: 'Chargement de vos missions...',
          success: 'Fenêtre des missions ouverte',
          error: 'Erreur lors du chargement'
        },
        payload: {
          title: 'Missions',
          description: 'Fenêtre des missions et activités ouverte avec succès.',
          variant: 'default'
        }
      } as ClickEventConfig
    }
  ];

  return (
    <>
      <Card className="glass border-white/20 backdrop-blur-xl hover-lift transition-all duration-300 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl gradient-text flex items-center gap-3">
            <Zap className="h-6 w-6" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {actionButtons.map((button, index) => (
              <div 
                key={button.id}
                className={`group p-6 bg-gradient-to-br ${button.bgGradient} rounded-xl border border-white/20 hover:shadow-lg transition-all duration-300 animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 bg-gradient-to-r ${button.gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <button.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">{button.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{button.description}</p>
                  </div>
                  <EnhancedButton
                    clickEvent={button.clickEvent}
                    className={`w-full bg-gradient-to-r ${button.gradient} hover:opacity-90 text-white border-none shadow-md hover:shadow-lg transition-all duration-300`}
                    onClick={button.onClick}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Accéder
                  </EnhancedButton>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <EnrolledCoursesDialog 
        open={isCoursesDialogOpen}
        onOpenChange={setIsCoursesDialogOpen}
      />
      
      <PendingAssessmentsDialog 
        open={isAssessmentsDialogOpen}
        onOpenChange={setIsAssessmentsDialogOpen}
      />

      <ProgressStatsDialog 
        open={isProgressDialogOpen}
        onOpenChange={setIsProgressDialogOpen}
      />

      <MissionsDialog 
        open={isMissionsDialogOpen}
        onOpenChange={setIsMissionsDialogOpen}
      />
    </>
  );
};
