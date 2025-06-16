
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ResourceTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ResourceTypeSelector = ({ value, onChange }: ResourceTypeSelectorProps) => {
  return (
    <div>
      <Label htmlFor="resource_type">Type de ressource</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez le type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="file">Fichier</SelectItem>
          <SelectItem value="youtube">Vidéo YouTube</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
