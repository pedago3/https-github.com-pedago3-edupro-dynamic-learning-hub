
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap } from 'lucide-react';

interface WeeklyGoalsProps {
  completedMissionsToday: number;
}

export const WeeklyGoals = ({ completedMissionsToday }: WeeklyGoalsProps) => {
  return (
    <Card className="glass border-white/20 backdrop-blur-xl hover-lift transition-all duration-300 animate-fade-in animation-delay-700">
      <CardHeader>
        <CardTitle className="gradient-text flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Objectifs de la semaine
        </CardTitle>
        <CardDescription>Restez motivé avec vos objectifs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-slate-700">Missions quotidiennes</span>
            <span className="text-slate-600">{completedMissionsToday || 0}/7</span>
          </div>
          <Progress 
            value={((completedMissionsToday || 0) / 7) * 100} 
            className="h-3 bg-white/30"
          />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-slate-700">Heures d'étude</span>
            <span className="text-slate-600">0/10h</span>
          </div>
          <Progress value={0} className="h-3 bg-white/30" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-slate-700">Nouveaux badges</span>
            <span className="text-slate-600">0/2</span>
          </div>
          <Progress value={0} className="h-3 bg-white/30" />
        </div>
      </CardContent>
    </Card>
  );
};
