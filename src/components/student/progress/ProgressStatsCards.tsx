
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, BookOpen, Target, Award } from 'lucide-react';

interface ProgressStatsCardsProps {
  overallProgress: number;
  completedLessonsCount: number;
  totalLessons: number;
  completedMissionsThisWeek: number;
  totalMissionsThisWeek: number;
  weeklyProgress: number;
  badgesCount: number;
}

export const ProgressStatsCards = ({
  overallProgress,
  completedLessonsCount,
  totalLessons,
  completedMissionsThisWeek,
  totalMissionsThisWeek,
  weeklyProgress,
  badgesCount
}: ProgressStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progression générale</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">
            {Math.round(overallProgress)}%
          </div>
          <Progress 
            value={overallProgress} 
            className="mt-2 h-2"
          />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Leçons terminées</CardTitle>
          <BookOpen className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {completedLessonsCount} / {totalLessons}
          </div>
          <p className="text-xs text-green-600 mt-1">
            Leçons complétées
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Missions semaine</CardTitle>
          <Target className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">
            {completedMissionsThisWeek} / {totalMissionsThisWeek}
          </div>
          <Progress 
            value={weeklyProgress} 
            className="mt-2 h-2"
          />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Badges obtenus</CardTitle>
          <Award className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">
            {badgesCount}
          </div>
          <p className="text-xs text-purple-600 mt-1">
            Récompenses débloquées
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
