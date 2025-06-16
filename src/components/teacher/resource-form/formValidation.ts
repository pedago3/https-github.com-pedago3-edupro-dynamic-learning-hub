
export const validateResourceForm = (formData: any) => {
  const errors: string[] = [];

  if (!formData.title.trim()) {
    errors.push("Le titre est requis.");
  }

  if (formData.resource_type === 'youtube' && !formData.youtube_url.trim()) {
    errors.push("L'URL YouTube est requise pour ce type de ressource.");
  }

  if (formData.resource_type === 'file' && formData.file_method === 'url' && !formData.file_url.trim()) {
    errors.push("L'URL du fichier est requise pour ce type de ressource.");
  }

  return errors;
};
