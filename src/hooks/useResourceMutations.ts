
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useResourceMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteResourceMutation = useMutation({
    mutationFn: async (resourceId: string) => {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Ressource supprimée",
        description: "La ressource a été supprimée avec succès."
      });
      queryClient.invalidateQueries({ queryKey: ['teacher-resources'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-stats'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la ressource.",
        variant: "destructive"
      });
      console.error('Erreur suppression ressource:', error);
    }
  });

  return {
    deleteResourceMutation
  };
};
