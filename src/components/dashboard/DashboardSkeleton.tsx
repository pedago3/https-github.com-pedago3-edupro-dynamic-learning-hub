
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const DashboardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse glass border-white/20">
          <CardContent className="p-6">
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
