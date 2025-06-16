
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';

export const TeacherStatsLoadingSkeleton = () => {
  return (
    <ResponsiveGrid
      columns={{ mobile: 1, tablet: 2, desktop: 3, xl: 3 }}
      autoFit={false}
    >
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="animate-pulse glass border-white/20">
          <CardContent className="p-8">
            <div className="h-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
          </CardContent>
        </Card>
      ))}
    </ResponsiveGrid>
  );
};
