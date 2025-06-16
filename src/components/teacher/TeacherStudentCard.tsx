
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit2, Trash2, Eye, Mail, Calendar } from 'lucide-react';
import { EditStudentDialog } from './EditStudentDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TeacherStudentCardProps {
  student: any;
  onStudentUpdated: () => void;
}

export const TeacherStudentCard = ({ student, onStudentUpdated }: TeacherStudentCardProps) => {
  const { toast } = useToast();
  const [editing, setEditing] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (studentToDelete: any) => {
    if (!window.confirm("Supprimer cet élève ? Cette action est irréversible.")) return;
    setIsDeleting(true);
    const { error } = await supabase.from("profiles").delete().eq("id", studentToDelete.id);
    setIsDeleting(false);
    if (error) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'élève.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Élève supprimé",
        description: "L'élève a été supprimé avec succès.",
      });
      onStudentUpdated();
    }
  };

  const handleEdit = (studentToEdit: any) => {
    setEditing(studentToEdit);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setTimeout(() => setEditing(null), 200);
  };

  const handleEditSuccess = () => {
    onStudentUpdated();
    handleEditClose();
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow glass border-white/20 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={student.avatar_url} />
                <AvatarFallback>
                  {student.full_name?.charAt(0) || 'É'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  {student.full_name || 'Nom non renseigné'}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {student.email ? student.email : <span className="italic text-muted-foreground">Email non renseigné</span>}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  Pseudo: {student.username ? student.username : <span className="italic text-muted-foreground">Pseudo non renseigné</span>}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Inscrit le {new Date(student.enrolledAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right space-y-2">
              <div className="flex flex-wrap gap-1 justify-end">
                {student.courses?.slice(0, 2).map((course: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {course}
                  </Badge>
                ))}
                {student.courses?.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{student.courses.length - 2}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-sm text-muted-foreground">
                  Progrès : {Math.round(student.progress)}%
                </span>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Voir profil
                </Button>
              </div>
              <div className="flex items-center justify-end gap-1 pt-2">
                <Button
                  size="icon"
                  variant="ghost"
                  title="Modifier"
                  onClick={() => handleEdit(student)}
                >
                  <Edit2 className="h-4 w-4 text-blue-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  title="Supprimer"
                  onClick={() => handleDelete(student)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 text-rose-600" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {editing && (
        <EditStudentDialog
          student={editing}
          open={editOpen}
          onClose={handleEditClose}
          onEdited={handleEditSuccess}
        />
      )}
    </>
  );
};
