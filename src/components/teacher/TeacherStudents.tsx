
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus } from 'lucide-react';
import { CreateStudentForm } from './CreateStudentForm';
import { TeacherStudentsHeader } from './TeacherStudentsHeader';
import { TeacherStudentsLoading } from './TeacherStudentsLoading';
import { TeacherStudentsError } from './TeacherStudentsError';
import { TeacherStudentsList } from './TeacherStudentsList';

export const TeacherStudents = () => {
  const { user } = useAuth();

  const { data: students, isLoading, error, refetch } = useQuery({
    queryKey: ['teacher-students', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Maintenant on inclut la colonne email
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            email,
            avatar_url
          ),
          courses (
            title,
            teacher_id
          )
        `)
        .eq('courses.teacher_id', user.id);

      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Grouper les étudiants par ID pour éviter les doublons
      const studentsMap = new Map();
      data.forEach((enrollment: any) => {
        const student = enrollment.profiles;
        const course = enrollment.courses;
        
        if (student && course) {
          if (!studentsMap.has(student.id)) {
            studentsMap.set(student.id, {
              ...student,
              courses: [course.title],
              enrolledAt: enrollment.enrolled_at,
              progress: enrollment.progress || 0
            });
          } else {
            const existingStudent = studentsMap.get(student.id);
            if (!existingStudent.courses.includes(course.title)) {
              existingStudent.courses.push(course.title);
            }
          }
        }
      });

      const result = Array.from(studentsMap.values());
      return result;
    },
    enabled: !!user
  });

  const handleStudentUpdated = () => {
    // Refresh the data after student update/delete
    if (typeof window !== "undefined" && window.location) {
      window.location.reload();
    }
  };

  if (isLoading) {
    return <TeacherStudentsLoading />;
  }

  if (error) {
    return <TeacherStudentsError />;
  }

  return (
    <div className="space-y-6">
      <TeacherStudentsHeader studentCount={students?.length || 0} />

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 glass border-white/30 backdrop-blur-xl">
          <TabsTrigger 
            value="list" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
          >
            <Users className="h-4 w-4" />
            Liste des élèves
          </TabsTrigger>
          <TabsTrigger 
            value="create" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
          >
            <UserPlus className="h-4 w-4" />
            Créer un élève
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <TeacherStudentsList 
            students={students || []} 
            onStudentUpdated={handleStudentUpdated}
          />
        </TabsContent>

        <TabsContent value="create">
          <CreateStudentForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};
