
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ResourceForm } from './ResourceForm';
import { ResourceList } from './ResourceList';
import { useResourceMutations } from '@/hooks/useResourceMutations';
import { useTeacherCourses } from '@/hooks/useTeacherCourses';
import { useTeacherResources } from '@/hooks/useTeacherResources';

export const ResourceManager = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);

  const { data: courses } = useTeacherCourses();
  const { data: resources, isLoading } = useTeacherResources();
  const { deleteResourceMutation } = useResourceMutations();

  const handleDeleteResource = (resourceId: string) => {
    deleteResourceMutation.mutate(resourceId);
  };

  const handleCloseForm = () => {
    setShowUploadForm(false);
  };

  const handleAddResource = () => {
    setShowUploadForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestionnaire de ressources</h2>
        <Button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter une ressource
        </Button>
      </div>

      {showUploadForm && (
        <ResourceForm
          courses={courses}
          onClose={handleCloseForm}
        />
      )}

      <ResourceList
        resources={resources}
        isLoading={isLoading}
        onDelete={handleDeleteResource}
        isDeleting={deleteResourceMutation.isPending}
        onAddResource={handleAddResource}
      />
    </div>
  );
};
