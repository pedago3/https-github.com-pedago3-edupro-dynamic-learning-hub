
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { BookOpen, Eye, Edit, Trash2, Plus, PlayCircle } from 'lucide-react';

type CourseType = {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  lessons?: { count: number }[];
  course_enrollments?: { count: number }[];
};

interface TeacherCourseCardProps {
  course: CourseType;
  onView: (course: CourseType) => void;
  onEdit: (course: CourseType) => void;
  onDelete: (courseId: string) => void;
  onCreateLesson: (courseId: string) => void;
}

export const TeacherCourseCard = ({
  course,
  onView,
  onEdit,
  onDelete,
  onCreateLesson
}: TeacherCourseCardProps) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="flex items-start justify-between">
        <span className="line-clamp-2">{course.title}</span>
        <Badge variant="secondary">
          {course.course_enrollments?.[0]?.count || 0} étudiants
        </Badge>
      </CardTitle>
      <CardDescription className="line-clamp-3">
        {course.description || 'Aucune description disponible'}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          {course.lessons?.[0]?.count || 0} leçons
        </span>
        <span>
          Créé le {new Date(course.created_at).toLocaleDateString()}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={() => onView(course)}
        >
          <Eye className="h-4 w-4 mr-1" />
          Voir
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onCreateLesson(course.id)}
          title="Créer une leçon"
        >
          <PlayCircle className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onEdit(course)}
          title="Modifier le cours"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-600 hover:text-red-700"
              title="Supprimer le cours"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer le cours</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer le cours "{course.title}" ? 
                Cette action est irréversible et supprimera également toutes les leçons associées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(course.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CardContent>
  </Card>
);
