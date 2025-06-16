
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFileTypeOptions } from './fileTypeUtils';

interface FileFieldsProps {
  fileUrl: string;
  fileType: string;
  fileSize: number;
  onFileUrlChange: (value: string) => void;
  onFileTypeChange: (value: string) => void;
  onFileSizeChange: (value: number) => void;
}

export const FileFields = ({
  fileUrl,
  fileType,
  fileSize,
  onFileUrlChange,
  onFileTypeChange,
  onFileSizeChange
}: FileFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="file_url">URL du fichier *</Label>
        <Input
          id="file_url"
          value={fileUrl}
          onChange={(e) => onFileUrlChange(e.target.value)}
          placeholder="https://exemple.com/fichier.pdf"
          type="url"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="file_type">Type de fichier</Label>
          <Select value={fileType} onValueChange={onFileTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le type" />
            </SelectTrigger>
            <SelectContent>
              {getFileTypeOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="file_size">Taille (en octets)</Label>
          <Input
            id="file_size"
            type="number"
            value={fileSize}
            onChange={(e) => onFileSizeChange(Number(e.target.value))}
            placeholder="0"
            min={0}
          />
        </div>
      </div>
    </>
  );
};
