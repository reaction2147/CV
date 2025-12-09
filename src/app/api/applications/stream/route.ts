import { NextResponse } from "next/server";
import { GeneratedDocumentType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateApplicationContent, processJobDescription } from "@/lib/ai";
import { getOrCreateSessionId } from "@/lib/session-cookie";
import { createSchema } from "../route";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const sessionId = await getOrCreateSessionId();
  const json = await request.json();
  const parsed = createSchema.safeParse(json);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      if (!parsed.success) {
        send({
          step: "error",
          message: parsed.error.issues?.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
        });
        controller.close();
        return;
      }

      try {
        send({ step: "received" });

        const existingCv = await prisma.cV.findFirst({ where: { sessionId }, orderBy: { createdAt: "desc" } });
        const cvTitle = parsed.data.cvTitle?.trim() || "CV";

        let cv = existingCv;
        if (parsed.data.cvText) {
          if (cv) {
            cv = await prisma.cV.update({
              where: { id: cv.id },
              data: { title: cvTitle, rawText: parsed.data.cvText },
            });
          } else {
            cv = await prisma.cV.create({
              data: { sessionId, title: cvTitle, rawText: parsed.data.cvText },
            });
          }
        }

        if (!cv) {
          send({ step: "error", message: "Please add a CV first." });
          controller.close();
          return;
        }

        send({ step: "processing_jd" });
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

        send({ step: "generating" });
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

        send({ step: "saving" });
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
          include: { generatedDocs: true },
        });

        send({ step: "done", applicationId: application.id });
        controller.close();
      } catch (error: any) {
        send({ step: "error", message: error?.message || "Generation failed" });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
