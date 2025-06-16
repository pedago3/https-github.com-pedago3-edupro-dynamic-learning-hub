
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  FileText, 
  Calendar,
  UserPlus,
  FolderOpen,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Activity {
  id: string;
  type: 'course' | 'class' | 'student' | 'assessment' | 'resource' | 'event';
  title: string;
  description: string;
  timestamp: string;
  icon: any;
  color: string;
}

export const RecentActivity = () => {
  const { user } = useAuth();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['teacher-recent-activity', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const activities: Activity[] = [];

      // Récupérer les cours récents (derniers 30 jours)
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title, created_at')
        .eq('teacher_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      courses?.forEach(course => {
        activities.push({
          id: `course-${course.id}`,
          type: 'course',
          title: 'Nouveau cours créé',
          description: course.title,
          timestamp: course.created_at,
          icon: BookOpen,
          color: 'text-blue-500'
        });
      });

      // Récupérer les classes récentes
      const { data: classes } = await supabase
        .from('classes')
        .select('id, name, created_at')
        .eq('teacher_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      classes?.forEach(classItem => {
        activities.push({
          id: `class-${classItem.id}`,
          type: 'class',
          title: 'Nouvelle classe créée',
          description: classItem.name,
          timestamp: classItem.created_at,
          icon: Users,
          color: 'text-emerald-500'
        });
      });

      // Récupérer les inscriptions récentes d'étudiants
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select(`
          enrolled_at,
          profiles (full_name),
          courses!inner (title, teacher_id)
        `)
        .eq('courses.teacher_id', user.id)
        .gte('enrolled_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('enrolled_at', { ascending: false })
        .limit(5);

      enrollments?.forEach(enrollment => {
        activities.push({
          id: `enrollment-${enrollment.enrolled_at}`,
          type: 'student',
          title: 'Nouvel étudiant inscrit',
          description: `${enrollment.profiles?.full_name || 'Étudiant'} s'est inscrit à ${enrollment.courses?.title}`,
          timestamp: enrollment.enrolled_at,
          icon: GraduationCap,
          color: 'text-purple-500'
        });
      });

      // Récupérer les évaluations récentes
      const { data: assessments } = await supabase
        .from('assessments')
        .select(`
          id, title, created_at,
          courses!inner (title, teacher_id)
        `)
        .eq('courses.teacher_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      assessments?.forEach(assessment => {
        activities.push({
          id: `assessment-${assessment.id}`,
          type: 'assessment',
          title: 'Nouvelle évaluation créée',
          description: `${assessment.title} pour ${assessment.courses?.title}`,
          timestamp: assessment.created_at,
          icon: FileText,
          color: 'text-orange-500'
        });
      });

      // Récupérer les ressources récentes
      const { data: resources } = await supabase
        .from('resources')
        .select('id, title, created_at')
        .eq('teacher_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      resources?.forEach(resource => {
        activities.push({
          id: `resource-${resource.id}`,
          type: 'resource',
          title: 'Nouvelle ressource ajoutée',
          description: resource.title,
          timestamp: resource.created_at,
          icon: FolderOpen,
          color: 'text-pink-500'
        });
      });

      // Récupérer les événements récents
      const { data: events } = await supabase
        .from('calendar_events')
        .select('id, title, created_at, start_date')
        .eq('teacher_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      events?.forEach(event => {
        activities.push({
          id: `event-${event.id}`,
          type: 'event',
          title: 'Nouvel événement planifié',
          description: `${event.title} - ${new Date(event.start_date).toLocaleDateString()}`,
          timestamp: event.created_at,
          icon: Calendar,
          color: 'text-indigo-500'
        });
      });

      // Trier toutes les activités par date décroissante
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10); // Garder seulement les 10 plus récentes
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 glass rounded-xl border border-white/20 animate-pulse">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4"></div>
              <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="relative">
          <Clock className="h-16 w-16 mx-auto mb-6 text-slate-300 animate-float" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-ping"></div>
        </div>
        <h3 className="text-lg font-semibold mb-3 text-slate-700">Aucune activité récente</h3>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
          Commencez par créer du contenu pour voir vos activités apparaître ici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {activities.map((activity, index) => (
        <div 
          key={activity.id}
          className={`flex items-center space-x-4 p-4 glass rounded-xl border border-white/20 backdrop-blur-sm hover-lift transition-all duration-300 animate-fade-in`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={`p-2 bg-gradient-to-r from-white/20 to-white/30 rounded-lg`}>
            <activity.icon className={`h-5 w-5 ${activity.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-800 truncate">
                {activity.title}
              </h4>
              <span className="text-xs text-slate-500 ml-2 whitespace-nowrap">
                {formatDistanceToNow(new Date(activity.timestamp), { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </span>
            </div>
            <p className="text-sm text-slate-600 truncate mt-1">
              {activity.description}
            </p>
          </div>
          <Badge 
            variant="secondary" 
            className="capitalize shrink-0"
          >
            {activity.type === 'course' ? 'Cours' : 
             activity.type === 'class' ? 'Classe' :
             activity.type === 'student' ? 'Étudiant' :
             activity.type === 'assessment' ? 'Évaluation' :
             activity.type === 'resource' ? 'Ressource' :
             activity.type === 'event' ? 'Événement' : activity.type}
          </Badge>
        </div>
      ))}
    </div>
  );
};
