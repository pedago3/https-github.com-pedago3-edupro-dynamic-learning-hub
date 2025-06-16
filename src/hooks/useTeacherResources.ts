
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useTeacherResources = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacher-resources', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data } = await supabase
        .from('resources')
        .select(`
          *,
          courses (title)
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      return data || [];
    },
    enabled: !!user
  });
};
