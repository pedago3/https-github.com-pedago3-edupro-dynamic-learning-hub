
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { StudentCoursesHeader } from './StudentCoursesHeader';
import { StudentEnrolledCoursesEmpty } from './StudentEnrolledCoursesEmpty';
import { StudentCourseCard } from './StudentCourseCard';
import { Card, CardContent } from '@/components/ui/card';

export const StudentCourses = () => {
  const { user } = useAuth();
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['student-courses', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            *,
            lessons (count),
            profiles!courses_teacher_id_fkey (full_name)
          )
        `)
        .eq('student_id', user.id)
        .order('enrolled_at', { ascending: false });

      return data || [];
    },
    enabled: !!user
  });

  const toggleCourseExpansion = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudentCoursesHeader />

      {enrollments?.length === 0 ? (
        <StudentEnrolledCoursesEmpty />
      ) : (
        <div className="space-y-6">
          {enrollments?.map((enrollment: any) => (
            <StudentCourseCard
              key={enrollment.id}
              enrollment={enrollment}
              isExpanded={expandedCourse === enrollment.courses.id}
              onToggleExpand={toggleCourseExpansion}
            />
          ))}
        </div>
      )}
    </div>
  );
};
