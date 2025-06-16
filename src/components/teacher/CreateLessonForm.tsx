
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, X } from 'lucide-react';

interface CreateLessonFormProps {
  courseId: string;
  onClose: () => void;
}

export const CreateLessonForm = ({ courseId, onClose }: CreateLessonFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    video_url: ''
  });

  const createLesson = useMutation({
    mutationFn: async (data: { title: string; content: string; video_url: string }) => {
      // Get the next order index
      const { count } = await supabase
        .from('lessons')
        .select('id', { count: 'exact', head: true })
        .eq('course_id', courseId);

      const { data: lesson, error } = await supabase
        .from('lessons')
        .insert({
          title: data.title,
          content: data.content,
          video_url: data.video_url || null,
          course_id: courseId,
          order_index: (count || 0) + 1
        })
        .select()
        .single();

      if (error) throw error;
      return lesson;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-lessons'] });
      toast({
        title: "Leçon créée",
        description: "La leçon a été créée avec succès.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la leçon.",
        variant: "destructive",
      });
      console.error('Error creating lesson:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre de la leçon est requis.",
        variant: "destructive",
      });
      return;
    }
    createLesson.mutate(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <CardTitle>Créer une nouvelle leçon</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Ajoutez une nouvelle leçon à ce cours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la leçon *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Introduction aux composants React"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Contenu de la leçon</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Décrivez le contenu de la leçon..."
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video_url">URL de la vidéo (optionnel)</Label>
            <Input
              id="video_url"
              type="url"
              value={formData.video_url}
              onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={createLesson.isPending} className="flex-1">
              {createLesson.isPending ? 'Création...' : 'Créer la leçon'}
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
