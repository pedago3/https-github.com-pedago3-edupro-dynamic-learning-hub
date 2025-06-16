
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, X, Search, Loader2, Mail, User } from 'lucide-react';

interface AddStudentToClassFormProps {
  classId: string;
  onClose: () => void;
}

function isEmail(str: string) {
  // Very basic email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
}

export const AddStudentToClassForm = ({ classId, onClose }: AddStudentToClassFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const { data: existingStudents } = useQuery({
    queryKey: ['class-students', classId],
    queryFn: async () => {
      const { data } = await supabase
        .from('class_enrollments')
        .select('student_id')
        .eq('class_id', classId);
      return data?.map(enrollment => enrollment.student_id) || [];
    }
  });

  // Mutation qui recherche soit par email soit par pseudo
  const searchStudent = useMutation({
    mutationFn: async (value: string) => {
      let data;
      let error;

      if (isEmail(value)) {
        // Recherche par email
        const res = await supabase
          .from('profiles')
          .select('id, full_name, username, email')
          .ilike('email', value.trim().toLowerCase())
          .eq('role', 'student')
          .single();

        data = res.data;
        error = res.error;
      } else {
        // Recherche par pseudo
        const res = await supabase
          .from('profiles')
          .select('id, full_name, username, email')
          .ilike('username', value.trim().toLowerCase())
          .eq('role', 'student')
          .single();

        data = res.data;
        error = res.error;
      }

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (existingStudents?.includes(data.id)) {
        toast({
          title: "Élève déjà inscrit",
          description: "Cet élève est déjà inscrit dans cette classe.",
          variant: "destructive",
        });
        setSelectedStudent(null);
      } else {
        setSelectedStudent(data);
        toast({
          title: "Élève trouvé",
          description: "L’élève a été trouvé et peut être ajouté à la classe.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Élève non trouvé",
        description: "Aucun élève trouvé avec cet email ou pseudo.",
        variant: "destructive",
      });
      setSelectedStudent(null);
    }
  });

  const addStudent = useMutation({
    mutationFn: async (studentId: string) => {
      const { error } = await supabase
        .from('class_enrollments')
        .insert({
          class_id: classId,
          student_id: studentId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-students', classId] });
      queryClient.invalidateQueries({ queryKey: ['teacher-classes'] });
      toast({
        title: "Élève ajouté",
        description: "L’élève a été ajouté à la classe avec succès.",
      });
      setSearchValue('');
      setSelectedStudent(null);
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d’ajouter l’élève à la classe.",
        variant: "destructive",
      });
      console.error('Error adding student:', error);
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) {
      toast({
        title: "Saisie requise",
        description: "Veuillez saisir un email ou un pseudo.",
        variant: "destructive",
      });
      return;
    }
    searchStudent.mutate(searchValue.trim());
  };

  const handleAddStudent = () => {
    if (selectedStudent) {
      addStudent.mutate(selectedStudent.id);
    }
  };

  const handleClose = () => {
    setSearchValue('');
    setSelectedStudent(null);
    onClose();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            <CardTitle>Ajouter un élève</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Recherchez un élève par son <span className="font-semibold">email</span>{' '}
          <Mail className="inline h-4 w-4 mb-1 mx-1" /> ou <span className="font-semibold">pseudo</span>{' '}
          <User className="inline h-4 w-4 mb-1 mx-1" /> pour l’ajouter à la classe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search-student">
              Email ou pseudo de l’élève
            </Label>
            <div className="flex gap-2">
              <Input
                id="search-student"
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="email@exemple.com ou pseudo_élève"
                required
                className="flex-1"
                autoFocus
              />
              <Button 
                type="submit" 
                disabled={searchStudent.isPending}
                size="default"
              >
                {searchStudent.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </form>

        {selectedStudent && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{selectedStudent.full_name || 'Nom non renseigné'}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedStudent.email ? (
                    <>Email: {selectedStudent.email}</>
                  ) : (
                    <span className="italic text-muted-foreground">Email non renseigné</span>
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedStudent.username ? `Pseudo: ${selectedStudent.username}` : <span className="italic text-muted-foreground">Pseudo non renseigné</span>}
                </p>
              </div>
              <Button 
                onClick={handleAddStudent} 
                disabled={addStudent.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {addStudent.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Ajout...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
