
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Edit } from 'lucide-react';

type CourseType = {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  lessons?: { count: number }[];
  course_enrollments?: { count: number }[];
};

interface TeacherCoursePreviewProps {
  course: CourseType;
  onClose: () => void;
  onCreateLesson: (courseId: string) => void;
  onEdit: (course: CourseType) => void;
}

export const TeacherCoursePreview = ({
  course,
  onClose,
  onCreateLesson,
  onEdit
}: TeacherCoursePreviewProps) => (
  <Card className="mt-6">
    <CardHeader>
      <CardTitle>Aperçu du cours : {course.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Description</h4>
          <p className="text-muted-foreground">
            {course.description || 'Aucune description disponible'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {course.lessons?.[0]?.count || 0}
            </div>
            <div className="text-sm text-muted-foreground">Leçons</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {course.course_enrollments?.[0]?.count || 0}
            </div>
            <div className="text-sm text-muted-foreground">Étudiants inscrits</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {new Date(course.created_at).toLocaleDateString()}
            </div>
            <div className="text-sm text-muted-foreground">Date de création</div>
          </div>
        </div>
        <div className="flex gap-2 pt-4">
          <Button onClick={() => onCreateLesson(course.id)}>
            <PlayCircle className="h-4 w-4 mr-2" />
            Créer une leçon
          </Button>
          <Button variant="outline" onClick={() => onEdit(course)}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="outline" onClick={onClose}>
            Fermer l'aperçu
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
