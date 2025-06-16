
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CourseProgressListProps {
  enrollments: any[];
}

export const CourseProgressList = ({ enrollments }: CourseProgressListProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Progression par cours</CardTitle>
      <CardDescription>Votre avancement dans chaque cours inscrit</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {enrollments.length ? (
        enrollments.map((enrollment: any) => (
          <div key={enrollment.id} className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h4 className="font-medium">{enrollment.courses?.title}</h4>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-mono rounded bg-slate-100 px-2 py-0.5">
                  {enrollment.courseCompletedLessonsCount} / {enrollment.totalCourseLessons} leçons
                </span>
                <span className="hidden sm:inline">|</span>
                <span className="text-xs">
                  {Math.round(enrollment.progress || 0)}%
                </span>
              </div>
            </div>
            {/* Barre de progression foncée */}
            <Progress
              value={enrollment.progress || 0}
              className="h-3 bg-slate-800/10 [&>div]:bg-slate-800 transition-all"
            />
            <div className="text-xs text-muted-foreground">
              Inscrit le {new Date(enrollment.enrolled_at).toLocaleDateString()}
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground">Aucun cours inscrit pour le moment.</p>
      )}
    </CardContent>
  </Card>
);
