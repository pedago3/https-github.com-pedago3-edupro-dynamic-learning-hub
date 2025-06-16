
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { RecentActivity } from '@/components/teacher/RecentActivity';

export const TeacherActivitySection = () => {
  return (
    <Card className="glass border-white/20 backdrop-blur-xl hover-lift transition-all duration-300 animate-fade-in animation-delay-1000">
      <CardHeader className="pb-6">
        <CardTitle className="responsive-card-title gradient-text flex items-center gap-3">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
          Activité récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RecentActivity />
      </CardContent>
    </Card>
  );
};
