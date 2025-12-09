"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

type Props = {
  description: string;
  keywords?: string[];
  mustHaves?: string[];
};

export function JobDetailsAccordion({ description, keywords = [], mustHaves = [] }: Props) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="job">
        <AccordionTrigger className="text-base font-semibold">Job description & extracted keywords</AccordionTrigger>
        <AccordionContent className="space-y-4 rounded-xl border border-border/70 bg-white p-4 text-sm text-muted-foreground">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Job description</p>
            <p className="whitespace-pre-wrap leading-relaxed">{description}</p>
          </div>
          {keywords.length ? (
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Extracted keywords</p>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Badge key={keyword} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
          {mustHaves.length ? (
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Must-have skills</p>
              <ul className="space-y-1">
                {mustHaves.map((req) => (
                  <li key={req}>• {req}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
