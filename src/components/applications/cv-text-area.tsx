import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function CvTextArea({
  value,
  onChange,
  error,
  placeholder,
  rows = 12,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="cvText">CV content</Label>
      <Textarea
        id="cvText"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
