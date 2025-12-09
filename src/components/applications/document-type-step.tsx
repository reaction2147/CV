import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { CV_PRICE_LABEL } from "@/lib/config";

type DocType = "CV" | "COVER_LETTER";

export function DocumentTypeStep({
  value,
  onSelect,
}: {
  value: DocType | null;
  onSelect: (v: DocType) => void;
}) {
  const cards = [
    {
      value: "CV" as DocType,
      title: "Generate CV",
      price: CV_PRICE_LABEL,
      description: "Get an ATS-optimised, professional CV tailored to your job description.",
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">What would you like to generate?</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          const active = value === card.value;
          return (
            <button
              key={card.value}
              type="button"
              onClick={() => onSelect(card.value)}
              className={cn(
                "flex h-full flex-col justify-between rounded-xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40",
                active ? "border-primary/60 shadow-primary/10" : "border-border/70"
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary",
                        active && "bg-primary/15"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-base font-semibold text-foreground">{card.title}</p>
                      <p className="text-sm text-muted-foreground">{card.price}</p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border",
                      active ? "border-primary bg-primary" : "border-border"
                    )}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
              <div className="pt-3 text-sm font-semibold text-primary">
                {active ? "Selected" : "Tap to choose"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
