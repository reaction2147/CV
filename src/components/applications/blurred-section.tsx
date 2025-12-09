import { cn } from "@/lib/utils";

export function BlurredSection({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none rounded-2xl border border-white/40 bg-white/60 shadow-inner backdrop-blur-xl",
        className
      )}
    />
  );
}
