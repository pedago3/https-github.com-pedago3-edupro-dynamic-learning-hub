
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { File, Download, Trash2, Youtube, FileText, Image, Presentation } from 'lucide-react';

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    description?: string;
    file_url: string;
    file_type?: string;
    file_size?: number;
    courses?: {
      title: string;
    };
  };
  onDelete: (resourceId: string) => void;
  isDeleting: boolean;
}

export const ResourceCard = ({ resource, onDelete, isDeleting }: ResourceCardProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Taille inconnue';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType?.toLowerCase()) {
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-600" />;
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-600" />;
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'pptx':
        return <Presentation className="h-4 w-4 text-orange-600" />;
      case 'jpg':
      case 'png':
      case 'gif':
        return <Image className="h-4 w-4 text-green-600" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType?.toLowerCase()) {
      case 'youtube':
        return 'bg-red-100 text-red-800';
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'docx':
        return 'bg-blue-100 text-blue-800';
      case 'pptx':
        return 'bg-orange-100 text-orange-800';
      case 'jpg':
      case 'png':
      case 'gif':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isDownloadableFile = (fileType: string) => {
    const downloadableTypes = ['pdf', 'docx', 'pptx', 'jpg', 'png', 'gif'];
    return downloadableTypes.includes(fileType?.toLowerCase());
  };

  const isYouTubeVideo = (fileType: string) => {
    return fileType?.toLowerCase() === 'youtube';
  };

  const getActionButton = () => {
    if (isYouTubeVideo(resource.file_type || '')) {
      return (
        <Button size="sm" variant="outline" asChild>
          <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
            <Youtube className="h-4 w-4 mr-1 text-red-600" />
            Regarder
          </a>
        </Button>
      );
    }

    if (isDownloadableFile(resource.file_type || '')) {
      return (
        <Button size="sm" variant="outline" asChild>
          <a href={resource.file_url} target="_blank" rel="noopener noreferrer" download>
            <Download className="h-4 w-4 mr-1" />
            Télécharger
          </a>
        </Button>
      );
    }

    return (
      <Button size="sm" variant="outline" asChild>
        <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
          <Download className="h-4 w-4 mr-1" />
          Ouvrir
        </a>
      </Button>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              {getFileTypeIcon(resource.file_type || '')}
            </div>
            <div>
              <h3 className="font-semibold">{resource.title}</h3>
              <p className="text-sm text-muted-foreground">
                {resource.description || 'Aucune description'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {resource.courses?.title && (
                  <Badge variant="secondary" className="text-xs">
                    {resource.courses.title}
                  </Badge>
                )}
                {resource.file_type && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getFileTypeColor(resource.file_type)}`}
                  >
                    {resource.file_type === 'youtube' ? 'YouTube' : resource.file_type.toUpperCase()}
                  </Badge>
                )}
                {resource.file_size && resource.file_size > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(resource.file_size)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getActionButton()}
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-600 hover:text-red-700"
              onClick={() => onDelete(resource.id)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
