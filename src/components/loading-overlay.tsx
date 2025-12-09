"use client";

type Props = {
  steps: string[];
  active: number;
};

export function LoadingOverlay({ steps, active }: Props) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/85 backdrop-blur-xl">
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-white/90 p-6 shadow-2xl shadow-primary/10">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-2 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">Crafting your document…</p>
            <p className="text-sm text-muted-foreground">This usually takes a few seconds.</p>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          {steps.map((step, idx) => (
            <div key={step} className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  idx === active ? "bg-primary animate-pulse" : "bg-primary/25"
                }`}
              />
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
