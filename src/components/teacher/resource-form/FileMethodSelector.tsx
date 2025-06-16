
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FileMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const FileMethodSelector = ({ value, onChange }: FileMethodSelectorProps) => {
  return (
    <div>
      <Label htmlFor="file_method">Méthode d'ajout de fichier</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez la méthode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="url">URL du fichier</SelectItem>
          <SelectItem value="import">Importer un fichier</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
