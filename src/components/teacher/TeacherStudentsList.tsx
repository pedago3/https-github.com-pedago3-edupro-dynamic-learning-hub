
import { TeacherStudentCard } from './TeacherStudentCard';
import { TeacherStudentsEmpty } from './TeacherStudentsEmpty';

interface TeacherStudentsListProps {
  students: any[];
  onStudentUpdated: () => void;
}

export const TeacherStudentsList = ({ students, onStudentUpdated }: TeacherStudentsListProps) => {
  if (students.length === 0) {
    return <TeacherStudentsEmpty />;
  }

  return (
    <div className="space-y-4">
      {students.map((student: any) => (
        <TeacherStudentCard
          key={student.id}
          student={student}
          onStudentUpdated={onStudentUpdated}
        />
      ))}
    </div>
  );
};
