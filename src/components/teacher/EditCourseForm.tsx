
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, X } from 'lucide-react';

interface EditCourseFormProps {
  courseId: string;
  courseData: any;
  onClose: () => void;
}

export const EditCourseForm = ({ courseId, courseData, onClose }: EditCourseFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (courseData) {
      setFormData({
        title: courseData.title || '',
        description: courseData.description || ''
      });
    }
  }, [courseData]);

  const updateCourse = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const { data: updatedCourse, error } = await supabase
        .from('courses')
        .update({
          title: data.title,
          description: data.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', courseId)
        .select()
        .single();

      if (error) throw error;
      return updatedCourse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
      toast({
        title: "Cours modifié",
        description: "Les informations du cours ont été mises à jour avec succès.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le cours.",
        variant: "destructive",
      });
      console.error('Error updating course:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre du cours est requis.",
        variant: "destructive",
      });
      return;
    }
    updateCourse.mutate(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <CardTitle>Modifier le cours</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Modifiez les informations du cours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du cours *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Introduction aux mathématiques"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez le contenu et les objectifs du cours..."
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={updateCourse.isPending} className="flex-1">
              {updateCourse.isPending ? 'Modification...' : 'Modifier le cours'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
