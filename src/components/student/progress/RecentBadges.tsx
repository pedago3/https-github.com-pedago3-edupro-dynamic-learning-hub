
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface Badge {
  id: string;
  earned_at: string;
  badges: {
    name: string;
    icon?: string;
  };
}

interface RecentBadgesProps {
  badges: Badge[];
}

/**
 * Renvoie un nombre de coupes (🏆) basé sur la progression approx.
 * Options :
 * - Si moins de 3 badges: 1 coupe
 * - Si 3 à 4 badges: 2 coupes
 * - Si 5 badges ou plus: 3 coupes
 * (la logique peut être ajustée selon les retours utilisateur)
 */
function getTrophyCount(index: number, total: number): number {
  // Donne 1 coupe aux plus récents, jusqu'à 3 aux plus "anciens"
  if (total < 3) return 1;
  if (index === 0) return 1;
  if (index === 1) return 2;
  return 3;
}

export const RecentBadges = ({ badges }: RecentBadgesProps) => {
  if (!badges || badges.length === 0) {
    return null;
  }

  const total = badges.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Badges récents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {badges.slice(0, 6).map((studentBadge, idx) => {
            const trophyCount = getTrophyCount(idx, total);
            return (
              <div 
                key={studentBadge.id} 
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg"
              >
                <div className="flex flex-col items-center text-2xl min-w-[58px]">
                  <div>
                    {[...Array(trophyCount)].map((_, i) => (
                      <span key={i} aria-label="Trophée" role="img" className="mr-1">{'🏆'}</span>
                    ))}
                  </div>
                  <div className="text-[1.6rem] mt-1">{studentBadge.badges?.icon && studentBadge.badges.icon !== '🏆' ? studentBadge.badges.icon : ''}</div>
                </div>
                <div>
                  <h4 className="font-medium text-sm">{studentBadge.badges?.name}</h4>
                  <p className="text-xs text-gray-500">
                    {new Date(studentBadge.earned_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
