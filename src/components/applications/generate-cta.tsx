import { Button } from "@/components/ui/button";

export function GenerateCTA({ disabled, submitting }: { disabled?: boolean; submitting?: boolean }) {
  return (
    <div className="sticky bottom-0 z-10 rounded-t-xl border border-border/70 bg-white/95 p-4 shadow-lg sm:static sm:border-none sm:bg-transparent sm:p-0 sm:shadow-none">
      <Button type="submit" disabled={disabled} className="w-full rounded-lg text-base">
        {submitting ? "Generating..." : "Generate document"}
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">Regenerate for free until you pay to unlock.</p>
    </div>
  );
}
