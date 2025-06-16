
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BookOpen, Save, Plus } from 'lucide-react';

export const CreateCourse = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const [lessons, setLessons] = useState([
    { title: '', content: '', video_url: '' }
  ]);

  const createCourseMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user) throw new Error('Utilisateur non connecté');

      // Créer le cours
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: data.title,
          description: data.description,
          teacher_id: user.id
        })
        .select()
        .single();

      if (courseError) throw courseError;

      // Créer les leçons
      if (data.lessons && data.lessons.length > 0) {
        const lessonsToInsert = data.lessons
          .filter((lesson: any) => lesson.title.trim())
          .map((lesson: any, index: number) => ({
            title: lesson.title,
            content: lesson.content,
            video_url: lesson.video_url || null,
            course_id: course.id,
            order_index: index + 1
          }));

        if (lessonsToInsert.length > 0) {
          const { error: lessonsError } = await supabase
            .from('lessons')
            .insert(lessonsToInsert);

          if (lessonsError) throw lessonsError;
        }
      }

      return course;
    },
    onSuccess: () => {
      toast({
        title: "Cours créé avec succès",
        description: "Votre cours a été créé et est maintenant disponible."
      });
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-stats'] });
      
      // Réinitialiser le formulaire
      setFormData({ title: '', description: '' });
      setLessons([{ title: '', content: '', video_url: '' }]);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le cours. Veuillez réessayer.",
        variant: "destructive"
      });
      console.error('Erreur création cours:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre du cours est requis.",
        variant: "destructive"
      });
      return;
    }

    createCourseMutation.mutate({
      ...formData,
      lessons: lessons.filter(lesson => lesson.title.trim())
    });
  };

  const addLesson = () => {
    setLessons([...lessons, { title: '', content: '', video_url: '' }]);
  };

  const updateLesson = (index: number, field: string, value: string) => {
    const updatedLessons = [...lessons];
    updatedLessons[index] = { ...updatedLessons[index], [field]: value };
    setLessons(updatedLessons);
  };

  const removeLesson = (index: number) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Créer un nouveau cours</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Titre du cours *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Entrez le titre du cours..."
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez votre cours..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Leçons du cours
              <Button type="button" onClick={addLesson} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter une leçon
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lessons.map((lesson, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Leçon {index + 1}</h4>
                  {lessons.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeLesson(index)}
                      variant="destructive"
                      size="sm"
                    >
                      Supprimer
                    </Button>
                  )}
                </div>

                <div>
                  <Label htmlFor={`lesson-title-${index}`}>Titre de la leçon</Label>
                  <Input
                    id={`lesson-title-${index}`}
                    value={lesson.title}
                    onChange={(e) => updateLesson(index, 'title', e.target.value)}
                    placeholder="Titre de la leçon..."
                  />
                </div>

                <div>
                  <Label htmlFor={`lesson-content-${index}`}>Contenu</Label>
                  <Textarea
                    id={`lesson-content-${index}`}
                    value={lesson.content}
                    onChange={(e) => updateLesson(index, 'content', e.target.value)}
                    placeholder="Contenu de la leçon..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor={`lesson-video-${index}`}>URL de la vidéo (optionnel)</Label>
                  <Input
                    id={`lesson-video-${index}`}
                    value={lesson.video_url}
                    onChange={(e) => updateLesson(index, 'video_url', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    type="url"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={createCourseMutation.isPending}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {createCourseMutation.isPending ? 'Création...' : 'Créer le cours'}
          </Button>
        </div>
      </form>
    </div>
  );
};
