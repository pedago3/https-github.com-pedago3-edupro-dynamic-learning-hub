
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Calendar } from 'lucide-react';

interface EnrolledCoursesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnrolledCoursesDialog = ({ open, onOpenChange }: EnrolledCoursesDialogProps) => {
  const { user } = useAuth();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['enrolled-courses-dialog', user?.id],
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
    enabled: !!user && open
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Mes cours inscrits
          </DialogTitle>
          <DialogDescription>
            Voici la liste de tous vos cours auxquels vous êtes inscrit
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : enrollments?.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Vous n'êtes inscrit à aucun cours pour le moment.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {enrollments?.map((enrollment: any) => (
              <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {enrollment.courses.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Par {enrollment.courses.profiles?.full_name || 'Professeur'}
                      </p>
                      {enrollment.courses.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {enrollment.courses.description}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      {Math.round(enrollment.progress)}% complété
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {enrollment.courses.lessons?.[0]?.count || 0} leçons
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Inscrit le {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(enrollment.progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
