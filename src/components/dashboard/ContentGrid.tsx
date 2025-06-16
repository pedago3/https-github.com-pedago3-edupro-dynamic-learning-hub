
import React from 'react';
import { RecentCourses } from './RecentCourses';
import { WeeklyGoals } from './WeeklyGoals';
import { AdaptiveLayout } from '@/components/layout/AdaptiveLayout';

interface ContentGridProps {
  recentEnrollments: any[];
  completedMissionsToday: number;
}

export const ContentGrid = ({ recentEnrollments, completedMissionsToday }: ContentGridProps) => {
  return (
    <AdaptiveLayout type="grid" className="lg:grid-cols-2">
      <RecentCourses recentEnrollments={recentEnrollments} />
      <WeeklyGoals completedMissionsToday={completedMissionsToday} />
    </AdaptiveLayout>
  );
};
