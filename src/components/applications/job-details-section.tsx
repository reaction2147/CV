import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobDescriptionInput } from "./job-description-input";

type Errors = {
  title?: string;
  company?: string;
  description?: string;
};

export function JobDetailsSection({
  register,
  errors,
  description,
  onDescriptionChange,
  letterLength,
  onLetterLengthChange,
  showLetterLength,
}: {
  register: any;
  errors: Errors;
  description: string;
  onDescriptionChange: (v: string) => void;
  letterLength: string;
  onLetterLengthChange: (v: string) => void;
  showLetterLength: boolean;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-border/70 bg-white p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Job title</Label>
          <Input id="title" placeholder="Product Designer" {...register("title")}
          />
          {errors.title ? <p className="text-xs text-destructive">{errors.title}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" placeholder="Acme Inc." {...register("company")}
          />
          {errors.company ? <p className="text-xs text-destructive">{errors.company}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location (optional)</Label>
          <Input id="location" placeholder="Remote / London" {...register("location")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sourceUrl">Job URL (optional)</Label>
          <Input id="sourceUrl" placeholder="https://company.com/job" {...register("sourceUrl")} />
        </div>
      </div>

      <JobDescriptionInput
        value={description}
        onChange={onDescriptionChange}
        error={errors.description}
      />

      {showLetterLength ? (
        <div className="space-y-2">
          <Label>Letter length</Label>
          <Select value={letterLength} onValueChange={onLetterLengthChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SHORT">Short</SelectItem>
              <SelectItem value="STANDARD">Standard</SelectItem>
              <SelectItem value="DETAILED">Detailed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}
    </div>
  );
}
