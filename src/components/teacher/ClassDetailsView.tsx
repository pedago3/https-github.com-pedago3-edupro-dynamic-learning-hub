import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Users, ArrowLeft, UserPlus, Edit, Trash2, UserMinus, BookOpen, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AssignCourseToClassForm } from './AssignCourseToClassForm';
import { AddStudentToClassForm } from './AddStudentToClassForm';
import { useState } from 'react';

interface ClassDetailsViewProps {
  classId: string;
  onBack: () => void;
  onEditClass: () => void;
}

export const ClassDetailsView = ({ classId, onBack, onEditClass }: ClassDetailsViewProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAssignCourseDialog, setShowAssignCourseDialog] = useState(false);
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);

  const { data: classDetails, isLoading: classLoading } = useQuery({
    queryKey: ['class-details', classId],
    queryFn: async () => {
      const { data } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();
      return data;
    }
  });

  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['class-students', classId],
    queryFn: async () => {
      const { data } = await supabase
        .from('class_enrollments')
        .select(`
          student_id,
          enrolled_at,
          profiles!inner(full_name, email)
        `)
        .eq('class_id', classId);
      return data || [];
    }
  });

  const { data: courses } = useQuery({
    queryKey: ['class-courses', classId],
    queryFn: async () => {
      const { data } = await supabase
        .from('class_courses')
        .select(`
          course_id,
          assigned_at,
          courses!inner(title, description)
        `)
        .eq('class_id', classId);
      return data || [];
    }
  });

  const removeStudentMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const { error } = await supabase
        .from('class_enrollments')
        .delete()
        .eq('class_id', classId)
        .eq('student_id', studentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-students', classId] });
      queryClient.invalidateQueries({ queryKey: ['teacher-classes'] });
      toast({
        title: "Étudiant retiré",
        description: "L'étudiant a été retiré de la classe avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de retirer l'étudiant de la classe.",
        variant: "destructive",
      });
      console.error('Error removing student:', error);
    }
  });

  const removeCourseFromClassMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from('class_courses')
        .delete()
        .eq('class_id', classId)
        .eq('course_id', courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-courses', classId] });
      queryClient.invalidateQueries({ queryKey: ['teacher-classes'] });
      toast({
        title: "Cours retiré",
        description: "Le cours a été retiré de la classe avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de retirer le cours de la classe.",
        variant: "destructive",
      });
      console.error('Error removing course from class:', error);
    }
  });

  const handleRemoveStudent = (studentId: string) => {
    removeStudentMutation.mutate(studentId);
  };

  const handleRemoveCourseFromClass = (courseId: string) => {
    removeCourseFromClassMutation.mutate(courseId);
  };

  if (classLoading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  if (!classDetails) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Classe non trouvée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddStudentDialog(true)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Ajouter un élève
          </Button>
          <Button variant="outline" onClick={onEditClass} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {classDetails.name}
          </CardTitle>
          <CardDescription>{classDetails.description || 'Aucune description'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Informations générales</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Créée le:</span> {new Date(classDetails.created_at).toLocaleDateString()}</p>
                <p><span className="font-medium">Nombre d'élèves:</span> {students?.length || 0}</p>
                <p><span className="font-medium">Cours assignés:</span> {courses?.length || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Élèves inscrits</CardTitle>
        </CardHeader>
        <CardContent>
          {studentsLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : students?.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun élève inscrit dans cette classe</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.map((enrollment: any) => (
                  <TableRow key={enrollment.student_id}>
                    <TableCell>{enrollment.profiles?.full_name || 'Non renseigné'}</TableCell>
                    <TableCell>{enrollment.profiles?.email}</TableCell>
                    <TableCell>{new Date(enrollment.enrolled_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Retirer l'étudiant</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir retirer cet étudiant de la classe ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveStudent(enrollment.student_id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Retirer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cours assignés</CardTitle>
            <Button 
              onClick={() => setShowAssignCourseDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Assigner un cours
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((assignment: any) => (
                <Card key={assignment.course_id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{assignment.courses?.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {assignment.courses?.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Assigné le {new Date(assignment.assigned_at).toLocaleDateString()}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 ml-2">
                          <X className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Retirer le cours</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir retirer ce cours de la classe ? Les étudiants perdront l'accès à ce cours via cette classe.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveCourseFromClass(assignment.course_id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Retirer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun cours assigné à cette classe</p>
              <Button 
                onClick={() => setShowAssignCourseDialog(true)}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Assigner un cours
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAssignCourseDialog} onOpenChange={setShowAssignCourseDialog}>
        <DialogContent className="max-w-2xl">
          <AssignCourseToClassForm
            classId={classId}
            onClose={() => setShowAssignCourseDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showAddStudentDialog} onOpenChange={setShowAddStudentDialog}>
        <DialogContent className="max-w-2xl">
          <AddStudentToClassForm
            classId={classId}
            onClose={() => setShowAddStudentDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
