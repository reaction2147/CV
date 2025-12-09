"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type Props = {
  before?: number;
  after?: number;
  whatImproved?: string[];
};

const colorForScore = (score?: number) => {
  if (score === undefined || score === null) return "text-slate-700";
  if (score < 40) return "text-rose-600";
  if (score < 70) return "text-amber-600";
  return "text-emerald-600";
};

export function AtsScoreHero({ before, after, whatImproved = [] }: Props) {
  const delta = before !== undefined && after !== undefined ? after - before : undefined;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/70 bg-white/95 p-5 shadow-md shadow-primary/5"
    >
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-primary">Your ATS Score Improved!</p>
        <div className="flex items-center justify-center gap-3 text-3xl font-bold">
          <span className={cn(colorForScore(before))}>{before ?? "–"}</span>
          <span className="text-slate-400 text-lg">→</span>
          <span className={cn(colorForScore(after))}>{after ?? "–"}</span>
        </div>
        {delta !== undefined ? (
          <p className="text-sm font-semibold text-emerald-600">+{delta} points</p>
        ) : (
          <p className="text-sm text-muted-foreground">Tailored to match the job better.</p>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-sm font-semibold text-foreground">What we improved for you</p>
        <ul className="space-y-1 text-sm text-slate-700">
          {(whatImproved.length ? whatImproved : ["Strengthened keywords and quantified achievements."]).map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 text-emerald-600">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <Accordion type="single" collapsible className="mt-3">
        <AccordionItem value="remaining">
          <AccordionTrigger className="text-sm font-semibold">Additional opportunities to improve</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-slate-400">•</span>
                <span>Fine-tune a few keywords to align even further.</span>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
