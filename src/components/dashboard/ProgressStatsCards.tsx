
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, BookOpen, Target, Award } from "lucide-react";

interface ProgressStatsCardsProps {
  overallProgress?: number;
  completedLessonsCount?: number;
  totalLessons?: number;
  completedMissionsThisWeek?: number;
  totalMissionsThisWeek?: number;
  weeklyProgress?: number;
  badgesCount?: number;
}

export const ProgressStatsCards = ({
  overallProgress,
  completedLessonsCount,
  totalLessons,
  completedMissionsThisWeek,
  totalMissionsThisWeek,
  weeklyProgress,
  badgesCount
}: ProgressStatsCardsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Progression générale</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{Math.round(overallProgress || 0)}%</div>
        <div className="mt-2">
          <Progress value={overallProgress || 0} />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Leçons terminées</CardTitle>
        <BookOpen className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {completedLessonsCount} / {totalLessons}
        </div>
        <p className="text-xs text-muted-foreground">
          {totalLessons && totalLessons > 0 
            ? `${Math.round(((completedLessonsCount || 0) / totalLessons) * 100)}% complété`
            : 'Aucune leçon disponible'
          }
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Missions cette semaine</CardTitle>
        <Target className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {completedMissionsThisWeek} / {totalMissionsThisWeek}
        </div>
        <div className="mt-2">
          <Progress value={weeklyProgress || 0} />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Badges obtenus</CardTitle>
        <Award className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{badgesCount || 0}</div>
        <p className="text-xs text-muted-foreground">
          Récompenses débloquées
        </p>
      </CardContent>
    </Card>
  </div>
);
