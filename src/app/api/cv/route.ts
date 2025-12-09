import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session-cookie";

const cvSchema = z.object({
  title: z.string().min(2).max(120),
  rawText: z.string().min(20),
  structuredData: z.any().optional(),
});

export async function POST(request: Request) {
  const sessionId = await getOrCreateSessionId();

  const payload = await request.json();
  const parsed = cvSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const existingCv = await prisma.cV.findFirst({ where: { sessionId }, orderBy: { createdAt: "desc" } });

  const cv = existingCv
    ? await prisma.cV.update({
        where: { id: existingCv.id },
        data: {
          title: parsed.data.title,
          rawText: parsed.data.rawText,
          structuredData: parsed.data.structuredData,
        },
      })
    : await prisma.cV.create({
        data: {
          sessionId,
          title: parsed.data.title,
          rawText: parsed.data.rawText,
          structuredData: parsed.data.structuredData,
        },
      });

  return NextResponse.json({ cv });
}
