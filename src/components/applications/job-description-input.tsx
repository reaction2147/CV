import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function JobDescriptionInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Job description</Label>
      <Textarea
        id="description"
        rows={10}
        placeholder="Paste the full job description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
