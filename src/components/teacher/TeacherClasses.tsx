import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, Eye, Edit, Trash2, Plus, UserPlus } from 'lucide-react';
import { ClassDetailsView } from './ClassDetailsView';
import { EditClassForm } from './EditClassForm';
import { AddStudentToClassForm } from './AddStudentToClassForm';
import { useToast } from '@/hooks/use-toast';

interface TeacherClassesProps {
  onCreateClass: () => void;
}

export const TeacherClasses = ({ onCreateClass }: TeacherClassesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [classToEdit, setClassToEdit] = useState<any>(null);

  const { data: classes, isLoading } = useQuery({
    queryKey: ['teacher-classes', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data } = await supabase
        .from('classes')
        .select(`
          *,
          class_enrollments (count)
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      return data || [];
    },
    enabled: !!user
  });

  const deleteClassMutation = useMutation({
    mutationFn: async (classId: string) => {
      // D'abord supprimer les inscriptions
      const { error: enrollmentError } = await supabase
        .from('class_enrollments')
        .delete()
        .eq('class_id', classId);

      if (enrollmentError) throw enrollmentError;

      // Puis supprimer les cours assignés
      const { error: courseError } = await supabase
        .from('class_courses')
        .delete()
        .eq('class_id', classId);

      if (courseError) throw courseError;

      // Enfin supprimer la classe
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-classes'] });
      toast({
        title: "Classe supprimée",
        description: "La classe a été supprimée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la classe.",
        variant: "destructive",
      });
      console.error('Error deleting class:', error);
    }
  });

  const handleViewClass = (classId: string) => {
    setSelectedClassId(classId);
    setViewMode('details');
  };

  const handleEditClass = (classItem: any) => {
    setClassToEdit(classItem);
    setShowEditDialog(true);
  };

  const handleAddStudent = (classId: string) => {
    setSelectedClassId(classId);
    setShowAddStudentDialog(true);
  };

  const handleDeleteClass = (classId: string) => {
    deleteClassMutation.mutate(classId);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedClassId(null);
  };

  if (viewMode === 'details' && selectedClassId) {
    return (
      <ClassDetailsView
        classId={selectedClassId}
        onBack={handleBackToList}
        onEditClass={() => {
          const classItem = classes?.find(c => c.id === selectedClassId);
          if (classItem) handleEditClass(classItem);
        }}
      />
    );
  }

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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mes Classes</h2>
        <Button onClick={onCreateClass} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle classe
        </Button>
      </div>

      {classes?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune classe créée</h3>
            <p className="text-muted-foreground mb-4">
              Créez votre première classe pour organiser vos étudiants.
            </p>
            <Button onClick={onCreateClass}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une classe
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes?.map((classItem: any) => (
            <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="line-clamp-2">{classItem.name}</span>
                  <Badge variant="secondary">
                    {classItem.class_enrollments?.[0]?.count || 0} étudiants
                  </Badge>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {classItem.description || 'Aucune description disponible'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Classe active
                  </span>
                  <span>
                    Créée le {new Date(classItem.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewClass(classItem.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAddStudent(classItem.id)}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditClass(classItem)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer la classe</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer cette classe ? Cette action supprimera également tous les étudiants inscrits et les cours assignés. Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteClass(classItem.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          {classToEdit && (
            <EditClassForm
              classId={classToEdit.id}
              classData={classToEdit}
              onClose={() => {
                setShowEditDialog(false);
                setClassToEdit(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAddStudentDialog} onOpenChange={setShowAddStudentDialog}>
        <DialogContent className="max-w-2xl">
          {selectedClassId && (
            <AddStudentToClassForm
              classId={selectedClassId}
              onClose={() => {
                setShowAddStudentDialog(false);
                setSelectedClassId(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
