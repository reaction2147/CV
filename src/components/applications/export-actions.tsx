"use client";

import { Button } from "@/components/ui/button";

export function ExportActions({ html }: { html: string }) {
  const filename = "tailored-cv.html";

  const downloadHtml = () => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyTextFromHtml = () => {
    if (!html) return;
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = doc.body?.innerText || "";
    navigator.clipboard?.writeText(text);
  };

  const emailText = () => {
    if (!html) return;
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = doc.body?.innerText || "";
    window.location.href = `mailto:?subject=Your tailored CV&body=${encodeURIComponent(text)}`;
  };

  return (
    <div className="rounded-xl border border-border/70 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm font-semibold text-foreground">Export or share your CV</div>
        <div className="flex flex-wrap gap-2">
          <Button variant="default" size="sm" onClick={downloadHtml}>
            Download CV
          </Button>
          <Button variant="outline" size="sm" onClick={copyTextFromHtml}>
            Copy text
          </Button>
          <Button variant="secondary" size="sm" onClick={emailText}>
            Email to yourself
          </Button>
        </div>
      </div>
    </div>
  );
}
