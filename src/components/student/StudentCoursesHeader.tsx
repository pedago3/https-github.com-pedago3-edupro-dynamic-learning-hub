
import { BookOpen } from "lucide-react";

export const StudentCoursesHeader = () => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
      <BookOpen className="h-6 w-6 text-white" />
    </div>
    <div>
      <h2 className="responsive-title">Mes cours</h2>
      <p className="responsive-subtitle">
        Suivez votre progression dans vos cours
      </p>
    </div>
  </div>
);
