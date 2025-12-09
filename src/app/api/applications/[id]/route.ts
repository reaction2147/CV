import { NextResponse } from "next/server";
import { z } from "zod";
import { ApplicationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session-cookie";

const schema = z.object({
  status: z.nativeEnum(ApplicationStatus),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const sessionId = await getOrCreateSessionId();

  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: { session: true },
  });

  if (!application || application.sessionId !== sessionId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.application.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ application: updated });
}
