
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Youtube } from 'lucide-react';

interface YouTubeUrlFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const YouTubeUrlField = ({ value, onChange }: YouTubeUrlFieldProps) => {
  return (
    <div>
      <Label htmlFor="youtube_url">URL YouTube *</Label>
      <div className="flex items-center space-x-2">
        <Youtube className="h-4 w-4 text-red-600" />
        <Input
          id="youtube_url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          type="url"
          required
        />
      </div>
    </div>
  );
};
