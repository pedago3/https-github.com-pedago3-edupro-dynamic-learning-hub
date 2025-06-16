
import { useState } from 'react';
import { TeacherClasses } from './TeacherClasses';
import { CreateClassForm } from './CreateClassForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export const TeacherClassesManager = () => {
  const [showCreateClass, setShowCreateClass] = useState(false);

  return (
    <div className="space-y-6">
      <TeacherClasses onCreateClass={() => setShowCreateClass(true)} />

      <Dialog open={showCreateClass} onOpenChange={setShowCreateClass}>
        <DialogContent className="max-w-2xl">
          <CreateClassForm onClose={() => setShowCreateClass(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
