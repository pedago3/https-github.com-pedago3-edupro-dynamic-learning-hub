import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Lock, Calendar, Star, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const MyBadges = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: badgesData, isLoading } = useQuery({
    queryKey: ['my-badges', user?.id],
    queryFn: async () => {
      if (!user) return { earned: [], available: [] };

      console.log('Fetching badges for user:', user.id);

      // Récupérer tous les badges disponibles
      const { data: allBadges, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .order('created_at');

      if (badgesError) {
        console.error('Error fetching badges:', badgesError);
        throw badgesError;
      }

      // Récupérer les badges obtenus par l'utilisateur
      const { data: earnedBadges, error: earnedError } = await supabase
        .from('student_badges')
        .select(`
          *,
          badges (*)
        `)
        .eq('student_id', user.id)
        .order('earned_at', { ascending: false });

      if (earnedError) {
        console.error('Error fetching earned badges:', earnedError);
        throw earnedError;
      }

      const earnedBadgeIds = earnedBadges?.map(eb => eb.badge_id) || [];
      const availableBadges = allBadges?.filter(badge => !earnedBadgeIds.includes(badge.id)) || [];

      console.log('Earned badges:', earnedBadges?.length || 0);
      console.log('Available badges:', availableBadges.length);

      return {
        earned: earnedBadges || [],
        available: availableBadges
      };
    },
    enabled: !!user
  });

  const claimBadgeMutation = useMutation({
    mutationFn: async (badgeId: string) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Claiming badge:', badgeId, 'for user:', user.id);

      const { data, error } = await supabase
        .from('student_badges')
        .insert({
          student_id: user.id,
          badge_id: badgeId
        })
        .select();

      if (error) {
        console.error('Error claiming badge:', error);
        throw error;
      }

      console.log('Badge claimed successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-badges', user?.id] });
      toast({
        title: "Badge obtenu !",
        description: "Félicitations ! Vous avez obtenu un nouveau badge.",
      });
    },
    onError: (error) => {
      console.error('Badge claim mutation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'obtenir le badge pour le moment.",
        variant: "destructive",
      });
    }
  });

  const handleClaimBadge = (badgeId: string) => {
    console.log('Attempting to claim badge:', badgeId);
    claimBadgeMutation.mutate(badgeId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded-full w-16 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Award className="h-6 w-6" />
          Mes Badges
        </h2>
        <div className="text-sm text-muted-foreground">
          {badgesData?.earned.length || 0} / {(badgesData?.earned.length || 0) + (badgesData?.available.length || 0)} obtenus
        </div>
      </div>

      {/* Badges obtenus */}
      {badgesData?.earned.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Badges obtenus ({badgesData.earned.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badgesData.earned.map((studentBadge: any) => (
              <Card key={studentBadge.id} className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
                <CardHeader className="text-center pb-4">
                  <div className="text-6xl mb-2">
                    {studentBadge.badges?.icon || '🏆'}
                  </div>
                  <CardTitle className="text-lg">{studentBadge.badges?.name}</CardTitle>
                  <CardDescription className="text-center">
                    {studentBadge.badges?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center">
                    <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                      <Award className="h-3 w-3 mr-1" />
                      Obtenu
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(studentBadge.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Badges disponibles */}
      {badgesData?.available.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lock className="h-5 w-5 text-gray-500" />
            Badges à débloquer ({badgesData.available.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badgesData.available.map((badge: any) => (
              <Card key={badge.id} className="opacity-75 border-gray-200 hover:opacity-100 transition-opacity">
                <CardHeader className="text-center pb-4">
                  <div className="text-6xl mb-2 grayscale hover:grayscale-0 transition-all">
                    {badge.icon || '🏆'}
                  </div>
                  <CardTitle className="text-lg text-muted-foreground">{badge.name}</CardTitle>
                  <CardDescription className="text-center">
                    {badge.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleClaimBadge(badge.id)}
                      disabled={claimBadgeMutation.isPending}
                      className="w-full"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      {claimBadgeMutation.isPending ? 'Obtention...' : 'Obtenir badge'}
                    </Button>
                    {badge.criteria && typeof badge.criteria === 'object' && (
                      <div className="mt-3 text-xs text-muted-foreground">
                        <p className="font-medium mb-1">Critères:</p>
                        <ul className="text-left space-y-1">
                          {Object.entries(badge.criteria as Record<string, any>).map(([key, value]) => (
                            <li key={key} className="flex justify-between">
                              <span>{key}:</span>
                              <span>{String(value)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* État vide */}
      {!badgesData?.earned.length && !badgesData?.available.length && (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun badge disponible</h3>
            <p className="text-muted-foreground">
              Les badges apparaîtront ici au fur et à mesure de votre progression.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
