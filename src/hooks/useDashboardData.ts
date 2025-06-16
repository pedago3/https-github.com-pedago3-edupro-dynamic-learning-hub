
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface DashboardStats {
  totalCourses: number;
  averageProgress: number;
  todayMissions: number;
  completedMissionsToday: number;
  totalBadges: number;
  completedLessons: number;
  recentEnrollments: any[];
}

export const useDashboardData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async (): Promise<DashboardStats | null> => {
      if (!user) return null;

      // Récupérer les cours inscrits
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('*, courses(*)')
        .eq('student_id', user.id);

      // Récupérer les missions du jour
      const today = new Date().toISOString().split('T')[0];
      const { data: todayMissions } = await supabase
        .from('daily_missions')
        .select('*')
        .eq('student_id', user.id)
        .eq('due_date', today);

      // Récupérer les badges obtenus
      const { data: badges } = await supabase
        .from('student_badges')
        .select('*, badges(*)')
        .eq('student_id', user.id);

      // Récupérer les leçons terminées
      const { data: completedLessons } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('student_id', user.id)
        .eq('completed', true);

      return {
        totalCourses: enrollments?.length || 0,
        averageProgress: enrollments?.length 
          ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length 
          : 0,
        todayMissions: todayMissions?.length || 0,
        completedMissionsToday: todayMissions?.filter(m => m.completed).length || 0,
        totalBadges: badges?.length || 0,
        completedLessons: completedLessons?.length || 0,
        recentEnrollments: enrollments?.slice(0, 3) || []
      };
    },
    enabled: !!user
  });
};
