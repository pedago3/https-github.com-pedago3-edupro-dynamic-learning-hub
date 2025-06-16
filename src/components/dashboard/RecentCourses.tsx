
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen } from 'lucide-react';

interface RecentCoursesProps {
  recentEnrollments: any[];
}

export const RecentCourses = ({ recentEnrollments }: RecentCoursesProps) => {
  return (
    <Card className="glass border-white/20 backdrop-blur-xl hover-lift transition-all duration-300 animate-fade-in animation-delay-500">
      <CardHeader>
        <CardTitle className="gradient-text flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Cours récents
        </CardTitle>
        <CardDescription>Vos dernières inscriptions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentEnrollments?.length ? (
          recentEnrollments.map((enrollment: any, index: number) => (
            <div 
              key={enrollment.id} 
              className={`flex items-center justify-between p-4 glass rounded-xl border border-white/20 backdrop-blur-sm hover-lift transition-all duration-300 animate-fade-in`}
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <div>
                <h4 className="font-medium text-slate-800">{enrollment.courses?.title}</h4>
                <p className="text-sm text-slate-500">
                  Inscrit le {new Date(enrollment.enrolled_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">{Math.round(enrollment.progress || 0)}%</p>
                <Progress 
                  value={enrollment.progress || 0} 
                  className="w-20 h-2 bg-white/30" 
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4 animate-float" />
            <p className="text-slate-500">Aucun cours inscrit pour le moment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
