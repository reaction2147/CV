"use client";

import { cn } from "@/lib/utils";

export function LockedOverlay({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 pointer-events-auto cursor-not-allowed select-none" style={{ userSelect: "none" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/70" />
      <div
        className={cn(
          "absolute right-4 top-4 rounded-full border border-primary/30 bg-white/80 px-3 py-1 text-xs font-semibold text-primary shadow-sm"
        )}
      >
        {label}
      </div>
      <div className="absolute inset-0" style={{ userSelect: "none" }} />
    </div>
  );
}
