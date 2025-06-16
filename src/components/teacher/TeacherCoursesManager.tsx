
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TeacherCourses } from './TeacherCourses';
import { CreateCourseForm } from './CreateCourseForm';
import { CreateLessonForm } from './CreateLessonForm';
import { EditCourseForm } from './EditCourseForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CompleteProgrammingForm } from './CompleteProgrammingForm';

export const TeacherCoursesManager = () => {
  const { user } = useAuth();
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showCreateLesson, setShowCreateLesson] = useState<string | null>(null);
  const [editCourse, setEditCourse] = useState<{ id: string; data: any } | null>(null);
  const [showAnnualProgramming, setShowAnnualProgramming] = useState(false);

  const handleEditCourse = (courseId: string, courseData: any) => {
    setEditCourse({ id: courseId, data: courseData });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold">Mes Cours</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowCreateCourse(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 rounded text-white hover:shadow hover:scale-105 transition-all"
          >
            + Nouveau cours
          </button>
          <button
            onClick={() => setShowAnnualProgramming((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              showAnnualProgramming
                ? "bg-green-600 text-white"
                : "bg-white border border-green-400 text-green-700"
            } hover:shadow transition-all`}
          >
            {showAnnualProgramming ? "Fermer la programmation" : "Programmation annuelle"}
          </button>
        </div>
      </div>

      {/* Formulaire de programmation annuelle */}
      {showAnnualProgramming && <CompleteProgrammingForm />}

      {/* Gestion des cours classique */}
      {!showAnnualProgramming && (
        <TeacherCourses
          onCreateCourse={() => setShowCreateCourse(true)}
          onCreateLesson={(courseId) => setShowCreateLesson(courseId)}
          onEditCourse={handleEditCourse}
        />
      )}

      {/* Dialogs pour création/edition */}
      <Dialog open={showCreateCourse} onOpenChange={setShowCreateCourse}>
        <DialogContent className="max-w-2xl">
          <CreateCourseForm onClose={() => setShowCreateCourse(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!showCreateLesson} onOpenChange={() => setShowCreateLesson(null)}>
        <DialogContent className="max-w-2xl">
          {showCreateLesson && (
            <CreateLessonForm
              courseId={showCreateLesson}
              onClose={() => setShowCreateLesson(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editCourse} onOpenChange={() => setEditCourse(null)}>
        <DialogContent className="max-w-2xl">
          {editCourse && (
            <EditCourseForm
              courseId={editCourse.id}
              courseData={editCourse.data}
              onClose={() => setEditCourse(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
