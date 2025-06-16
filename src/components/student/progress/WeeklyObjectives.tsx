
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap } from 'lucide-react';

interface WeeklyObjectivesProps {
  completedMissionsThisWeek: number;
  overallProgress: number;
}

export const WeeklyObjectives = ({
  completedMissionsThisWeek,
  overallProgress
}: WeeklyObjectivesProps) => {
  return (
    <Card className="bg-gradient-to-br from-violet-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-violet-700">
          <Zap className="h-5 w-5" />
          Objectifs de la semaine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Missions quotidiennes</span>
            <span>{completedMissionsThisWeek}/7</span>
          </div>
          <Progress 
            value={(completedMissionsThisWeek / 7) * 100} 
            className="h-2"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Progression cours</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress 
            value={overallProgress} 
            className="h-2"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Nouveaux badges</span>
            <span>0/2</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};
