
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useMyProgressData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-progress', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Récupérer les cours avec progression
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            id,
            title,
            lessons (id)
          )
        `)
        .eq('student_id', user.id);

      // Récupérer les leçons terminées
      const { data: completedLessons } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('student_id', user.id)
        .eq('completed', true);

      // Récupérer les missions terminées cette semaine
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { data: weeklyMissions } = await supabase
        .from('daily_missions')
        .select('*')
        .eq('student_id', user.id)
        .gte('due_date', oneWeekAgo.toISOString().split('T')[0]);

      // Récupérer les badges obtenus
      const { data: badges } = await supabase
        .from('student_badges')
        .select(`
          *,
          badges (name, description, icon)
        `)
        .eq('student_id', user.id)
        .order('earned_at', { ascending: false });

      // Calculer les statistiques
      const totalLessons = enrollments?.reduce((sum, e) => sum + (e.courses?.lessons?.length || 0), 0) || 0;
      const completedLessonsCount = completedLessons?.length || 0;
      const overallProgress = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;
      
      const completedMissionsThisWeek = weeklyMissions?.filter(m => m.completed).length || 0;
      const totalMissionsThisWeek = weeklyMissions?.length || 0;

      const detailedEnrollments = (enrollments || []).map((enrollment: any) => {
        const courseLessons = enrollment.courses?.lessons || [];
        const totalCourseLessons = courseLessons.length;
        const courseCompletedLessonsCount = (completedLessons || []).filter(
          (cl: any) => courseLessons.some((l: any) => l.id === cl.lesson_id)
        ).length;

        return {
          ...enrollment,
          courseCompletedLessonsCount,
          totalCourseLessons,
          progress: enrollment.progress || 0
        };
      });

      return {
        enrollments: detailedEnrollments,
        overallProgress,
        completedLessonsCount,
        totalLessons,
        completedMissionsThisWeek,
        totalMissionsThisWeek,
        badges: badges || [],
        weeklyProgress: totalMissionsThisWeek > 0 ? (completedMissionsThisWeek / totalMissionsThisWeek) * 100 : 0
      };
    },
    enabled: !!user
  });
};
