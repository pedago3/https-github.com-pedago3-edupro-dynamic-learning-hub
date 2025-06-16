
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface RecentBadgesProps {
  badges: any[];
}

export const RecentBadges = ({ badges }: RecentBadgesProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Badges récents</CardTitle>
      <CardDescription>Vos dernières récompenses obtenues</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.slice(0, 6).map((studentBadge: any) => (
          <div key={studentBadge.id} className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="text-2xl">
              {studentBadge.badges?.icon || '🏆'}
            </div>
            <div>
              <h4 className="font-medium">{studentBadge.badges?.name}</h4>
              <p className="text-xs text-muted-foreground">
                Obtenu le {new Date(studentBadge.earned_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

