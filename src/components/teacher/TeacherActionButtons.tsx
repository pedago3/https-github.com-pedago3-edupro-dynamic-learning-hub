
import React from 'react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, FileText, Plus, Target } from 'lucide-react';
import { ClickEventConfig } from '@/types/clickEvents';
import { useTeacherDashboardTab } from '@/components/teacher/dashboard/TeacherDashboardTabContext';

export const TeacherActionButtons = () => {
  const setDashboardTab = useTeacherDashboardTab().setTab;

  const actionButtons = [
    {
      id: 'go-to-courses',
      title: 'Accéder à mes cours',
      description: 'Afficher tous vos cours et les gérer',
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      clickEvent: {
        id: 'go-to-courses',
        type: 'button' as const,
        action: 'show-toast' as const,
        feedback: {
          loading: "Redirection en cours...",
          success: "Onglet 'Cours' ouvert",
          error: "Erreur lors de l'accès aux cours"
        },
        payload: {
          title: 'Action rapide',
          description: 'Vous avez cliqué sur "Accéder à mes cours" !',
          variant: 'default'
        }
      } as ClickEventConfig,
      onAction: () => {
        setDashboardTab('courses');
      }
    },
    {
      id: 'student-tracking',
      title: 'Suivi des élèves',
      description: 'Consultez les progrès de vos élèves',
      icon: Users,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      clickEvent: {
        id: 'student-tracking',
        type: 'button' as const,
        action: 'show-toast' as const,
        feedback: {
          loading: 'Ouverture du suivi des élèves...',
          success: 'Module de suivi ouvert',
          error: 'Erreur lors de l\'ouverture'
        },
        payload: {
          title: 'Action rapide',
          description: 'Vous avez cliqué sur "Suivi des élèves" !',
          variant: 'default'
        }
      } as ClickEventConfig,
      onAction: () => {
        setDashboardTab('students');
      }
    },
    {
      id: 'add-quiz',
      title: 'Ajouter un quiz',
      description: 'Créez une nouvelle évaluation',
      icon: FileText,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      clickEvent: {
        id: 'add-quiz',
        type: 'button' as const,
        action: 'show-toast' as const,
        feedback: {
          loading: 'Ouverture de l\'éditeur de quiz...',
          success: 'Éditeur de quiz ouvert',
          error: 'Erreur lors de l\'ouverture'
        },
        payload: {
          title: 'Action rapide',
          description: 'Vous avez cliqué sur "Ajouter un quiz" !',
          variant: 'success'
        }
      } as ClickEventConfig,
      onAction: () => {
        setDashboardTab('assessments');
      }
    }
  ];

  return (
    <Card className="glass border-white/20 backdrop-blur-xl hover-lift transition-all duration-300 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl gradient-text flex items-center gap-3">
          <Target className="h-6 w-6" />
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  clickEvent={{
                    ...button.clickEvent,
                    feedback: {
                      ...button.clickEvent.feedback,
                      loading: button.clickEvent.feedback?.loading || 'Chargement...',
                      success: button.clickEvent.feedback?.success || 'Action réussie',
                      error: button.clickEvent.feedback?.error || 'Erreur d\'action'
                    },
                    payload: {
                      ...(button.clickEvent.payload || {}),
                      description: (button.clickEvent.payload?.description || '') + ` [Debug: click déclenché]`
                    }
                  }}
                  className={`w-full bg-gradient-to-r ${button.gradient} hover:opacity-90 text-white border-none shadow-md hover:shadow-lg transition-all duration-300`}
                  onClick={() => {
                    if (button.onAction) {
                      button.onAction();
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Démarrer
                </EnhancedButton>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
