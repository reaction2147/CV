import { NextResponse } from "next/server";
import { z } from "zod";
import { GeneratedDocumentType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateApplicationContent, processJobDescription } from "@/lib/ai";
import { getOrCreateSessionId } from "@/lib/session-cookie";

export const createSchema = z.object({
  title: z.string().min(2),
  company: z.string().min(2),
  location: z.string().optional().nullable(),
  sourceUrl: z.string().url().optional().nullable(),
  description: z.string().min(30),
  tone: z.enum(["PROFESSIONAL", "WARM", "ENTHUSIASTIC", "FORMAL"]),
  cvTitle: z.string().min(2).optional().or(z.literal("")),
  cvText: z.string().min(20),
});

export async function GET() {
  const sessionId = await getOrCreateSessionId();
  const apps = await prisma.application.findMany({
    where: { sessionId },
    include: { jobPosting: true, generatedDocs: true, oneTimePurchases: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json({ applications: apps });
}

export async function POST(request: Request) {
  const sessionId = await getOrCreateSessionId();

  const json = await request.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    const issues = parsed.error.issues?.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    return NextResponse.json({ error: "Invalid payload", detail: issues }, { status: 400 });
  }

  const existingCv = await prisma.cV.findFirst({ where: { sessionId }, orderBy: { createdAt: "desc" } });

  let cv = existingCv;
  if (parsed.data.cvText) {
    const cvTitle = parsed.data.cvTitle?.trim() || "CV";
    if (cv) {
      cv = await prisma.cV.update({
        where: { id: cv.id },
        data: { title: cvTitle, rawText: parsed.data.cvText },
      });
    } else {
      cv = await prisma.cV.create({
        data: {
          sessionId,
          title: cvTitle,
          rawText: parsed.data.cvText,
        },
      });
    }
  }

  if (!cv) {
    return NextResponse.json({ error: "Please add a CV first." }, { status: 400 });
  }

  const insights = await processJobDescription(parsed.data.description, parsed.data.company);

  const jobPosting = await prisma.jobPosting.create({
    data: {
      sessionId,
      title: parsed.data.title,
      company: parsed.data.company,
      location: parsed.data.location || null,
      sourceUrl: parsed.data.sourceUrl || null,
      rawDescription: parsed.data.description,
      cleanedDescription: insights.cleanedDescription,
      extractedRequirements: {
        mustHaveSkills: insights.mustHaveSkills,
        niceToHaveSkills: insights.niceToHaveSkills,
        responsibilities: insights.responsibilities,
        roleTitle: insights.roleTitle,
        seniority: insights.seniority,
        summary: insights.summary,
      },
      extractedKeywords: insights.keywords,
      companyTone: insights.companyTone,
      roleSummary: insights.summary,
    },
  });

  const generation = await generateApplicationContent({
    cv: { rawText: cv.rawText, structuredData: cv.structuredData ?? undefined },
    job: {
      title: jobPosting.title,
      company: jobPosting.company,
      cleanedDescription: jobPosting.cleanedDescription,
      extractedKeywords: jobPosting.extractedKeywords,
      extractedRequirements: jobPosting.extractedRequirements,
      companyTone: jobPosting.companyTone,
    },
    tone: parsed.data.tone,
    templateStyle: "clean",
  });

  const docsToCreate = [
    {
      type: GeneratedDocumentType.CV,
      htmlTemplate: generation.cvHtml,
      blurredPreviewHtml: JSON.stringify(generation.structuredCv),
      atsScore: generation.atsScore,
      atsFeedback: generation.atsFeedback,
    },
  ];

  const application = await prisma.application.create({
    data: {
      sessionId,
      cvId: cv.id,
      jobPostingId: jobPosting.id,
      tone: parsed.data.tone,
      letterLength: "STANDARD",
      matchScore: generation.atsScore,
      generatedDocs: { create: docsToCreate },
    },
    include: { generatedDocs: true, jobPosting: true, oneTimePurchases: true },
  });

  return NextResponse.json({ application, jobPosting });
}
