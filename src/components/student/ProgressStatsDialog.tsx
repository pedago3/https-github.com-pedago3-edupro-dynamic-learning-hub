
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TrendingUp } from 'lucide-react';
import { useProgressStats } from '@/hooks/useProgressStats';
import { ProgressStatsCards } from './progress/ProgressStatsCards';
import { WeeklyObjectives } from './progress/WeeklyObjectives';
import { RecentBadges } from './progress/RecentBadges';
import { ProgressStatsLoading } from './progress/ProgressStatsLoading';

interface ProgressStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProgressStatsDialog = ({ open, onOpenChange }: ProgressStatsDialogProps) => {
  const { data: progressStats, isLoading } = useProgressStats(open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Mes statistiques et objectifs
          </DialogTitle>
          <DialogDescription>
            Consultez votre progression et vos objectifs d'apprentissage
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <ProgressStatsLoading />
        ) : (
          <div className="space-y-6">
            <ProgressStatsCards
              overallProgress={progressStats?.overallProgress || 0}
              completedLessonsCount={progressStats?.completedLessonsCount || 0}
              totalLessons={progressStats?.totalLessons || 0}
              completedMissionsThisWeek={progressStats?.completedMissionsThisWeek || 0}
              totalMissionsThisWeek={progressStats?.totalMissionsThisWeek || 0}
              weeklyProgress={progressStats?.weeklyProgress || 0}
              badgesCount={progressStats?.badges?.length || 0}
            />

            <WeeklyObjectives
              completedMissionsThisWeek={progressStats?.completedMissionsThisWeek || 0}
              overallProgress={progressStats?.overallProgress || 0}
            />

            <RecentBadges badges={progressStats?.badges || []} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
