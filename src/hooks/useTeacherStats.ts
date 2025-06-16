
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface TeacherStats {
  coursesCount: number;
  classesCount: number;
  studentsCount: number;
  assessmentsCount: number;
  resourcesCount: number;
  eventsCount: number;
}

export const useTeacherStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacher-stats', user?.id],
    queryFn: async (): Promise<TeacherStats | null> => {
      if (!user) return null;

      // Récupérer le nombre de cours
      const { data: courses } = await supabase
        .from('courses')
        .select('id')
        .eq('teacher_id', user.id);

      // Récupérer le nombre de classes
      const { data: classes } = await supabase
        .from('classes')
        .select('id')
        .eq('teacher_id', user.id);

      // Récupérer le nombre d'étudiants inscrits aux cours
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('student_id, courses!inner(*)')
        .eq('courses.teacher_id', user.id);

      // Récupérer le nombre d'évaluations
      const { data: assessments } = await supabase
        .from('assessments')
        .select('id, courses!inner(*)')
        .eq('courses.teacher_id', user.id);

      // Récupérer le nombre de ressources
      const { data: resources } = await supabase
        .from('resources')
        .select('id')
        .eq('teacher_id', user.id);

      // Récupérer les événements du calendrier
      const { data: events } = await supabase
        .from('calendar_events')
        .select('id')
        .eq('teacher_id', user.id);

      const uniqueStudents = new Set(enrollments?.map(e => e.student_id) || []).size;

      return {
        coursesCount: courses?.length || 0,
        classesCount: classes?.length || 0,
        studentsCount: uniqueStudents,
        assessmentsCount: assessments?.length || 0,
        resourcesCount: resources?.length || 0,
        eventsCount: events?.length || 0
      };
    },
    enabled: !!user
  });
};
