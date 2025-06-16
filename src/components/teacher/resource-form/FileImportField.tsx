
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, File } from 'lucide-react';
import { getFileTypeOptions } from './fileTypeUtils';

interface FileImportFieldProps {
  onFileSelect: (file: File, fileType: string) => void;
  selectedFileType: string;
  onFileTypeChange: (value: string) => void;
}

export const FileImportField = ({ 
  onFileSelect, 
  selectedFileType, 
  onFileTypeChange 
}: FileImportFieldProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Auto-détecter le type de fichier
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension) {
        const typeMap: { [key: string]: string } = {
          'pdf': 'pdf',
          'docx': 'docx',
          'pptx': 'pptx',
          'jpg': 'jpg',
          'jpeg': 'jpg',
          'png': 'png',
          'gif': 'gif'
        };
        
        const detectedType = typeMap[extension];
        if (detectedType) {
          onFileTypeChange(detectedType);
        }
      }
      
      onFileSelect(file, selectedFileType);
    }
  };

  const acceptedFileTypes = ".pdf,.docx,.pptx,.jpg,.jpeg,.png,.gif";

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file_import">Importer un fichier *</Label>
        <div className="flex items-center space-x-2">
          <Upload className="h-4 w-4 text-blue-600" />
          <Input
            id="file_import"
            type="file"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
            required
          />
        </div>
        {selectedFile && (
          <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
            <File className="h-4 w-4" />
            <span>{selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</span>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="file_type_import">Type de fichier</Label>
        <Select value={selectedFileType} onValueChange={onFileTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez le type" />
          </SelectTrigger>
          <SelectContent>
            {getFileTypeOptions().filter(option => 
              ['pdf', 'docx', 'pptx', 'jpg', 'png', 'gif'].includes(option.value)
            ).map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
