
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Course {
  id: string;
  title: string;
}

interface CourseSelectorProps {
  courses: Course[] | undefined;
  value: string;
  onChange: (value: string) => void;
}

export const CourseSelector = ({ courses, value, onChange }: CourseSelectorProps) => {
  return (
    <div>
      <Label htmlFor="course">Cours (optionnel)</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un cours" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no-course">Aucun cours spécifique</SelectItem>
          {courses?.map((course) => {
            if (!course?.id || course.id.trim() === '' || !course?.title || course.title.trim() === '') {
              console.warn('Skipping course with invalid data:', course);
              return null;
            }
            
            return (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            );
          }).filter(Boolean)}
        </SelectContent>
      </Select>
    </div>
  );
};
