"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

type Props = {
  score?: number | null;
  strengths?: string[];
  improvements?: string[];
  missingKeywords?: string[];
};

export function ATSAccordion({ score, strengths = [], improvements = [], missingKeywords = [] }: Props) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="ats">
        <AccordionTrigger className="text-base font-semibold">ATS Insights</AccordionTrigger>
        <AccordionContent className="space-y-4 rounded-xl border border-border/70 bg-white p-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground">Fit Score:</p>
            {typeof score === "number" ? <Badge className="bg-primary/10 text-primary">{Math.round(score)} / 100</Badge> : "–"}
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Strengths</p>
            <ul className="space-y-1">
              {(strengths.length ? strengths : ["Alignment looks good."]).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Improvements</p>
            <ul className="space-y-1">
              {(improvements.length ? improvements : ["Add missing keywords relevant to the job description."]).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Missing keywords</p>
            <div className="flex flex-wrap gap-2">
              {(missingKeywords.length ? missingKeywords : ["Impact", "Ownership", "Team collaboration"]).map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
