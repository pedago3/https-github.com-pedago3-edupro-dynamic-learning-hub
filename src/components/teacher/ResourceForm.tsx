
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BasicFormFields } from './resource-form/BasicFormFields';
import { CourseSelector } from './resource-form/CourseSelector';
import { ResourceTypeSelector } from './resource-form/ResourceTypeSelector';
import { YouTubeUrlField } from './resource-form/YouTubeUrlField';
import { FileFields } from './resource-form/FileFields';
import { FileMethodSelector } from './resource-form/FileMethodSelector';
import { FileImportField } from './resource-form/FileImportField';
import { FormActions } from './resource-form/FormActions';
import { validateResourceForm } from './resource-form/formValidation';

interface Course {
  id: string;
  title: string;
}

interface ResourceFormProps {
  courses: Course[] | undefined;
  onClose: () => void;
}

export const ResourceForm = ({ courses, onClose }: ResourceFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    file_url: '',
    youtube_url: '',
    file_type: '',
    file_size: 0,
    resource_type: 'file',
    file_method: 'url'
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const createResourceMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user) throw new Error('Utilisateur non connecté');

      let fileUrl = data.file_url;
      let fileSize = data.file_size;

      // Si un fichier est sélectionné pour l'import, on simule l'upload
      // Dans un vrai projet, vous devriez utiliser Supabase Storage ou un autre service
      if (selectedFile && data.file_method === 'import') {
        // Simulation d'upload - remplacez par votre logique d'upload réelle
        fileUrl = `uploaded/${selectedFile.name}`;
        fileSize = selectedFile.size;
        
        console.log('Fichier à uploader:', selectedFile);
        // TODO: Implémenter l'upload vers Supabase Storage ou autre service
      }

      const resourceData = {
        title: data.title,
        description: data.description,
        course_id: data.course_id === 'no-course' ? null : data.course_id,
        file_url: data.resource_type === 'youtube' ? data.youtube_url : fileUrl,
        file_type: data.resource_type === 'youtube' ? 'youtube' : data.file_type,
        file_size: data.resource_type === 'youtube' ? 0 : fileSize,
        teacher_id: user.id
      };

      const { data: resource, error } = await supabase
        .from('resources')
        .insert(resourceData)
        .select()
        .single();

      if (error) throw error;
      return resource;
    },
    onSuccess: () => {
      toast({
        title: "Ressource ajoutée avec succès",
        description: "Votre ressource a été ajoutée et est maintenant disponible."
      });
      queryClient.invalidateQueries({ queryKey: ['teacher-resources'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-stats'] });
      
      setFormData({
        title: '',
        description: '',
        course_id: '',
        file_url: '',
        youtube_url: '',
        file_type: '',
        file_size: 0,
        resource_type: 'file',
        file_method: 'url'
      });
      setSelectedFile(null);
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la ressource. Veuillez réessayer.",
        variant: "destructive"
      });
      console.error('Erreur ajout ressource:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateResourceForm(formData);
    if (validationErrors.length > 0) {
      toast({
        title: "Erreur",
        description: validationErrors[0],
        variant: "destructive"
      });
      return;
    }

    // Validation supplémentaire pour l'import de fichier
    if (formData.resource_type === 'file' && formData.file_method === 'import' && !selectedFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier à importer.",
        variant: "destructive"
      });
      return;
    }

    createResourceMutation.mutate(formData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileSelect = (file: File, fileType: string) => {
    setSelectedFile(file);
    updateFormData('file_size', file.size);
    updateFormData('file_type', fileType);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter une nouvelle ressource</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <BasicFormFields
            title={formData.title}
            description={formData.description}
            onTitleChange={(value) => updateFormData('title', value)}
            onDescriptionChange={(value) => updateFormData('description', value)}
          />

          <CourseSelector
            courses={courses}
            value={formData.course_id}
            onChange={(value) => updateFormData('course_id', value)}
          />

          <ResourceTypeSelector
            value={formData.resource_type}
            onChange={(value) => updateFormData('resource_type', value)}
          />

          {formData.resource_type === 'youtube' && (
            <YouTubeUrlField
              value={formData.youtube_url}
              onChange={(value) => updateFormData('youtube_url', value)}
            />
          )}

          {formData.resource_type === 'file' && (
            <>
              <FileMethodSelector
                value={formData.file_method}
                onChange={(value) => updateFormData('file_method', value)}
              />

              {formData.file_method === 'url' && (
                <FileFields
                  fileUrl={formData.file_url}
                  fileType={formData.file_type}
                  fileSize={formData.file_size}
                  onFileUrlChange={(value) => updateFormData('file_url', value)}
                  onFileTypeChange={(value) => updateFormData('file_type', value)}
                  onFileSizeChange={(value) => updateFormData('file_size', value)}
                />
              )}

              {formData.file_method === 'import' && (
                <FileImportField
                  onFileSelect={handleFileSelect}
                  selectedFileType={formData.file_type}
                  onFileTypeChange={(value) => updateFormData('file_type', value)}
                />
              )}
            </>
          )}

          <FormActions
            resourceType={formData.resource_type}
            isSubmitting={createResourceMutation.isPending}
            onCancel={onClose}
          />
        </form>
      </CardContent>
    </Card>
  );
};
