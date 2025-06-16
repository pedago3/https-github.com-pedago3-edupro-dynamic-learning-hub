
interface TeacherStudentsHeaderProps {
  studentCount: number;
}

export const TeacherStudentsHeader = ({ studentCount }: TeacherStudentsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Gestion des élèves</h2>
      <div className="text-sm text-muted-foreground">
        {studentCount} élève{studentCount === 1 ? "" : "s"} inscrit{studentCount === 1 ? "" : "s"}
      </div>
    </div>
  );
};
