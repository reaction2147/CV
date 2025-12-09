import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PasteCVSection({
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
      <Label htmlFor="cvText">Paste CV or resume</Label>
      <Textarea
        id="cvText"
        rows={12}
        placeholder="Paste your full CV/resume text here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[220px]"
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <p className="text-xs text-muted-foreground">Tip: Include your latest roles and quantified achievements.</p>
    </div>
  );
}
