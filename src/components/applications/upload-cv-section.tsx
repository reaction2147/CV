import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function UploadCVSection({
  value,
  onFile,
  cvTitle,
  onTitleChange,
  error,
}: {
  value: string;
  onFile: (file: File | null) => void;
  cvTitle: string;
  onTitleChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Upload CV (DOCX preferred) — accepts DOCX, DOC, TXT, MD, RTF
        </Label>
        <button
          type="button"
          onClick={() => document.getElementById("cv-upload-input")?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-slate-50 px-4 py-6 text-sm font-medium text-muted-foreground transition hover:border-primary hover:bg-primary/5"
        >
          <Upload className="h-4 w-4" />
          Choose file
        </button>
        <input
          id="cv-upload-input"
          type="file"
          accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document,.doc,.docx,.txt,.md,.rtf"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cvTitle">CV Title (optional)</Label>
        <Input
          id="cvTitle"
          placeholder="e.g. Product Manager CV"
          value={cvTitle}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Extracted CV text (non-editable)</Label>
        <div className="max-h-64 overflow-auto rounded-xl bg-[#F8F9FA] p-3 text-sm text-muted-foreground">
          <pre className="whitespace-pre-wrap leading-relaxed">{value || "Upload a file to see the extracted text here."}</pre>
        </div>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <p className="text-xs text-muted-foreground">We only use text for ATS optimization. PDFs are not supported.</p>
      </div>
    </div>
  );
}
