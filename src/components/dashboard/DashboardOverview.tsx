
import React from 'react';
import { StudentActionButtons } from '@/components/student/StudentActionButtons';
import { WelcomeSection } from './WelcomeSection';
import { StatsGrid } from './StatsGrid';
import { ContentGrid } from './ContentGrid';
import { DashboardSkeleton } from './DashboardSkeleton';
import { useDashboardData } from '@/hooks/useDashboardData';

export const DashboardOverview = () => {
  const { data: stats, isLoading } = useDashboardData();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <WelcomeSection />
      <StudentActionButtons />
      <StatsGrid stats={stats} />
      <ContentGrid 
        recentEnrollments={stats?.recentEnrollments || []} 
        completedMissionsToday={stats?.completedMissionsToday || 0}
      />
    </div>
  );
};
