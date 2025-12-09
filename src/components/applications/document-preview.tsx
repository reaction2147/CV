"use client";

import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CV_PRICE_LABEL } from "@/lib/config";
import { LockedOverlay } from "./locked-overlay";

type Props = {
  title: string;
  html: string;
  locked: boolean;
  unlockHref: string;
  atsScore?: number | null;
  reasons?: string[];
  unlockedActions?: ReactNode;
};

export function DocumentPreview({ title, html, locked, unlockHref, atsScore, reasons, unlockedActions }: Props) {
  const insights = reasons?.length ? reasons : ["Aligned keywords", "Clear structure", "Concise tone"];

  return (
    <div className="relative space-y-3 rounded-2xl border border-border/70 bg-white/95 p-4 shadow-md shadow-primary/5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="outline">{title}</Badge>
          {typeof atsScore === "number" ? (
            <Badge className="bg-primary/10 text-primary">Fit: {Math.round(atsScore)} / 100</Badge>
          ) : null}
        </div>
        {!locked ? (
          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm" onClick={() => downloadHtml(html, `${title.replace(/\s+/g, "-").toLowerCase()}.html`)}>
              Download CV
            </Button>
            <Button variant="outline" size="sm" onClick={() => copyTextFromHtml(html)}>
              Copy text
            </Button>
            <Button variant="secondary" size="sm" onClick={() => emailText(html)}>
              Email to yourself
            </Button>
            {unlockedActions}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl bg-slate-50/80 p-3 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Why your score is {atsScore ?? "–"}</p>
        <ul className="mt-2 space-y-1">
          {insights.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-white">
        <div
          className={cn(
            "prose max-w-none p-6 leading-relaxed tracking-tight prose-headings:font-semibold prose-headings:tracking-tight prose-p:mb-3",
            locked ? "select-none" : ""
          )}
          style={{ WebkitUserSelect: locked ? "none" : undefined, userSelect: locked ? "none" : undefined }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {locked ? <LockedOverlay label="Locked – Unlock to download or copy" /> : null}
      </div>

      {locked ? (
        <div className="flex items-center justify-between rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          <span>Export actions are locked until you purchase this document.</span>
          <Button size="sm" asChild>
            <a href={unlockHref}>Unlock ({CV_PRICE_LABEL})</a>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-foreground">Your CV is unlocked — export or share it.</div>
          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm" onClick={() => downloadHtml(html, `${title.replace(/\s+/g, "-").toLowerCase()}.html`)}>
              Download CV
            </Button>
            <Button variant="outline" size="sm" onClick={() => copyTextFromHtml(html)}>
              Copy text
            </Button>
            <Button variant="secondary" size="sm" onClick={() => emailText(html)}>
              Email to yourself
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function downloadHtml(html: string, filename: string) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function copyTextFromHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = doc.body?.innerText || "";
  navigator.clipboard?.writeText(text);
}

function emailText(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = doc.body?.innerText || "";
  window.location.href = `mailto:?subject=Your tailored CV&body=${encodeURIComponent(text)}`;
}
