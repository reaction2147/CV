import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function FileUploader({
  onFile,
  label,
  helper,
  id = "file",
  accept = ".txt,.md,.pdf,.doc,.docx",
}: {
  onFile: (file: File | null) => void;
  label?: string;
  helper?: string;
  id?: string;
  accept?: string;
}) {
  return (
    <div className="space-y-2">
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <Input
        id={id}
        type="file"
        accept={accept}
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      {helper ? <p className="text-xs text-muted-foreground">{helper}</p> : null}
    </div>
  );
}
