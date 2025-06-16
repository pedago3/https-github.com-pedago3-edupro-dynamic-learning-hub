
import React from 'react';
import { TeacherActionButtons } from './TeacherActionButtons';
import { WelcomeHeader } from './overview/WelcomeHeader';
import { TeacherStatsGrid } from './overview/TeacherStatsGrid';
import { TeacherActivitySection } from './overview/TeacherActivitySection';
import { TeacherStatsLoadingSkeleton } from './overview/TeacherStatsLoadingSkeleton';
import { useTeacherStats } from '@/hooks/useTeacherStats';

export const TeacherOverview = () => {
  const { data: stats, isLoading } = useTeacherStats();

  if (isLoading) {
    return <TeacherStatsLoadingSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <WelcomeHeader />

      {/* Action Buttons Section */}
      <TeacherActionButtons />

      {/* Stats Grid with Responsive Layout */}
      <TeacherStatsGrid stats={stats} />

      {/* Activity Section */}
      <TeacherActivitySection />
    </div>
  );
};
