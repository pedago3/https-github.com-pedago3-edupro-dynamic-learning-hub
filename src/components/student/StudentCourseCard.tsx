
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { LessonEnrollments } from './LessonEnrollments';

interface StudentCourseCardProps {
  enrollment: any;
  isExpanded: boolean;
  onToggleExpand: (courseId: string) => void;
}

export const StudentCourseCard = ({
  enrollment,
  isExpanded,
  onToggleExpand,
}: StudentCourseCardProps) => {
  const course = enrollment.courses;
  const progress = enrollment.progress || 0;
  const lessonCount = course.lessons?.[0]?.count || 0;

  return (
    <div className="space-y-4">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <span className="line-clamp-2">{course.title}</span>
            <Badge variant={progress >= 100 ? "default" : "secondary"}>
              {progress >= 100 ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <Clock className="h-3 w-3 mr-1" />
              )}
              {Math.round(progress)}%
            </Badge>
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {course.description || 'Aucune description disponible'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {lessonCount} leçons
              </span>
              <span>
                Inscrit le {new Date(enrollment.enrolled_at).toLocaleDateString()}
              </span>
            </div>

            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Professeur : </span>
              {course.profiles?.full_name || 'Non spécifié'}
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                variant={progress >= 100 ? "outline" : "default"}
              >
                <Play className="h-4 w-4 mr-2" />
                {progress >= 100 ? 'Revoir le cours' : 'Continuer'}
              </Button>

              <Button
                variant="outline"
                onClick={() => onToggleExpand(course.id)}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isExpanded && (
        <div className="ml-6">
          <LessonEnrollments
            courseId={course.id}
            courseTitle={course.title}
          />
        </div>
      )}
    </div>
  );
};
