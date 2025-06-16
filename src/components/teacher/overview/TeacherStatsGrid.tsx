
import React from 'react';
import { BookOpen, Users, FileText, Calendar, TrendingUp, Award } from 'lucide-react';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { ResponsiveCard } from '@/components/layout/ResponsiveCard';

interface TeacherStats {
  coursesCount: number;
  classesCount: number;
  studentsCount: number;
  assessmentsCount: number;
  resourcesCount: number;
  eventsCount: number;
}

interface TeacherStatsGridProps {
  stats: TeacherStats | null;
}

export const TeacherStatsGrid = ({ stats }: TeacherStatsGridProps) => {
  const statItems = [
    {
      title: 'Cours créés',
      value: stats?.coursesCount || 0,
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      shadowColor: 'shadow-blue-200',
      priority: 1
    },
    {
      title: 'Classes gérées',
      value: stats?.classesCount || 0,
      icon: Users,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      shadowColor: 'shadow-emerald-200',
      priority: 2
    },
    {
      title: 'Étudiants inscrits',
      value: stats?.studentsCount || 0,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-violet-500',
      bgGradient: 'from-purple-50 to-violet-50',
      shadowColor: 'shadow-purple-200',
      priority: 3
    },
    {
      title: 'Évaluations',
      value: stats?.assessmentsCount || 0,
      icon: FileText,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      shadowColor: 'shadow-orange-200',
      priority: 4
    },
    {
      title: 'Ressources',
      value: stats?.resourcesCount || 0,
      icon: Award,
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50',
      shadowColor: 'shadow-pink-200',
      priority: 5
    },
    {
      title: 'Événements',
      value: stats?.eventsCount || 0,
      icon: Calendar,
      gradient: 'from-indigo-500 to-blue-500',
      bgGradient: 'from-indigo-50 to-blue-50',
      shadowColor: 'shadow-indigo-200',
      priority: 6
    }
  ];

  return (
    <ResponsiveGrid
      columns={{ mobile: 1, tablet: 2, desktop: 3, xl: 3 }}
      gap={{ mobile: '1rem', tablet: '1.5rem', desktop: '2rem', xl: '2rem' }}
    >
      {statItems.map((item, index) => (
        <ResponsiveCard
          key={item.title}
          sizes={{ mobile: 'full', tablet: 'auto', desktop: 'auto' }}
          priority={item.priority}
          className={`hover:${item.shadowColor} hover:shadow-xl animate-fade-in`}
          minHeight="180px"
        >
          <div className={`p-4 sm:p-6 lg:p-8 bg-gradient-to-br ${item.bgGradient} rounded-xl h-full`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between h-full">
              <div className="space-y-3 flex-1">
                <p className="text-sm sm:text-base font-medium text-slate-700 tracking-wide">
                  {item.title}
                </p>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 animate-shimmer">
                  {item.value}
                </p>
              </div>
              <div className={`p-3 sm:p-4 bg-gradient-to-r ${item.gradient} rounded-2xl shadow-lg hover-glow transition-all duration-300 mt-4 sm:mt-0 sm:ml-4`}>
                <item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-white/30 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${item.gradient} transition-all duration-1000 ease-out`}
                style={{ 
                  width: `${Math.min((item.value / 10) * 100, 100)}%`,
                  animationDelay: `${index * 200 + 1000}ms`
                }}
              ></div>
            </div>
          </div>
        </ResponsiveCard>
      ))}
    </ResponsiveGrid>
  );
};
