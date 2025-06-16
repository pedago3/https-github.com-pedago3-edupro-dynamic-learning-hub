
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, X, Loader2 } from 'lucide-react';

interface AssignCourseToClassFormProps {
  classId: string;
  onClose: () => void;
}

export const AssignCourseToClassForm = ({ classId, onClose }: AssignCourseToClassFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  // Récupérer les cours de l'enseignant
  const { data: teacherCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ['teacher-courses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('courses')
        .select('id, title, description')
        .eq('teacher_id', user.id)
        .order('title');
      
      // Filter out any courses with invalid IDs or titles and ensure non-empty values
      const validCourses = (data || []).filter(course => 
        course.id && 
        course.id.trim() !== '' && 
        course.title && 
        course.title.trim() !== ''
      );

      console.log('Valid courses after filtering:', validCourses.map(c => ({ id: c.id, title: c.title })));
      return validCourses;
    },
    enabled: !!user
  });

  // Récupérer les cours déjà assignés à cette classe
  const { data: assignedCourses } = useQuery({
    queryKey: ['class-courses', classId],
    queryFn: async () => {
      const { data } = await supabase
        .from('class_courses')
        .select('course_id')
        .eq('class_id', classId);
      return data?.map(item => item.course_id) || [];
    }
  });

  const assignCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      // Extract the real course ID if it's a generated safe value
      let realCourseId = courseId;
      
      // If it's a generated safe value, find the original course
      if (courseId.startsWith('course-') && courseId.includes('-')) {
        const courseTitle = courseId.split('-')[1];
        const originalCourse = teacherCourses?.find(course => 
          course.title?.toLowerCase().replace(/[^a-z0-9]/g, '') === courseTitle?.toLowerCase()
        );
        if (originalCourse?.id) {
          realCourseId = originalCourse.id;
        }
      }

      console.log('Assigning course with ID:', realCourseId);

      const { error } = await supabase
        .from('class_courses')
        .insert({
          class_id: classId,
          course_id: realCourseId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-courses', classId] });
      queryClient.invalidateQueries({ queryKey: ['teacher-classes'] });
      toast({
        title: "Cours assigné",
        description: "Le cours a été assigné à la classe avec succès.",
      });
      setSelectedCourseId('');
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'assigner le cours à la classe.",
        variant: "destructive",
      });
      console.error('Error assigning course:', error);
    }
  });

  const handleAssignCourse = () => {
    if (selectedCourseId) {
      assignCourseMutation.mutate(selectedCourseId);
    }
  };

  // Filtrer les cours non encore assignés
  const availableCourses = teacherCourses?.filter(
    course => !assignedCourses?.includes(course.id)
  ) || [];

  // Generate a guaranteed non-empty, unique value for SelectItem
  const generateSelectValue = (course: any, index: number) => {
    // Always prefer the course ID if it exists and is valid
    if (course.id && course.id.trim() !== '') {
      return course.id;
    }
    
    // Create a safe fallback that's guaranteed to be unique and non-empty
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substr(2, 9);
    const fallbackValue = `course-fallback-${index}-${timestamp}-${randomPart}`;
    
    console.log(`Generated fallback value for course "${course.title}": "${fallbackValue}"`);
    return fallbackValue;
  };

  console.log('Available courses:', availableCourses.length);
  console.log('Selected course ID:', selectedCourseId);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <CardTitle>Assigner un cours</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Sélectionnez un cours à assigner à cette classe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {coursesLoading ? (
          <div className="text-center py-4">
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">Chargement des cours...</p>
          </div>
        ) : availableCourses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun cours disponible</h3>
            <p className="text-muted-foreground">
              Tous vos cours sont déjà assignés à cette classe ou vous n'avez pas encore créé de cours.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course-select">Cours disponibles</Label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger id="course-select">
                  <SelectValue placeholder="Sélectionnez un cours" />
                </SelectTrigger>
                <SelectContent>
                  {availableCourses
                    .filter(course => course && course.title) // Extra safety filter
                    .map((course, index) => {
                      const selectValue = generateSelectValue(course, index);
                      
                      // Absolute final check - if somehow we still get an empty value, skip this item
                      if (!selectValue || selectValue.trim() === '') {
                        console.error(`CRITICAL: Empty value detected for course at index ${index}:`, course);
                        return null;
                      }
                      
                      console.log(`Course "${course.title}" (index: ${index}) mapped to value: "${selectValue}"`);
                      
                      return (
                        <SelectItem 
                          key={`course-item-${index}-${selectValue}`} 
                          value={selectValue}
                        >
                          <div>
                            <div className="font-medium">{course.title}</div>
                            {course.description && (
                              <div className="text-sm text-muted-foreground">
                                {course.description.substring(0, 60)}
                                {course.description.length > 60 ? '...' : ''}
                              </div>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })
                    .filter(Boolean) // Remove any null items
                  }
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                onClick={handleAssignCourse} 
                disabled={!selectedCourseId || assignCourseMutation.isPending}
              >
                {assignCourseMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Assignation...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Assigner le cours
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
