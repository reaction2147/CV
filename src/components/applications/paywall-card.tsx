"use client";

import { FileText, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CV_PRICE_LABEL } from "@/lib/config";

type Props = {
  docType: "CV" | "COVER_LETTER";
  priceLabel?: string;
  unlockHref: string;
};

export function PaywallCard({ docType, priceLabel = CV_PRICE_LABEL, unlockHref }: Props) {
  const isCv = docType === "CV";
  const Icon = isCv ? FileText : PenLine;
  const title = "Your tailored CV is ready";

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 z-30 w-auto rounded-2xl border border-border/70 bg-white/95 p-4 shadow-lg shadow-primary/10 md:static md:w-full md:sticky md:top-4"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">Unlock to download, copy, or email your fully rewritten GPT-5 CV.</p>
        </div>
        <div className="text-right text-sm font-semibold text-foreground">{priceLabel}</div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button asChild className="flex-1">
          <a href={unlockHref}>Unlock Full CV ({priceLabel})</a>
        </Button>
        <Button variant="ghost" size="sm" className="text-sm text-primary hover:text-primary/80" asChild>
          <a href="/applications/new">Regenerate for free</a>
        </Button>
        <p className="text-xs text-muted-foreground text-center w-full sm:w-auto">One-time payment. No subscription.</p>
      </div>
    </div>
  );
}
