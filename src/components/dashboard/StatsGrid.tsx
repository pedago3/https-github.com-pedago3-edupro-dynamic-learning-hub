
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Target, Award, TrendingUp } from 'lucide-react';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { ResponsiveCard } from '@/components/layout/ResponsiveCard';

interface StatsData {
  totalCourses: number;
  averageProgress: number;
  todayMissions: number;
  completedMissionsToday: number;
  totalBadges: number;
  completedLessons: number;
}

interface StatsGridProps {
  stats: StatsData | null;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  const statCards = [
    {
      title: 'Cours inscrits',
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      subtitle: `Progression moyenne: ${Math.round(stats?.averageProgress || 0)}%`,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      priority: 1
    },
    {
      title: 'Missions du jour',
      value: `${stats?.completedMissionsToday || 0}/${stats?.todayMissions || 0}`,
      icon: Target,
      subtitle: 'Missions complétées aujourd\'hui',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      priority: 2
    },
    {
      title: 'Badges obtenus',
      value: stats?.totalBadges || 0,
      icon: Award,
      subtitle: 'Récompenses débloquées',
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      priority: 3
    },
    {
      title: 'Leçons terminées',
      value: stats?.completedLessons || 0,
      icon: TrendingUp,
      subtitle: 'Leçons complétées au total',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      priority: 4
    }
  ];

  return (
    <ResponsiveGrid
      columns={{ mobile: 1, tablet: 2, desktop: 2, xl: 4 }}
      gap={{ mobile: '1rem', tablet: '1.5rem', desktop: '2rem', xl: '2rem' }}
    >
      {statCards.map((card, index) => (
        <ResponsiveCard
          key={card.title}
          sizes={{ mobile: 'full', tablet: 'auto', desktop: 'auto' }}
          priority={card.priority}
          className="hover-lift animate-fade-in"
          minHeight="160px"
        >
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-slate-700">{card.title}</h3>
            <div className={`p-2 bg-gradient-to-r ${card.gradient} rounded-lg shadow-md`}>
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className={`bg-gradient-to-br ${card.bgGradient} rounded-xl p-4 mt-2`}>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 animate-shimmer">{card.value}</div>
            <p className="text-xs text-slate-600">
              {card.subtitle}
            </p>
          </div>
        </ResponsiveCard>
      ))}
    </ResponsiveGrid>
  );
};
