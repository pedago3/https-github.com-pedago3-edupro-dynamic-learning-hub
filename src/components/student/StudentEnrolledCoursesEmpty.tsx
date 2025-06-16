
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export const StudentEnrolledCoursesEmpty = () => (
  <Card>
    <CardContent className="p-12 text-center">
      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Aucun cours inscrit</h3>
      <p className="text-muted-foreground mb-4">
        Vous n'êtes inscrit à aucun cours pour le moment.
      </p>
    </CardContent>
  </Card>
);
