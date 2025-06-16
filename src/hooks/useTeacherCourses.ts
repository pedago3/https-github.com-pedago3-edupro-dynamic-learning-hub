
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useTeacherCourses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacher-courses-for-resources', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data } = await supabase
        .from('courses')
        .select('id, title')
        .eq('teacher_id', user.id);
      
      // Filter out courses with invalid IDs or empty titles
      const validCourses = (data || []).filter(course => 
        course.id && 
        course.id.trim() !== '' && 
        course.title && 
        course.title.trim() !== ''
      );

      console.log('Valid courses for resources:', validCourses);
      return validCourses;
    },
    enabled: !!user
  });
};
