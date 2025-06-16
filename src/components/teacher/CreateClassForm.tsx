
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users, X } from 'lucide-react';

interface CreateClassFormProps {
  onClose: () => void;
}

export const CreateClassForm = ({ onClose }: CreateClassFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const createClass = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      if (!user) throw new Error('No user');

      const { data: classData, error } = await supabase
        .from('classes')
        .insert({
          name: data.name,
          description: data.description,
          teacher_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return classData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-classes'] });
      toast({
        title: "Classe créée",
        description: "La classe a été créée avec succès.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la classe.",
        variant: "destructive",
      });
      console.error('Error creating class:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la classe est requis.",
        variant: "destructive",
      });
      return;
    }
    createClass.mutate(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Créer une nouvelle classe</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Créez une nouvelle classe pour organiser vos étudiants
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la classe *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: 5ème A, Terminale S1..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez la classe..."
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={createClass.isPending} className="flex-1">
              {createClass.isPending ? 'Création...' : 'Créer la classe'}
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
