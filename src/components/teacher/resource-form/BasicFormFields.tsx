
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface BasicFormFieldsProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export const BasicFormFields = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange
}: BasicFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title">Titre de la ressource *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Nom de la ressource..."
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Description de la ressource..."
          rows={3}
        />
      </div>
    </>
  );
};
