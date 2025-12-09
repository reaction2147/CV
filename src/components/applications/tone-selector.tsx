import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ToneOption = {
  value: string;
  label: string;
};

export function ToneSelector({
  options,
  value,
  onChange,
}: {
  options: ToneOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Tone</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid gap-2 sm:grid-cols-2"
      >
        {options.map((tone) => (
          <Label
            key={tone.value}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-lg border border-border/80 bg-white px-3 py-2 text-sm hover:border-primary",
              value === tone.value && "border-primary bg-primary/5 text-primary"
            )}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value={tone.value} id={tone.value} />
              <span>{tone.label}</span>
            </div>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
