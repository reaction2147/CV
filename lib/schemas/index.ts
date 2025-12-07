import { z } from "zod";

export const ResumeSectionSchema = z.object({
  title: z.string(),
  bullets: z.array(z.string()),
});

export const ResumeSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  contact: z.array(z.string()).optional(),
  summary: z.string().optional(),
  sections: z.array(ResumeSectionSchema),
  rawText: z.string(),
});

export type StructuredResume = z.infer<typeof ResumeSchema>;

export const RewriteRequestSchema = z.object({
  resume_id: z.string(),
  role: z.string().optional(),
  industry: z.string().optional(),
});

export const StrictParsedResumeSchema = z.object({
  summary: z.string().nullable(),
  skills: z.array(z.string()).nullable(),
  jobs: z
    .array(
      z.object({
        title: z.string().nullable(),
        company: z.string().nullable(),
        start_date: z.string().nullable(),
        end_date: z.string().nullable(),
        bullets: z.array(z.string()),
      })
    )
    .default([]),
  education: z.array(z.string()).nullable(),
});

export type StrictParsedResume = z.infer<typeof StrictParsedResumeSchema>;

export const AtsRewriteResponseSchema = z.object({
  optimized_html: z.string(),
  keywords_used: z.array(z.string()).default([]),
  missing_keywords: z.array(z.string()).default([]),
  ats_score: z.number().min(0).max(100).default(70),
});

export type AtsRewriteResponse = z.infer<typeof AtsRewriteResponseSchema>;

export const MatchRequestSchema = z.object({
  resume_id: z.string(),
  jd_text: z.string(),
});

export const JdMatchResponseSchema = z.object({
  missing_keywords: z.array(z.string()).default([]),
  matched_keywords: z.array(z.string()).default([]),
  rewritten_bullets: z.array(z.string()).default([]),
  improved_summary: z.string().default(""),
});

export const CoverLetterSchema = z.object({
  resume_id: z.string(),
  jd_text: z.string().optional(),
  industry: z.string().optional(),
  role: z.string().optional(),
  tone: z.string().optional(),
});

export const CoverLetterResponseSchema = z.object({
  cover_letter_html: z.string(),
});

export const PdfExportSchema = z.object({
  html: z.string(),
  fileName: z.string().default("ats-resume.pdf"),
});
