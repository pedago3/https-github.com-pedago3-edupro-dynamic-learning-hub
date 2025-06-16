
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';
import { ResourceCard } from './ResourceCard';

interface Resource {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  courses?: {
    title: string;
  };
}

interface ResourceListProps {
  resources: Resource[] | undefined;
  isLoading: boolean;
  onDelete: (resourceId: string) => void;
  isDeleting: boolean;
  onAddResource: () => void;
}

export const ResourceList = ({ 
  resources, 
  isLoading, 
  onDelete, 
  isDeleting, 
  onAddResource 
}: ResourceListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (resources?.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune ressource</h3>
          <p className="text-muted-foreground mb-4">
            Commencez par ajouter votre première ressource.
          </p>
          <Button onClick={onAddResource}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une ressource
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {resources?.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};
