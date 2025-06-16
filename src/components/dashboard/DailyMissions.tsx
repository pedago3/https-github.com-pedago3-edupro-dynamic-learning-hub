
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Target, Calendar, Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DailyMissions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: missions, isLoading } = useQuery({
    queryKey: ['daily-missions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('daily_missions')
        .select('*')
        .eq('student_id', user.id)
        .gte('due_date', today)
        .order('due_date');

      return data || [];
    },
    enabled: !!user
  });

  const completeMission = useMutation({
    mutationFn: async (missionId: string) => {
      const { error } = await supabase
        .from('daily_missions')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', missionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-missions'] });
      toast({
        title: "Mission terminée !",
        description: "Félicitations ! Vous avez terminé votre mission.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la completion de la mission.",
        variant: "destructive",
      });
    }
  });

  const uncompleteMission = useMutation({
    mutationFn: async (missionId: string) => {
      const { error } = await supabase
        .from('daily_missions')
        .update({
          completed: false,
          completed_at: null
        })
        .eq('id', missionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-missions'] });
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
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

  const today = new Date().toISOString().split('T')[0];
  const todayMissions = missions?.filter(m => m.due_date === today) || [];
  const upcomingMissions = missions?.filter(m => m.due_date > today) || [];
  const completedToday = todayMissions.filter(m => m.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-6 w-6" />
          Missions Quotidiennes
        </h2>
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="text-sm font-medium">
            Série: {completedToday} jour{completedToday > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {todayMissions.length > 0 && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Aujourd'hui
            </CardTitle>
            <CardDescription>
              {completedToday} / {todayMissions.length} missions terminées
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayMissions.map((mission: any) => (
              <div
                key={mission.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  mission.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (mission.completed) {
                        uncompleteMission.mutate(mission.id);
                      } else {
                        completeMission.mutate(mission.id);
                      }
                    }}
                    disabled={completeMission.isPending || uncompleteMission.isPending}
                    className="p-1"
                  >
                    {mission.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                  <div>
                    <h4 className={`font-medium ${mission.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {mission.title}
                    </h4>
                    {mission.description && (
                      <p className="text-sm text-muted-foreground">
                        {mission.description}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={mission.completed ? "default" : "secondary"}>
                  {mission.completed ? "Terminé" : "En cours"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {upcomingMissions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Missions à venir</h3>
          <div className="space-y-3">
            {upcomingMissions.map((mission: any) => (
              <Card key={mission.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Circle className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{mission.title}</h4>
                        {mission.description && (
                          <p className="text-sm text-muted-foreground">
                            {mission.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">
                        {new Date(mission.due_date).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!missions?.length && (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune mission disponible</h3>
            <p className="text-muted-foreground">
              Les missions quotidiennes apparaîtront ici pour vous aider à rester motivé.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
